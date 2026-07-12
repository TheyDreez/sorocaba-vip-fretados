'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function History() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      }
    );

    gsap.fromTo(
      timelineRef.current?.children || [],
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.4, ease: 'power3.out',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' }
      }
    );
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.historyContainer}>
        <div className={styles.historyText} ref={textRef}>
          <h3>Quase quatro décadas transportando pessoas com confiança.</h3>
          <p>
            A Batata Fretados não é apenas uma empresa de transporte. É uma empresa familiar construída ao longo de 39 anos de dedicação diária. Nosso fundador iniciou as atividades aos 21 anos, e hoje, aos 60, continua garantindo que o padrão de excelência seja mantido em cada trajeto.
          </p>
          <p>
            Escolher a Batata Fretados significa confiar sua rotina a uma empresa consolidada, que atravessa gerações entregando conforto, pontualidade e um relacionamento próximo e humano.
          </p>
        </div>
        
        <div className={styles.timelineEditorial} ref={timelineRef}>
          <div className={styles.timelineNode}>
            <div className={styles.nodeYear}>1987</div>
            <p className={styles.timelineDesc}>Início das operações. Um compromisso fundado na pontualidade.</p>
          </div>
          <div className={styles.timelineNode}>
            <div className={styles.nodeYear}>Hoje</div>
            <p className={styles.timelineDesc}>A principal referência em transporte executivo entre Sorocaba e São Paulo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
