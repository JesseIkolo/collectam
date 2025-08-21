import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import HeroSection from './components/HeroSection';
import SocialProof from './components/SocialProof';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import FeaturesSection from './components/FeaturesSection';
import FounderSection from './components/FounderSection';
import ValueSection from './components/ValueSection';
import UrgencySection from './components/UrgencySection';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import Navigation from './components/Navigation';

function App() {
  return (
    <NextUIProvider>
      <div className="App min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navigation />
        <main>
          <HeroSection />
          <SocialProof />
          <ProblemSection />
          <SolutionSection />
          <FeaturesSection />
          <FounderSection />
          <ValueSection />
          <UrgencySection />
          <FAQSection />
          <FinalCTA />
        </main>
      </div>
    </NextUIProvider>
  );
}

export default App;
