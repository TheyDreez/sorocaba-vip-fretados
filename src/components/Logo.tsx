'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LogoProps {
  size?: 'small' | 'large';
  animated?: boolean;
}

export function Logo({ size = 'small', animated = false }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated && logoRef.current) {
      gsap.fromTo(logoRef.current, 
        { opacity: 0, y: 15, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: 'power3.out' }
      );
    }
  }, [animated]);

  const scale = size === 'large' ? 1.5 : 1;

  return (
    <div 
      ref={logoRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        lineHeight: 1,
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}
    >
      <span style={{
        fontFamily: 'var(--font-outfit)',
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.04em',
        color: '#ffffff',
        textTransform: 'uppercase'
      }}>
        BATATA
      </span>
      <span style={{
        fontFamily: 'var(--font-inter)',
        fontWeight: 400,
        fontSize: '0.7rem',
        letterSpacing: '0.42em',
        color: '#D4AF37', // Dourado discreto
        textTransform: 'uppercase',
        marginTop: '4px',
        paddingLeft: '4px',
        opacity: 0.9
      }}>
        Fretados
      </span>
    </div>
  );
}
