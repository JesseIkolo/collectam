import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';
import UserTypes from '../components/UserTypes';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Features = dynamic(() => import('../components/Features'), { ssr: false });
const Pricing = dynamic(() => import('../components/Pricing'), { ssr: false });
const DemoTrial = dynamic(() => import('../components/DemoTrial'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <UserTypes />
      <Features />
      <Pricing />
      <DemoTrial />
      <Footer />
    </>
  );
};

export default Home;
