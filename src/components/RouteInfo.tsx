'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function RouteInfo() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.fromTo(
      timelineItemsRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Como Funciona a Rota</h2>
        <p className={styles.sectionSubtitle}>Conexão expressa entre Sorocaba e São Paulo.</p>
      </div>
      <div className={styles.routeContainer}>
        <div className={styles.timeline}>
          <div 
            className={styles.timelineItem}
            ref={(el) => { if (el) timelineItemsRef.current[0] = el; }}
          >
            <div className={styles.timelineDot} />
            <h3 className={styles.timelineTitle}>Embarque em Sorocaba</h3>
            <p className={styles.timelineDesc}>Ponto de encontro estratégico e de fácil acesso.</p>
          </div>
          <div 
            className={styles.timelineItem}
            ref={(el) => { if (el) timelineItemsRef.current[1] = el; }}
          >
            <div className={styles.timelineDot} />
            <h3 className={styles.timelineTitle}>Viagem Direta</h3>
            <p className={styles.timelineDesc}>Trajeto sem paradas, otimizando o seu tempo.</p>
          </div>
          <div 
            className={styles.timelineItem}
            ref={(el) => { if (el) timelineItemsRef.current[2] = el; }}
          >
            <div className={styles.timelineDot} />
            <h3 className={styles.timelineTitle}>Desembarque em São Paulo</h3>
            <p className={styles.timelineDesc}>Chegada nas principais regiões empresariais de SP.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
