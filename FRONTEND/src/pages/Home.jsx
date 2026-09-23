import React from 'react';
import Hero from '../components/Hero';
import TrustBar from '../components/landing/TrustBar';
import ProblemSolution from '../components/landing/ProblemSolution';
import HowItWorks from '../components/landing/HowItWorks';
import AIChatShowcase from '../components/landing/AIChatShowcase';
import SpiralGallerySection from '../components/landing/SpiralGallerySection';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';
import SmoothScroll from '../components/SmoothScroll';

const Home = () => {
  return (
    <SmoothScroll>
      <div className="w-full bg-white overflow-x-hidden">
        <Hero/>
        <TrustBar/>
        <ProblemSolution/>
        <HowItWorks/>
        <AIChatShowcase/>
        <SpiralGallerySection/>
        <CallToAction/>
        <Footer/>
      </div>
    </SmoothScroll>
  );
};

export default Home;

