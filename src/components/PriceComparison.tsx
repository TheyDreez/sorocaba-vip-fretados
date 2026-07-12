'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bus, MapPin, CheckCircle2, TrendingDown, XCircle } from 'lucide-react';
import styles from './PriceComparison.module.css';

gsap.registerPlugin(ScrollTrigger);

export function PriceComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardPainRef = useRef<HTMLDivElement>(null);
  const cardVipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards sequentially on scroll
      gsap.to(cardPainRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.to(cardVipRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2, // VIP card comes slightly after
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.priceComparisonSection} ref={containerRef}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <h2 className={styles.title}>Transporte Premium não precisa custar mais.</h2>
          <p className={styles.subtitle}>
            A maioria das pessoas não calcula o custo oculto do transporte comum. Veja a comparação real.
          </p>
        </div>

        <div className={styles.grid}>
          
          {/* TRADITIONAL CARD (PAIN) */}
          <div className={`${styles.card} ${styles.cardTraditional}`} ref={cardPainRef}>
            <div className={`${styles.cardHeader} ${styles.traditionalHeader}`}>
              <Bus size={28} strokeWidth={1.5} />
              <h3>O que você gasta HOJE</h3>
            </div>
            
            <div className={styles.pricingBlock}>
              <p className={styles.priceLabel}>Seu custo atual (22 dias úteis)</p>
              <div className={`${styles.priceValue} ${styles.traditionalPriceValue}`}>
                <span>R$</span>1.780<span>/mês</span>
              </div>
            </div>

            <ul className={`${styles.featureList} ${styles.traditionalFeatureList}`}>
              <li><XCircle size={20} /> Passagem rodoviária (ida/volta) + Uber/Metrô no destino</li>
              <li><XCircle size={20} /> Filas na rodoviária, superlotação e baldeações exaustivas</li>
              <li><XCircle size={20} /> Perda de tempo precioso que poderia ser de descanso</li>
            </ul>
          </div>

          {/* VIP CARD (SOLUTION) */}
          <div className={`${styles.card} ${styles.cardVip}`} ref={cardVipRef}>
            <div className={styles.savingsBadge}>
              <TrendingDown size={18} />
              Economia garantida de R$ 820/mês
            </div>

            <div className={`${styles.cardHeader} ${styles.vipHeader}`}>
              <MapPin size={28} strokeWidth={1.5} />
              <h3>Fretado Executivo VIP</h3>
            </div>
            
            <div className={styles.pricingBlock}>
              <p className={styles.priceLabel}>Pacote Fixo Mensal</p>
              <div className={`${styles.priceValue} ${styles.vipPriceValue}`}>
                <span>R$</span>960<span>/mês</span>
              </div>
            </div>

            <ul className={`${styles.featureList} ${styles.vipFeatureList}`}>
              <li><CheckCircle2 size={20} /> Embarque e desembarque estratégico e sem trechos extras</li>
              <li><CheckCircle2 size={20} /> Bancos leito, ambiente silencioso e Wi-Fi de alta velocidade</li>
              <li><CheckCircle2 size={20} /> Você chega ao destino totalmente descansado e focado</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
