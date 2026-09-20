import React from 'react';
import Hero from '../components/Hero';
import TrustBar from '../components/landing/TrustBar';
import ProblemSolution from '../components/landing/ProblemSolution';
import HowItWorks from '../components/landing/HowItWorks';
import AIChatShowcase from '../components/landing/AIChatShowcase';
import BentoGrid from '../components/landing/BentoGrid';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';

const Home = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      <Hero/>
      <TrustBar/>
      <ProblemSolution/>
      <HowItWorks/>
      <AIChatShowcase/>
      <BentoGrid/>
      <CallToAction/>
      <Footer/>
    </div>
  );
};

export default Home;
