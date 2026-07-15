import { Hero } from '@/components/Hero';
import { TrustIndicators } from '@/components/TrustIndicators';
import { History } from '@/components/History';
import { Experience } from '@/components/Experience';
import { SmartRouteAssistant } from '@/components/SmartRouteAssistant';
import { RouteMap } from '@/components/RouteMap';
import { FAQ } from '@/components/FAQ';
import { ContactForm } from '@/components/ContactForm';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustIndicators />
      <History />
      <Experience />
      <SmartRouteAssistant />
      <RouteMap />
      <FAQ />
      <ContactForm />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
