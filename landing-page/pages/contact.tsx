import React from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });
const ContactFormSection = dynamic(() => import('../components/ContactFormSection'), { ssr: false });
const LocationsSection = dynamic(() => import('../components/LocationsSection'), { ssr: false });
const SupportSection = dynamic(() => import('../components/SupportSection'), { ssr: false });

const Contact: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <ContactFormSection />
        <SupportSection />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
