'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      imagesRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Nossa Frota</h2>
        <p className={styles.sectionSubtitle}>Acabamento premium, iluminação ideal e poltronas ergonômicas.</p>
      </div>
      <div className={styles.galleryGrid}>
        <div className={styles.galleryImageWrapper} ref={(el) => { imagesRef.current[0] = el; }}>
          <video src="/videos/details.mp4" autoPlay loop muted playsInline className={styles.galleryImage} style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.galleryImageWrapper} ref={(el) => { imagesRef.current[1] = el; }}>
          <img src="/images/frota-2.jpg" alt="Poltronas de Couro" className={styles.galleryImage} />
        </div>
        <div className={styles.galleryImageWrapper} ref={(el) => { imagesRef.current[2] = el; }}>
          <img src="/images/frota-3.jpg" alt="Corredor Iluminado" className={styles.galleryImage} />
        </div>
      </div>
    </section>
  );
}
