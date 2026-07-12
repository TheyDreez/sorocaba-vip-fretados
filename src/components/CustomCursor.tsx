'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // We keep the default cursor, just add the elegant trailing effects
    const onMouseMove = (e: MouseEvent) => {
      // The sharp dot follows instantly
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      // The large glow follows softly
      gsap.to(glowRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    const onMouseDown = () => {
      gsap.to(glowRef.current, { scale: 0.8, opacity: 0.3, duration: 0.2 });
      gsap.to(dotRef.current, { scale: 1.5, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(glowRef.current, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    // React to clickable elements (buttons, links)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a');
      
      if (isClickable) {
        gsap.to(glowRef.current, { scale: 1.2, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.3 });
        gsap.to(dotRef.current, { scale: 2, opacity: 0, duration: 0.2 });
      } else {
        gsap.to(glowRef.current, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
        gsap.to(dotRef.current, { scale: 1, opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className={styles.cursorGlow} />
      <div ref={dotRef} className={styles.cursorDot} />
    </>
  );
}
