'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function TrustIndicators() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      containerRef.current?.children || [],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      }
    );
  }, []);

  return (
    <section className={styles.trustSection}>
      <div className={styles.trustGrid} ref={containerRef}>
        <div className={styles.trustItem}>
          <span className={styles.trustValue}>39 Anos</span>
          <span className={styles.trustLabel}>De Tradição</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustValue}>Sorocaba ↔ SP</span>
          <span className={styles.trustLabel}>Rota Executiva Diária</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustValue}>100%</span>
          <span className={styles.trustLabel}>Atendimento Humanizado</span>
        </div>
      </div>
    </section>
  );
}
