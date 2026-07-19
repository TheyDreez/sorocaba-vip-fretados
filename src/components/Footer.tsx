'use client';
import { Logo } from './Logo';
import styles from '@/app/page.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerColumn}>
          <Logo size="small" />
          <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            39 anos de tradição em transporte executivo, priorizando conforto e pontualidade na rota Sorocaba ↔ São Paulo.
          </p>
        </div>
        
        <div className={styles.footerColumn}>
          <h4>Contato</h4>
          <ul>
            <li><a href="https://wa.me/5511995104279" target="_blank" rel="noreferrer">WhatsApp: (11) 99510-4279</a></li>
          </ul>
        </div>
        
        <div className={styles.footerColumn}>
          <h4>Institucional</h4>
          <ul>
            <li><a href="#">Política de Privacidade (LGPD)</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Mapa do Site</a></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <span>&copy; {new Date().getFullYear()} Batata Fretados. Todos os direitos reservados.</span>
        <span>Desenvolvido com excelência.</span>
      </div>
    </footer>
  );
}
