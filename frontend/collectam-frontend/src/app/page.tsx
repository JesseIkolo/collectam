import AnimeNavbar from '@/components/AnimeNavbar';
import HeroSection from '@/components/HeroSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import CodePreview from '@/components/CodePreview';
import CommunitySection from '@/components/CommunitySection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import UrgencySection from '@/components/UrgencySection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <AnimeNavbar />
      <div className="pt-16">
        <HeroSection />
        <FeaturesGrid />
        <CodePreview />
        <CommunitySection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <UrgencySection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}
