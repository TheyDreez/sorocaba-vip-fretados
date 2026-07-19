export const trackWhatsAppConversion = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18333544157/HKmnCOvL6tIcEN3djqZE',
          'value': 1.0,
          'currency': 'BRL',
          'transaction_id': ''
      });
      console.log('Conversion tracked!');
    } catch (err) {
      console.error('Error tracking conversion', err);
    }
  }
};
