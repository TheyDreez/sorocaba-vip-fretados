'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Clock, Wifi, Coffee, Map } from 'lucide-react';
import styles from '@/app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Map, title: "Viagem Direta", desc: "De Sorocaba direto a São Paulo, sem pausas ou enrolação." },
  { icon: Clock, title: "Horários Fixos", desc: "Pontualidade britânica garantida para sua rotina." },
  { icon: Shield, title: "Segurança Premium", desc: "Motoristas altamente qualificados e veículos inspecionados." },
  { icon: Wifi, title: "Wi-Fi a Bordo", desc: "Produtividade e entretenimento garantidos durante todo o trajeto." },
  { icon: Coffee, title: "Comodidade Total", desc: "Poltronas executivas extra confortáveis e água gelada à vontade." }
];

export function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
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
        <h2 className={styles.sectionTitle}>A Experiência Premium</h2>
        <p className={styles.sectionSubtitle}>Diferenciais que justificam nossa exclusividade.</p>
      </div>
      <div className={styles.benefitsGrid}>
        {benefits.map((b, i) => (
          <div 
            key={i} 
            className={styles.benefitCard}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
          >
            <b.icon className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>{b.title}</h3>
            <p className={styles.benefitDesc}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
