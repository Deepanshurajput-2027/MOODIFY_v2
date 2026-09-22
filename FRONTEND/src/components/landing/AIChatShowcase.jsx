import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatMessages from './ChatMessages';

gsap.registerPlugin(ScrollTrigger);

const AIChatShowcase = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const uiRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    );

    gsap.fromTo(uiRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          <div ref={uiRef} className="relative w-full flex justify-center">
            <ChatMessages interactive={true} />
          </div>
          <div ref={textRef} className="max-w-xl">
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 sm:text-6xl mb-6">
              An AI that reads the room.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Our built-in Gemini AI shifts its personality based on your scan. If you're sad, it becomes empathetic. If you're angry, it gives you space and cues up heavy metal.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AIChatShowcase;
