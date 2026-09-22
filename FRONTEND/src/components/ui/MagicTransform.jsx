import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScanFace, Focus, Fingerprint, Music, AudioLines, Headphones, Sparkles } from 'lucide-react';

const MagicTransform = () => {
  const containerRef = useRef(null);
  const inputsRef = useRef([]);
  const outputsRef = useRef([]);
  const coreRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    
    // Reset positions
    gsap.set(inputsRef.current, { 
      x: () => gsap.utils.random(-120, -80), 
      y: () => gsap.utils.random(-100, 100), 
      scale: 1, 
      opacity: 0 
    });
    gsap.set(outputsRef.current, { x: 0, y: 0, scale: 0, opacity: 0 });

    // 1. Inputs fly in and get sucked into the core
    tl.to(inputsRef.current, {
      x: 0, y: 0, scale: 0.6, opacity: 1,
      duration: 1, stagger: 0.1, ease: "power2.in"
    })
    .to(inputsRef.current, { opacity: 0, duration: 0.5 })
    
    // 2. AI Core processes (Pulse)
    .to(coreRef.current, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" })
    
    // 3. Colorful Music bursts out
    .to(outputsRef.current, {
      x: () => gsap.utils.random(80, 120),
      y: () => gsap.utils.random(-120, 120),
      scale: 1, opacity: 1,
      duration: 1, stagger: 0.05, ease: "back.out(1.5)"
    })
    // 4. Fade outputs
    .to(outputsRef.current, { opacity: 0, duration: 0.5, stagger: 0.05, delay: 0.5 });

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* INPUTS (Grayscale Data) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[ScanFace, Focus, Fingerprint, ScanFace].map((Icon, i) => (
          <div key={`in-${i}`} ref={el => inputsRef.current[i] = el} className="absolute text-gray-400">
            <Icon size={32} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* AI CORE */}
      <div ref={coreRef} className="relative z-10 flex items-center justify-center w-20 h-20 bg-black text-white rounded-full shadow-2xl">
        <Sparkles size={32} />
      </div>

      {/* OUTPUTS (Colorful Music) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[
          { Icon: Music, color: 'text-pink-500' },
          { Icon: AudioLines, color: 'text-blue-500' },
          { Icon: Headphones, color: 'text-purple-500' },
          { Icon: Music, color: 'text-emerald-500' }
        ].map(({ Icon, color }, i) => (
          <div key={`out-${i}`} ref={el => outputsRef.current[i] = el} className={`absolute ${color}`}>
            <Icon size={40} strokeWidth={2} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default MagicTransform;
