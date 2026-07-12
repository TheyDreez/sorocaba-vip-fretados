'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';
import { Bus, MapPin, CheckCircle2, TrendingDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function PriceComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(cardsRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section className={styles.priceComparisonSection} ref={containerRef}>
      <div className={styles.container}>
        <div className={styles.comparisonHeader}>
          <h2 className={styles.sectionTitle}>Transporte Premium não precisa custar mais.</h2>
          <p className={styles.sectionSubtitle}>
            Compare os custos reais e veja por que nossa linha executiva é o melhor investimento para o seu bolso e seu bem-estar.
          </p>
        </div>

        <div className={styles.comparisonGrid}>
          {/* Traditional Card */}
          <div className={`${styles.comparisonCard} ${styles.traditionalCard}`} ref={(el) => { if (el) cardsRef.current[0] = el; }}>
            <div className={styles.cardHeader}>
              <Bus className={styles.cardIcon} size={28} />
              <h3>Ônibus Rodoviária<br/>+ Transporte Público</h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.costList}>
                <li>
                  <span className={styles.costLabel}>Passagem avulsa (ida e volta)</span>
                  <span className={styles.costValue}>R$ 70/dia</span>
                </li>
                <li>
                  <span className={styles.costLabel}>Custo para 22 dias úteis</span>
                  <span className={styles.costValue}>R$ 1.540/mês</span>
                </li>
                <li>
                  <span className={styles.costLabel}>Metrô/CPTM (Barra Funda → Destino)</span>
                  <span className={styles.costValue}>~R$ 240/mês</span>
                </li>
                <li className={styles.totalRow}>
                  <span className={styles.costLabel}>Custo Total Estimado</span>
                  <span className={styles.costValue}>~R$ 1.780/mês</span>
                </li>
              </ul>
              <div className={styles.disadvantages}>
                <p>• Perda de tempo em baldeações</p>
                <p>• Filas na rodoviária</p>
                <p>• Sujeito a superlotação no metrô</p>
              </div>
            </div>
          </div>

          {/* VIP Card */}
          <div className={`${styles.comparisonCard} ${styles.vipCard}`} ref={(el) => { if (el) cardsRef.current[1] = el; }}>
            <div className={styles.savingBadge}>
              <TrendingDown size={18} />
              Economize ~R$ 800/mês (45% mais barato)
            </div>
            
            <div className={styles.cardHeader}>
              <MapPin className={styles.cardIcon} size={28} />
              <h3>Linha Executiva VIP<br/>Batata Fretados</h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.costList}>
                <li>
                  <span className={styles.costLabel}>Pacote mensal (ida e volta garantida)</span>
                  <span className={styles.costValue}>R$ 960/mês</span>
                </li>
                <li>
                  <span className={styles.costLabel}>Transporte direto ao destino</span>
                  <span className={styles.costValue}>Incluso</span>
                </li>
                <li>
                  <span className={styles.costLabel}>Embarque/Desembarque estratégico</span>
                  <span className={styles.costValue}>Incluso</span>
                </li>
                <li className={styles.totalRow}>
                  <span className={styles.costLabel}>Custo Total Fixo</span>
                  <span className={styles.costValue}>R$ 960/mês</span>
                </li>
              </ul>
              <div className={styles.advantages}>
                <p><CheckCircle2 size={16}/> Bancos leito e Wi-Fi de alta velocidade</p>
                <p><CheckCircle2 size={16}/> Desembarque direto (Faria Lima, Paulista, Berrini)</p>
                <p><CheckCircle2 size={16}/> Viagem silenciosa para descansar ou trabalhar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
