import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

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
          <div ref={textRef} className="max-w-xl">
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 sm:text-6xl mb-6">
              An AI that reads the room.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Our built-in Gemini AI shifts its personality based on your scan. If you're sad, it becomes empathetic. If you're angry, it gives you space and cues up heavy metal.
            </p>
          </div>
          <div ref={uiRef} className="relative">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 shadow-xl p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-gray-600">U</span>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-4 text-sm font-medium text-gray-800">
                  I had a really rough day at work today.
                </div>
              </div>
              <div className="flex gap-4 items-start flex-row-reverse">
                <div className="bg-black rounded-full h-10 w-10 flex items-center justify-center shrink-0 text-white">
                  <Sparkles size={18} />
                </div>
                <div className="bg-black shadow-md rounded-2xl rounded-tr-sm p-4 text-sm font-medium text-white leading-relaxed">
                  I see you're feeling a bit down. I've queued up some acoustic indie tracks to help you decompress. Just breathe, I've got the aux.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatShowcase;
