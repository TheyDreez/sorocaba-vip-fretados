'use client';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import styles from '@/app/page.module.css';

export function ContactForm() {
  const [formData, setFormData] = useState({
    nome: '',
    origem: '',
    destino: '',
    dataViagem: '',
    passageiros: '1',
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wppNumber = "5511995104279";
    
    let text = `Olá! Meu nome é ${formData.nome}.
Gostaria de informações sobre o fretado.

Origem: ${formData.origem}
Destino: ${formData.destino}
Data: ${formData.dataViagem}
Quantidade de passageiros: ${formData.passageiros}
Observações: ${formData.observacoes || 'Nenhuma'}`;

    const leadOrigem = localStorage.getItem('lead_origem');
    if (leadOrigem) {
      text += `\n\n[Origem da visita: ${leadOrigem}]`;
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${wppNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <section id="reserva" className={styles.formSection}>
      <div className={styles.section} style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Dê o próximo passo.</h2>
          <p className={styles.sectionSubtitle}>Consulte disponibilidade e valores diretamente com nossa equipe.</p>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" className={styles.inputField} required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label htmlFor="origem">Origem</label>
                <input type="text" id="origem" className={styles.inputField} placeholder="Ex: Sorocaba" required value={formData.origem} onChange={(e) => setFormData({...formData, origem: e.target.value})} />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label htmlFor="destino">Destino</label>
                <input type="text" id="destino" className={styles.inputField} placeholder="Ex: São Paulo" required value={formData.destino} onChange={(e) => setFormData({...formData, destino: e.target.value})} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label htmlFor="data">Data</label>
                <input type="date" id="data" className={styles.inputField} required value={formData.dataViagem} onChange={(e) => setFormData({...formData, dataViagem: e.target.value})} />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label htmlFor="passageiros">Passageiros</label>
                <select id="passageiros" className={styles.inputField} value={formData.passageiros} onChange={(e) => setFormData({...formData, passageiros: e.target.value})}>
                  <option value="1">1 Pessoa</option>
                  <option value="2">2 Pessoas</option>
                  <option value="3+">3 ou mais</option>
                </select>
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="obs">Mensagem (Opcional)</label>
              <input type="text" id="obs" className={styles.inputField} value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} />
            </div>
            
            <button type="submit" className={styles.btnPrimary} style={{ width: '100%', marginTop: '1rem' }}>
              Falar pelo WhatsApp <MessageCircle size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
