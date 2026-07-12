'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wifi, Thermometer, Droplets, Map, ShieldCheck, CalendarClock } from 'lucide-react';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Wifi, title: "Wi-Fi a Bordo", desc: "Continue conectado durante todo o trajeto." },
  { icon: Thermometer, title: "Climatização Ideal", desc: "Temperatura agradável em qualquer época do ano." },
  { icon: Droplets, title: "Água Gelada", desc: "Mais conforto e frescor durante todo o percurso." },
  { icon: Map, title: "Ida e Volta Garantidas", desc: "Trajetos otimizados com paradas eficientes e a segurança do seu retorno diário." },
  { icon: ShieldCheck, title: "Seguro de Vida Integrado", desc: "Viaje com tranquilidade sabendo que todos os passageiros estão segurados." },
  { icon: CalendarClock, title: "Pague no Final do Mês", desc: "Comece a viajar hoje e faça o pagamento apenas no último dia do mês." }
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Lazy video loading using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {});
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // GSAP
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className={styles.premiumSection} ref={sectionRef}>
        <video 
          ref={videoRef}
          className={styles.premiumVideo}
          muted 
          loop 
          playsInline 
          poster="/images/premium-poster.jpg"
        >
          <source src="/videos/interior.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} style={{ background: 'rgba(5,5,5,0.75)' }} />
        
        <div className={styles.premiumContent}>
          <h2 className={styles.sectionTitle}>Uma experiência muito além do transporte.</h2>
          <p className={styles.sectionSubtitle}>Cada detalhe da nossa frota foi pensado para garantir que sua rotina seja mais leve, produtiva e relaxante.</p>
        </div>
      </section>

      <section className={styles.section} style={{ paddingTop: '5rem' }}>
        <div className={styles.benefitsGrid}>
          {benefits.map((b, i) => (
            <div 
              key={i} 
              className={styles.benefitCard}
              ref={(el) => { cardsRef.current[i] = el; }}
            >
              <b.icon className={styles.benefitIcon} size={32} />
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
