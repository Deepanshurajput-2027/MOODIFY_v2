import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlayCircle, Clock, CloudUpload } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BentoGrid = () => {
  const sectionRef = useRef(null);
  const boxesRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(boxesRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            ref={el => boxesRef.current[0] = el}
            className="col-span-1 md:col-span-2 bg-black text-white rounded-3xl p-8 flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <PlayCircle className="text-white mb-6" size={48} strokeWidth={1} />
              <h3 className="text-3xl font-bold tracking-tight mb-4">Spotify Premium Integration</h3>
              <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
                Link your Spotify account to instantly play full tracks instead of 30-second previews. We handle the routing, you just listen.
              </p>
            </div>
          </div>
          
          <div 
            ref={el => boxesRef.current[1] = el}
            className="col-span-1 bg-gray-100 text-black rounded-3xl p-8 flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <Clock className="text-black mb-6" size={48} strokeWidth={1} />
              <h3 className="text-2xl font-bold tracking-tight mb-4">Sonic Memory</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Every scan and session is logged. Look back at your emotional history and rediscover the tracks that carried you through.
              </p>
            </div>
          </div>

          <div 
            ref={el => boxesRef.current[2] = el}
            className="col-span-1 md:col-span-3 border-2 border-gray-100 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <CloudUpload className="text-black mb-4" size={40} strokeWidth={1} />
              <h3 className="text-2xl font-bold tracking-tight mb-2">Bring Your Own Vibe</h3>
              <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
                Not on Spotify? No problem. Upload your personal MP3 library to the cloud and our AI will analyze and tag them automatically.
              </p>
            </div>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold tracking-wide hover:scale-105 transition-transform whitespace-nowrap">
              Upload Tracks
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
