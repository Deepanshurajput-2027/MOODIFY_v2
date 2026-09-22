import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white text-black py-32 px-4 flex items-center justify-center">
      <div ref={contentRef} className="text-center max-w-3xl">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-10">
          Ready to hear how you feel?
        </h2>
        <Link 
          to="/login"
          className="inline-block bg-black text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide transition-transform hover:scale-110"
        >
          Start Face Scan
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
