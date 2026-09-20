import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanFace } from 'lucide-react';
import OrbitImages from '../ui/OrbitImages';

gsap.registerPlugin(ScrollTrigger);

const ProblemSolution = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    gsap.fromTo(
      el.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const techIcons = [
    "https://cdn.simpleicons.org/spotify/000000",
    "https://cdn.simpleicons.org/google/000000",
    "https://cdn.simpleicons.org/react/000000",
    "https://cdn.simpleicons.org/nodedotjs/000000",
    "https://cdn.simpleicons.org/mongodb/000000",
    "https://cdn.simpleicons.org/tailwindcss/000000",
  ];

  return (
    <section className="w-full bg-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COLUMN: Text */}
        <div ref={textRef} className="flex flex-col justify-center space-y-6 z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-black leading-tight">
            Stop scrolling. <br /> Start feeling.
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-md leading-relaxed">
            Digital music libraries are overwhelming. Moodify reads your micro-expressions to instantly curate the perfect track—eliminating choice paralysis so you can just listen.
          </p>
        </div>

        {/* RIGHT COLUMN: Orbit Animation */}
        <div className="relative flex items-center justify-center min-h-[500px] w-full">
          <OrbitImages
            images={techIcons}
            radiusX={350}
            radiusY={135}
            duration={35}
            itemSize={60}
            pathColor="rgba(0,0,0,0.1)"
            showPath={true}
            shape="ellipse"
            rotation={-15}
            responsive={true}
            centerContent={
              <div className="flex flex-col items-center justify-center bg-black text-white rounded-full h-24 w-24 shadow-2xl relative z-20">
                <ScanFace size={36} strokeWidth={1.5} />
              </div>
            }
          />
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;
