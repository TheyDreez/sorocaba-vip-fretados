'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '@/app/page.module.css';
import { ArrowRight, Ticket } from 'lucide-react';

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Elegant mask reveal and fade
    const tl = gsap.timeline({ delay: 1.5 }); // wait for loading screen
    
    // Fallback: If user prefers reduced motion, skip complex animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.out' }
      )
      .fromTo(subtitleRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 
        "-=1"
      )
      .fromTo(ctaRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 
        "-=0.8"
      );
    } else {
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 1, y: 0, clipPath: 'none' });
    }
  }, []);

  const scrollToForm = () => {
    const formEl = document.getElementById('reserva');
    formEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroNoise} />
      
      {/* Video Background */}
      <video 
        ref={videoRef}
        className={styles.heroVideo}
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className={styles.heroContent}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          Chegue ao seu destino<br/>mais disposto para o dia.
        </h1>
        <p ref={subtitleRef} className={styles.heroSubtitle}>
          Enquanto o trânsito exige atenção, você aproveita a viagem para descansar. O transporte executivo definitivo entre Sorocaba e São Paulo.
        </p>
        <div ref={ctaRef}>
          <div className={styles.heroButtons}>
            <button onClick={scrollToForm} className={styles.btnPrimary}>
              Reservar minha vaga <ArrowRight size={20} />
            </button>
            
            <div className={styles.heroPromoBadge}>
              <Ticket size={16} className={styles.heroPromoIcon} />
              <span>Primeira viagem gratuita. Pague só no final do mês.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
