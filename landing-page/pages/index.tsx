import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const UserTypes = dynamic(() => import('../components/UserTypes'), { ssr: false });
const Features = dynamic(() => import('../components/Features'), { ssr: false });
const Benefits = dynamic(() => import('../components/Benefits'), { ssr: false });
const Pricing = dynamic(() => import('../components/Pricing'), { ssr: false });
const Blog = dynamic(() => import('../components/Blog'), { ssr: false });
const DemoTrial = dynamic(() => import('../components/DemoTrial'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <UserTypes />
      <Features />
      <Benefits />
      <Pricing />
      <Blog />
      <DemoTrial />
      <Footer />
    </div>
  );
};

export default Home;
