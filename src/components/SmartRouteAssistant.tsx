'use client';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation, Bus, Clock, ArrowRight, QrCode } from 'lucide-react';
import styles from '@/app/page.module.css';
import routesData from '@/data/routes.json';
import { trackWhatsAppConversion } from '@/utils/trackConversion';



gsap.registerPlugin(ScrollTrigger);

// Bounding box que cobre Sorocaba/Votorantim até a Grande São Paulo.
// Sem isso, o Nominatim pode retornar endereços homônimos em outras cidades
// do Brasil (ex.: "Rua São Bento" existe em dezenas de cidades), fazendo o
// cálculo de distância explodir e o assistente não encontrar nenhuma rota.
// Formato exigido pela API: left,top,right,bottom (lng,lat,lng,lat)
const SEARCH_VIEWBOX = '-47.75,-23.20,-46.55,-23.85';

// Nominatim Search Function
const searchNominatim = async (query: string, signal?: AbortSignal) => {
  if (!query || query.length < 3) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=br&viewbox=${SEARCH_VIEWBOX}&bounded=1&limit=5`,
      {
        headers: { 'Accept-Language': 'pt-BR' },
        signal
      }
    );
    const data = await res.json();
    return data.map((d: any) => ({
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      address: d.display_name
    }));
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.error("Nominatim error:", err);
    }
    return [];
  }
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2-lat1) * (Math.PI/180);
  const dLon = (lon2-lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function SmartRouteAssistant() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Autocomplete state
  const [origQuery, setOrigQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [origResults, setOrigResults] = useState<any[]>([]);
  const [destResults, setDestResults] = useState<any[]>([]);
  const [showOrigResults, setShowOrigResults] = useState(false);
  const [showDestResults, setShowDestResults] = useState(false);

  const origTimer = useRef<NodeJS.Timeout | null>(null);
  const destTimer = useRef<NodeJS.Timeout | null>(null);
  const origAbort = useRef<AbortController | null>(null);
  const destAbort = useRef<AbortController | null>(null);
  const origWrapperRef = useRef<HTMLDivElement>(null);
  const destWrapperRef = useRef<HTMLDivElement>(null);

  const [originPlace, setOriginPlace] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [destPlace, setDestPlace] = useState<{lat: number, lng: number, address: string} | null>(null);
  
  const [viableRoutes, setViableRoutes] = useState<any[]>([]);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [routeTime, setRouteTime] = useState<string>("1h15"); 

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Limpa timers/fetches pendentes ao desmontar o componente
  useEffect(() => {
    return () => {
      if (origTimer.current) clearTimeout(origTimer.current);
      if (destTimer.current) clearTimeout(destTimer.current);
      origAbort.current?.abort();
      destAbort.current?.abort();
    };
  }, []);

  // Fecha os dropdowns de autocomplete ao clicar fora deles
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (origWrapperRef.current && !origWrapperRef.current.contains(e.target as Node)) {
        setShowOrigResults(false);
      }
      if (destWrapperRef.current && !destWrapperRef.current.contains(e.target as Node)) {
        setShowDestResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Raio máximo aceitável até um ponto de embarque/desembarque, em km.
  // 100km (valor original) cobre praticamente todo o estado de SP e faz o
  // assistente "aceitar" combinações de origem/destino sem nenhuma relação
  // real com o trajeto das linhas, o que gera recomendações sem sentido.
  const MAX_BOARDING_DIST_KM = 12;   // até 12km do ponto de embarque em Sorocaba/Votorantim
  const MAX_DROPOFF_DIST_KM = 8;     // até 8km do ponto de desembarque em São Paulo

  const calculateBestRoute = (orig: {lat: number, lng: number, address: string}, dest: {lat: number, lng: number, address: string}) => {
    let viable: any[] = [];

    routesData.lines.forEach(line => {
      let closestB: any = null;
      let minBDist = Infinity;
      line.boardingStops.forEach(stop => {
        const d = getDistanceFromLatLonInKm(orig.lat, orig.lng, stop.lat, stop.lng);
        if (d < minBDist) { minBDist = d; closestB = stop; }
      });

      let closestD: any = null;
      let minDDist = Infinity;
      line.dropoffStops.forEach(stop => {
        const d = getDistanceFromLatLonInKm(dest.lat, dest.lng, stop.lat, stop.lng);
        if (d < minDDist) { minDDist = d; closestD = stop; }
      });

      if (closestB && closestD && minBDist < MAX_BOARDING_DIST_KM && minDDist < MAX_DROPOFF_DIST_KM) {
        const routeDist = getDistanceFromLatLonInKm(closestB.lat, closestB.lng, closestD.lat, closestD.lng);
        const score = (minBDist * 0.4) + (minDDist * 0.4) + (routeDist * 0.2);
        
        viable.push({
          line,
          boarding: closestB,
          dropoff: closestD,
          bDistKm: minBDist,
          dDistKm: minDDist,
          score
        });
      }
    });

    viable.sort((a, b) => a.score - b.score);
    setViableRoutes(viable);
    setSearchedOnce(true);
      
    if (viable.length > 0 && cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }
      );
    }
  };

  const handleOrigChange = (e: any) => {
    const val = e.target.value;
    setOrigQuery(val);
    setShowOrigResults(true);
    setOriginPlace(null); // invalida seleção anterior até o usuário escolher de novo
    if (origTimer.current) clearTimeout(origTimer.current);
    origTimer.current = setTimeout(async () => {
      origAbort.current?.abort();
      origAbort.current = new AbortController();
      const res = await searchNominatim(val, origAbort.current.signal);
      setOrigResults(res);
    }, 500);
  };

  const handleDestChange = (e: any) => {
    const val = e.target.value;
    setDestQuery(val);
    setShowDestResults(true);
    setDestPlace(null); // invalida seleção anterior até o usuário escolher de novo
    if (destTimer.current) clearTimeout(destTimer.current);
    destTimer.current = setTimeout(async () => {
      destAbort.current?.abort();
      destAbort.current = new AbortController();
      const res = await searchNominatim(val, destAbort.current.signal);
      setDestResults(res);
    }, 500);
  };

  const selectOrigin = (place: any) => {
    setOriginPlace(place);
    setOrigQuery(place.address.split(',')[0]);
    setShowOrigResults(false);
    if (destPlace) calculateBestRoute(place, destPlace);
  };

  const selectDest = (place: any) => {
    setDestPlace(place);
    setDestQuery(place.address.split(',')[0]);
    setShowDestResults(false);
    if (originPlace) calculateBestRoute(originPlace, place);
  };

  const handleBook = (route: any) => {
    if (!route || !originPlace || !destPlace) return;
    trackWhatsAppConversion();
    const timeEmbarque = Math.max(2, Math.round(route.bDistKm * 2.5));
    let msg = `Olá, gostaria de reservar minha vaga.\n\nMinha rota recomendada:\nLinha: ${route.line.name}\nEmbarque: ${route.boarding.name}\nDestino: ${route.dropoff.name}\n\nOrigem: ${originPlace.address}\nTempo até embarque: ${timeEmbarque} minutos`;
    
    const leadOrigem = localStorage.getItem('lead_origem');
    if (leadOrigem) {
      msg += `\n\n[Origem da visita: ${leadOrigem}]`;
    }
    
    window.open(`https://wa.me/5511995104279?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const mapCenter = originPlace ? { lat: originPlace.lat, lng: originPlace.lng } : { lat: -23.5015, lng: -47.4581 };

  return (
    <section className={styles.routeAssistantSection} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Descubra sua rota ideal</h2>
        <p className={styles.sectionSubtitle}>Informe seu trajeto diário. Nossa inteligência encontrará a conexão executiva perfeita para você.</p>
      </div>

      {!isVisible ? (
        <div className={styles.assistantLoading}>Iniciando inteligência de rotas...</div>
      ) : (
        <div className={styles.assistantContainer}>
          {/* Inputs Section */}
          <div className={styles.assistantInputs}>
            <div className={styles.inputWrapper} style={{ position: 'relative' }} ref={origWrapperRef}>
              <MapPin size={20} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="De onde você sai? (Rua, Bairro)" 
                className={styles.placesInput} 
                value={origQuery}
                onChange={handleOrigChange}
                onFocus={() => setShowOrigResults(true)}
              />
              {showOrigResults && origResults.length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {origResults.map((res, i) => (
                    <div key={i} className={styles.autocompleteItem} onClick={() => selectOrigin(res)}>
                      {res.address}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.inputSeparator}><ArrowRight size={20} /></div>

            <div className={styles.inputWrapper} style={{ position: 'relative' }} ref={destWrapperRef}>
              <Navigation size={20} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="Para onde você vai? (Rua, Bairro)" 
                className={styles.placesInput} 
                value={destQuery}
                onChange={handleDestChange}
                onFocus={() => setShowDestResults(true)}
              />
              {showDestResults && destResults.length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {destResults.map((res, i) => (
                    <div key={i} className={styles.autocompleteItem} onClick={() => selectDest(res)}>
                      {res.address}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className={styles.assistantLayout}>


            {/* Premium Boarding Pass */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minWidth: '300px' }} ref={cardRef}>
              {searchedOnce && viableRoutes.length === 0 && (
                <div className={styles.boardingPassCard} style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <div className={styles.passHeader}>
                    <span className={styles.passBrand}>BATATA FRETADOS</span>
                    <span className={styles.passTag}>SEM ROTA COMPATÍVEL</span>
                  </div>
                  <h3 className={styles.passLineName} style={{ color: '#aaa', fontSize: '1.2rem', marginTop: '12px' }}>
                    Nenhuma linha atende esse trajeto ainda
                  </h3>
                  <p style={{ color: '#888', marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Seu endereço de origem ou destino está fora do raio das nossas paradas atuais. Fale com a equipe abaixo para avaliarmos um ponto sob medida.
                  </p>
                </div>
              )}
              {viableRoutes.map((route, i) => {
                const timeEmbarque = Math.max(2, Math.round(route.bDistKm * 2.5));
                return (
                <div key={route.line.id} className={styles.boardingPassCard}>
                  <div className={styles.passHeader}>
                    <span className={styles.passBrand}>BATATA FRETADOS</span>
                    <span className={styles.passTag}>{i === 0 ? "MELHOR ROTA COMPATÍVEL" : "OUTRA OPÇÃO DISPONÍVEL"}</span>
                  </div>
                  
                  <h3 className={styles.passLineName} style={{ color: route.line.color }}>{route.line.name}</h3>
                  
                  <div className={styles.passGrid}>
                    <div className={styles.passRow}>
                      <MapPin size={18} className={styles.passIcon} />
                      <div>
                        <div className={styles.passLabel}>Embarque</div>
                        <div className={styles.passValue}>{route.boarding.name}</div>
                      </div>
                    </div>
                    
                    <div className={styles.passRow}>
                      <Navigation size={18} className={styles.passIcon} />
                      <div>
                        <div className={styles.passLabel}>Destino</div>
                        <div className={styles.passValue}>{route.dropoff.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.passMetrics}>
                    <div className={styles.metric}>
                      <Bus size={20} style={{ color: 'var(--accent-gold)' }} />
                      <div>
                        <div className={styles.metricLabel}>Tempo até ônibus</div>
                        <div className={styles.metricValue}>{timeEmbarque} minutos</div>
                      </div>
                    </div>
                    <div className={styles.metric}>
                      <Clock size={20} style={{ color: 'var(--accent-gold)' }} />
                      <div>
                        <div className={styles.metricLabel}>Viagem estimada</div>
                        <div className={styles.metricValue}>{routeTime}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.passFooter}>
                    <button onClick={() => handleBook(route)} className={styles.btnPrimary} style={{ flex: 1, padding: '16px' }}>
                      Reservar Linha
                    </button>
                    <div className={styles.qrCodePlaceholder}>
                      <QrCode size={32} opacity={0.3} />
                    </div>
                  </div>
                </div>
              )})}
              
              {/* Card de Sugerir Novo Ponto */}
              <div className={styles.boardingPassCard} style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className={styles.passHeader}>
                  <span className={styles.passBrand}>PONTO SOB MEDIDA</span>
                </div>
                <h3 className={styles.passLineName} style={{ color: '#aaa', fontSize: '1.2rem', marginTop: '12px' }}>Não encontrou um ponto ideal perto de casa?</h3>
                <p style={{ color: '#888', marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Nosso trajeto é flexível. Fale com a equipe e avaliaremos a possibilidade de embarque no seu endereço sugerido.
                </p>
                <div className={styles.passFooter} style={{ marginTop: '20px' }}>
                  <button onClick={() => {
                    trackWhatsAppConversion();
                    window.open(`https://wa.me/5511995104279?text=${encodeURIComponent(`Olá, não encontrei um ponto ideal no site. O meu endereço é: ${originPlace?.address || ''}. Seria possível criar uma parada próxima?`)}`, '_blank');
                  }} className={styles.btnPrimary} style={{ flex: 1, padding: '16px', background: '#333', color: '#fff' }}>
                    Sugerir Ponto no WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
