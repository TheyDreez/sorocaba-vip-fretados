'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/app/page.module.css';

const faqs = [
  { q: "Como funciona a reserva?", a: "Tudo é feito pelo nosso WhatsApp de forma rápida e humanizada. Você informa os dados e nossa equipe cuida do resto." },
  { q: "Onde é o embarque e desembarque?", a: "Embarcamos em pontos estratégicos e de fácil acesso em Sorocaba, desembarcando nas principais regiões empresariais de São Paulo." },
  { q: "O ônibus faz muitas paradas?", a: "Fazemos paradas estratégicas apenas para embarque em Sorocaba. Em seguida, a viagem segue expressa até São Paulo, otimizando o seu tempo. O retorno no fim do dia também é garantido." },
  { q: "O ônibus possui banheiro e comodidades?", a: "Com certeza. Nossos veículos possuem banheiro, ar-condicionado inteligente e água gelada à vontade para o máximo conforto." },
  { q: "Tem Wi-Fi a bordo?", a: "Sim, disponibilizamos conexão para que você possa aproveitar a viagem para trabalhar ou relaxar." },
  { q: "Como funciona o pagamento?", a: "As informações de pagamento e opções de pacotes mensais ou avulsos são explicadas detalhadamente pela nossa equipe no WhatsApp, com total transparência." }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Dúvidas Frequentes</h2>
      </div>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <div className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
              {faq.q}
              <ChevronDown style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease' }} />
            </div>
            <div className={styles.faqAnswer} style={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0, paddingBottom: openIndex === index ? '2rem' : 0 }}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
