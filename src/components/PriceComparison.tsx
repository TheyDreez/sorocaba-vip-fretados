'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Bus, MapPin, CheckCircle2, TrendingDown, XCircle, ArrowRight } from 'lucide-react';
import styles from './PriceComparison.module.css';

export function PriceComparison() {
  const [isVip, setIsVip] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const traditionalContentRef = useRef<HTMLDivElement>(null);
  const vipContentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const revealVip = () => {
    if (isVip) return;
    setIsVip(true);

    const tl = gsap.timeline();

    // Fade out traditional
    tl.to(traditionalContentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in'
    })
    // Hide button
    .to(btnRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3
    }, "<")
    // Hide traditional completely
    .set(traditionalContentRef.current, { display: 'none' })
    .set(btnRef.current, { display: 'none' })
    // Show VIP
    .set(vipContentRef.current, { display: 'flex' })
    // Animate Card Box Shadow / Border (handled via CSS class toggle in React, but we can pop it)
    .to(cardRef.current, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    })
    // Fade in VIP content
    .fromTo(vipContentRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    // Pop savings badge
    .fromTo(badgeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
      "-=0.3"
    );
  };

  return (
    <section className={styles.priceComparisonSection} ref={containerRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Transporte Premium não precisa custar mais.</h2>
          <p className={styles.subtitle}>
            A maioria das pessoas não calcula o custo oculto do transporte comum. Veja a comparação real.
          </p>
        </div>

        <div className={`${styles.interactiveCard} ${isVip ? styles.vipState : ''}`} ref={cardRef}>
          
          {/* TRADITIONAL STATE */}
          <div className={styles.cardContent} ref={traditionalContentRef}>
            <div className={styles.cardHeader}>
              <Bus size={28} />
              <h3>O que você gasta HOJE no transporte comum</h3>
            </div>
            
            <div className={styles.pricingBlock}>
              <p className={styles.priceLabel}>Seu custo atual aproximado (22 dias úteis)</p>
              <div className={styles.priceValue}>
                <span>R$</span>1.780<span>/mês</span>
              </div>
            </div>

            <ul className={styles.featureList}>
              <li><XCircle size={20} /> Passagem rodoviária (ida e volta) + Uber/Metrô até o destino</li>
              <li><XCircle size={20} /> Filas, superlotação e baldeações exaustivas</li>
              <li><XCircle size={20} /> Perda de tempo precioso de descanso ou trabalho</li>
            </ul>
          </div>

          {/* VIP STATE */}
          <div className={styles.cardContent} ref={vipContentRef} style={{ display: 'none' }}>
            <div className={styles.savingsBadge} ref={badgeRef}>
              <TrendingDown size={18} />
              Economia garantida de R$ 820/mês
            </div>

            <div className={`${styles.cardHeader} ${styles.vipHeader}`}>
              <MapPin size={28} />
              <h3>Fretado Executivo VIP</h3>
            </div>
            
            <div className={styles.pricingBlock}>
              <p className={styles.priceLabel}>Pacote Fixo Mensal</p>
              <div className={`${styles.priceValue} ${styles.vipPriceValue}`}>
                <span className={styles.strikethrough}>1.780</span>
                <span>R$</span>960<span>/mês</span>
              </div>
            </div>

            <ul className={`${styles.featureList} ${styles.vipFeatureList}`}>
              <li><CheckCircle2 size={20} /> Embarque e desembarque direto, sem trechos adicionais</li>
              <li><CheckCircle2 size={20} /> Bancos leito, ambiente silencioso e Wi-Fi de alta velocidade</li>
              <li><CheckCircle2 size={20} /> Você chega ao destino totalmente descansado e focado</li>
            </ul>
          </div>
        </div>

        {!isVip && (
          <div style={{ textAlign: 'center' }}>
            <button className={styles.revealBtn} onClick={revealVip} ref={btnRef}>
              Veja como viajar VIP por R$ 960/mês <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
