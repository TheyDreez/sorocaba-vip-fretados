'use client';
import { useState, useRef, useEffect } from 'react';
import { useLoadScript, Autocomplete, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation, Bus, Clock, ArrowRight, QrCode } from 'lucide-react';
import styles from '@/app/page.module.css';
import routesData from '@/data/routes.json';

gsap.registerPlugin(ScrollTrigger);

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

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

  // Lazy Load Trigger
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const originRef = useRef<google.maps.places.Autocomplete>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete>(null);

  const [originPlace, setOriginPlace] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [destPlace, setDestPlace] = useState<{lat: number, lng: number, address: string} | null>(null);
  
  const [bestRoute, setBestRoute] = useState<any>(null);
  const [realTime, setRealTime] = useState<string>("Calculando...");
  const [routeTime, setRouteTime] = useState<string>("1h15"); // Static estimate for bus route

  const calculateBestRoute = (orig: {lat: number, lng: number, address: string}, dest: {lat: number, lng: number, address: string}) => {
    let best: any = null;
    let minScore = Infinity;

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

      if (closestB && closestD) {
        const routeDist = getDistanceFromLatLonInKm(closestB.lat, closestB.lng, closestD.lat, closestD.lng);
        // Weight: 40% boarding dist, 40% dropoff dist, 20% route dist
        const score = (minBDist * 0.4) + (minDDist * 0.4) + (routeDist * 0.2);

        if (score < minScore) {
          minScore = score;
          best = {
            line,
            boarding: closestB,
            dropoff: closestD,
            bDistKm: minBDist,
            dDistKm: minDDist
          };
        }
      }
    });

    if (best) {
      setBestRoute(best);
      
      // GSAP Reveal for the card
      if (cardRef.current) {
        gsap.fromTo(cardRef.current, 
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }
        );
      }

      // If we have API loaded, calculate real driving time to boarding
      if (window.google && window.google.maps) {
        const ds = new window.google.maps.DistanceMatrixService();
        ds.getDistanceMatrix({
          origins: [new window.google.maps.LatLng(orig.lat, orig.lng)],
          destinations: [new window.google.maps.LatLng((best as any).boarding.lat, (best as any).boarding.lng)],
          travelMode: window.google.maps.TravelMode.DRIVING,
        }).then((res) => {
          if (res.rows[0].elements[0].status === 'OK') {
            setRealTime(res.rows[0].elements[0].duration.text);
          } else {
            setRealTime(`${Math.round((best as any).bDistKm * 3)} minutos`); // fallback 3 mins per km
          }
        }).catch(() => {
          setRealTime(`${Math.round(best.bDistKm * 3)} minutos`);
        });
      }
    }
  };

  const handlePlaceChanged = (type: 'origin' | 'dest') => {
    const autocomplete = type === 'origin' ? originRef.current : destinationRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const data = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || place.name || ''
        };
        
        if (type === 'origin') {
          setOriginPlace(data);
          if (destPlace) calculateBestRoute(data, destPlace);
        } else {
          setDestPlace(data);
          if (originPlace) calculateBestRoute(originPlace, data);
        }
      }
    }
  };

  const handleBook = () => {
    if (!bestRoute || !originPlace || !destPlace) return;
    const msg = `Olá, gostaria de reservar minha vaga.\n\nMinha rota recomendada:\nLinha: ${bestRoute.line.name}\nEmbarque: ${bestRoute.boarding.name}\nDestino: ${bestRoute.dropoff.name}\n\nOrigem: ${originPlace.address}\nTempo até embarque: ${realTime}`;
    window.open(`https://wa.me/5511995104279?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const mapCenter = originPlace ? { lat: originPlace.lat, lng: originPlace.lng } : { lat: -23.5015, lng: -47.4581 };

  return (
    <section className={styles.routeAssistantSection} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Descubra sua rota ideal</h2>
        <p className={styles.sectionSubtitle}>Informe seu trajeto diário. Nossa inteligência encontrará a conexão executiva perfeita para você.</p>
      </div>

      {!isLoaded || !isVisible ? (
        <div className={styles.assistantLoading}>Iniciando inteligência de rotas...</div>
      ) : (
        <div className={styles.assistantContainer}>
          {/* Inputs Section */}
          <div className={styles.assistantInputs}>
            <div className={styles.inputWrapper}>
              <MapPin size={20} className={styles.inputIcon} />
              <Autocomplete onLoad={(ref) => originRef.current = ref} onPlaceChanged={() => handlePlaceChanged('origin')}>
                <input type="text" placeholder="De onde você sai? (Ex: Casa)" className={styles.placesInput} />
              </Autocomplete>
            </div>
            
            <div className={styles.inputSeparator}><ArrowRight size={20} /></div>

            <div className={styles.inputWrapper}>
              <Navigation size={20} className={styles.inputIcon} />
              <Autocomplete onLoad={(ref) => destinationRef.current = ref} onPlaceChanged={() => handlePlaceChanged('dest')}>
                <input type="text" placeholder="Para onde você vai? (Ex: Trabalho)" className={styles.placesInput} />
              </Autocomplete>
            </div>
          </div>

          {/* Results Area */}
          <div className={styles.assistantLayout}>
            {/* Map Area */}
            <div className={styles.mapContainerDark}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                center={mapCenter}
                zoom={bestRoute ? 10 : 12}
                options={{
                  disableDefaultUI: true,
                  styles: googleMapDarkStyle // Defined below
                }}
              >
                {originPlace && <Marker position={originPlace} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "#ffffff", fillOpacity: 1, strokeWeight: 2, strokeColor: "#000" }} />}
                {destPlace && <Marker position={destPlace} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "#ffffff", fillOpacity: 1, strokeWeight: 2, strokeColor: "#000" }} />}
                
                {bestRoute && (
                  <>
                    <Marker position={bestRoute.boarding} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: bestRoute.line.color, fillOpacity: 1, strokeWeight: 2, strokeColor: "#000" }} />
                    <Marker position={bestRoute.dropoff} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: bestRoute.line.color, fillOpacity: 1, strokeWeight: 2, strokeColor: "#000" }} />
                    <Polyline 
                      path={[bestRoute.boarding, bestRoute.dropoff]}
                      options={{ strokeColor: bestRoute.line.color, strokeOpacity: 0.8, strokeWeight: 4 }}
                    />
                  </>
                )}
              </GoogleMap>
            </div>

            {/* Premium Boarding Pass */}
            {bestRoute && (
              <div className={styles.boardingPassCard} ref={cardRef}>
                <div className={styles.passHeader}>
                  <span className={styles.passBrand}>BATATA FRETADOS</span>
                  <span className={styles.passTag}>ENCONTRAMOS UMA ROTA COMPATÍVEL</span>
                </div>
                
                <h3 className={styles.passLineName} style={{ color: bestRoute.line.color }}>{bestRoute.line.name}</h3>
                
                <div className={styles.passGrid}>
                  <div className={styles.passRow}>
                    <MapPin size={18} className={styles.passIcon} />
                    <div>
                      <div className={styles.passLabel}>Embarque</div>
                      <div className={styles.passValue}>{bestRoute.boarding.name}</div>
                    </div>
                  </div>
                  
                  <div className={styles.passRow}>
                    <Navigation size={18} className={styles.passIcon} />
                    <div>
                      <div className={styles.passLabel}>Destino</div>
                      <div className={styles.passValue}>{bestRoute.dropoff.name}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.passMetrics}>
                  <div className={styles.metric}>
                    <Bus size={20} style={{ color: 'var(--accent-gold)' }} />
                    <div>
                      <div className={styles.metricLabel}>Tempo até ônibus</div>
                      <div className={styles.metricValue}>{realTime}</div>
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
                  <button onClick={handleBook} className={styles.btnPrimary} style={{ flex: 1, padding: '16px' }}>
                    Reservar pelo WhatsApp
                  </button>
                  <div className={styles.qrCodePlaceholder}>
                    <QrCode size={32} opacity={0.3} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const googleMapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  }
];
