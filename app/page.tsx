import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <BenefitsSection />
      <DashboardPreview />
      <CTASection />
      <Footer />
    </main>
  );
}