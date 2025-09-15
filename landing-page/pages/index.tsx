import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';
import Partners from '../components/Partners';
import UserTypes from '../components/UserTypes';
import BeforeAfter from '../components/BeforeAfter';

const Header = dynamic(() => import('../components/Header'), { ssr: false });
const Features = dynamic(() => import('../components/Features'), { ssr: false });
const DemoTrial = dynamic(() => import('../components/DemoTrial'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Partners />
      <UserTypes />
      <BeforeAfter />
      <Features />
      <DemoTrial />
      <Footer />
    </>
  );
};

export default Home;
