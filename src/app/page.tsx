import { Hero } from '@/components/Hero';
import { TrustIndicators } from '@/components/TrustIndicators';
import { PriceComparison } from '@/components/PriceComparison';
import { History } from '@/components/History';
import { Experience } from '@/components/Experience';
import { SmartRouteAssistant } from '@/components/SmartRouteAssistant';
import { RouteMap } from '@/components/RouteMap';
import { Gallery } from '@/components/Gallery';
import { FAQ } from '@/components/FAQ';
import { ContactForm } from '@/components/ContactForm';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustIndicators />
      <PriceComparison />
      <History />
      <Experience />
      <SmartRouteAssistant />
      <RouteMap />
      <Gallery />
      <FAQ />
      <ContactForm />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
