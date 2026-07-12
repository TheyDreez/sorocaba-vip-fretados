'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Logo } from './Logo';

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Elegant slow fade out
    const tl = gsap.timeline({ delay: 0.8 });
    
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050505',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo size="large" animated={true} />
    </div>
  );
}
