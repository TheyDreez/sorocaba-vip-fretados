'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bus } from 'lucide-react';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function RouteMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const busRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (sectionRef.current && lineFillRef.current && busRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      });
      
      tl.to(lineFillRef.current, { height: '100%', ease: 'none' }, 0)
        .to(busRef.current, { top: '100%', ease: 'none' }, 0);
    }
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Embarque Inteligente</h2>
        <p className={styles.sectionSubtitle}>Paradas estratégicas apenas para embarque em Sorocaba, seguindo direto para São Paulo. Ida e volta garantidas.</p>
      </div>
      
      <div className={styles.mapContainer}>
        <div className={styles.cityLabel} style={{ top: 0 }}>Sorocaba</div>
        
        <div className={styles.mapLine}>
          <div className={styles.mapLineFill} ref={lineFillRef} />
          <div className={styles.busIcon} ref={busRef} style={{ top: '0%' }}>
            <Bus size={24} />
          </div>
        </div>
        
        <div className={styles.cityLabel} style={{ bottom: 0 }}>São Paulo</div>
      </div>
    </section>
  );
}
