import React from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });
const MissionHero = dynamic(() => import('../components/MissionHero'), { ssr: false });
const TeamSection = dynamic(() => import('../components/TeamSection'), { ssr: false });
const CareersSection = dynamic(() => import('../components/CareersSection'), { ssr: false });
const ContactSection = dynamic(() => import('../components/ContactSection'), { ssr: false });

const About: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <MissionHero />
        <TeamSection />
        <CareersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
