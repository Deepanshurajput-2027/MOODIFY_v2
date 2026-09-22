import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScanFace, Music, AudioLines, Headphones } from 'lucide-react';

const CenterFlow = () => {
  const containerRef = useRef(null);
  const inputsRef = useRef([]);
  const outputsRef = useRef([]);
  const coreRef = useRef(null);

  // Helper to calculate radial X/Y coordinates
  const getCoordinates = (index, total, radius) => {
    const angle = (index / total) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
    const totalItems = 8;
    const radius = 140;

    // Set initial positions
    inputsRef.current.forEach((el, i) => {
      const { x, y } = getCoordinates(i, totalItems, radius);
      gsap.set(el, { x, y, scale: 0.5, opacity: 0 });
    });
    
    outputsRef.current.forEach((el) => {
      gsap.set(el, { x: 0, y: 0, scale: 0, opacity: 0 });
    });

    // 1. Inputs converge to the center radially
    tl.to(inputsRef.current, {
      x: 0,
      y: 0,
      scale: 0.2,
      opacity: 1,
      duration: 1,
      ease: "power2.in",
      stagger: 0.05
    })
    .to(inputsRef.current, { opacity: 0, duration: 0.1 })
    
    // 2. AI Core processes the data
    .to(coreRef.current, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" })
    
    // 3. Colorful outputs burst outward radially
    outputsRef.current.forEach((el, i) => {
      const { x, y } = getCoordinates(i, totalItems, radius + 20); // Push slightly further out
      tl.to(el, {
        x,
        y,
        scale: 1.2,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.2)"
      }, "<0.05"); // Start slightly offset from each other
    });

    // 4. Fade outputs
    tl.to(outputsRef.current, { opacity: 0, duration: 0.4, stagger: 0.05, delay: 0.3 });

    return () => tl.kill();
  }, []);

  const outputColors = ['text-pink-500', 'text-blue-500', 'text-purple-500', 'text-emerald-500', 'text-yellow-500', 'text-cyan-500', 'text-rose-500', 'text-indigo-500'];
  const OutputIcons = [Music, AudioLines, Headphones, Music, AudioLines, Headphones, Music, AudioLines];

  return (
    <div ref={containerRef} className="relative w-full h-[450px] flex items-center justify-center overflow-hidden bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
      
      {/* INPUTS (Grayscale Data Flowing In) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`in-${i}`} ref={el => inputsRef.current[i] = el} className="absolute text-gray-300">
            <ScanFace size={28} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* AI CORE */}
      <div ref={coreRef} className="relative z-10 flex flex-col items-center justify-center w-24 h-24 bg-black text-white rounded-full shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        <span className="text-xs font-bold tracking-widest mt-1">AI</span>
      </div>

      {/* OUTPUTS (Colorful Music Flowing Out) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => {
          const Icon = OutputIcons[i];
          return (
            <div key={`out-${i}`} ref={el => outputsRef.current[i] = el} className={`absolute ${outputColors[i]}`}>
              <Icon size={36} strokeWidth={2} />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CenterFlow;
