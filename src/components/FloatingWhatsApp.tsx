'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import styles from '@/app/page.module.css';

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownTooltip) {
        setShowTooltip(true);
        setHasShownTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 15000); // 15 seconds on page
    return () => clearTimeout(timer);
  }, [hasShownTooltip]);

  const wppNumber = "5511999999999";
  const text = encodeURIComponent("Olá! Estou no site e gostaria de conversar com um atendente sobre o fretado.");

  return (
    <div className={styles.floatingWppContainer}>
      <div 
        className={styles.wppTooltip} 
        style={{ 
          opacity: showTooltip ? 1 : 0, 
          transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease'
        }}
      >
        Precisa de ajuda?
      </div>
      <a 
        href={`https://wa.me/${wppNumber}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingWppBtn}
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
