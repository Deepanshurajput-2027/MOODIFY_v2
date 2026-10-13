import React, { useRef, forwardRef } from 'react';
import { ScanFace, Sparkles, AudioLines, Music } from 'lucide-react';
import { AnimatedBeam } from '../ui/animated-beam';

// Reusable Node Component wrapper to accept refs
const Node = forwardRef(({ icon: Icon, title, subtitle, className }, ref) => (
  <div ref={ref} className={`z-10 flex w-64 items-center gap-4 bg-zinc-950 border border-white/40 rounded-2xl p-4 shadow-2xl transition-transform hover:scale-105 ${className}`}>
    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
      <Icon className="text-white" size={24} strokeWidth={1.5}/>
    </div>
    <div className="flex flex-col text-left">
      <span className="text-white font-bold tracking-tight">{title}</span>
      <span className="text-gray-400 text-xs uppercase tracking-widest mt-0.5">{subtitle}</span>
    </div>
  </div>
));

Node.displayName = 'Node';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const scanRef = useRef(null);
  const aiRef = useRef(null);
  const spotifyRef = useRef(null);
  const localRef = useRef(null);

  return (
    <section className="w-full bg-black py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">
          The Emotion Engine
        </h2>
        <p className="text-gray-400 max-w-xl text-lg font-medium">
          Our architecture processes your micro-expressions and routes them instantly to your favorite playback systems.
        </p>
      </div>

      <div 
        className="relative flex w-full max-w-6xl mx-auto items-center justify-center p-6 md:p-12 border border-white/5 rounded-3xl bg-[#050505] shadow-[0_0_80px_rgba(255,255,255,0.03)]" 
        ref={containerRef}
      >
        <div className="flex h-[600px] md:h-[400px] w-full flex-col items-center justify-between md:flex-row md:items-center">
          
          {/* Left Side: Input */}
          <div className="flex flex-col justify-center">
            <Node icon={ScanFace} ref={scanRef} subtitle="MediaPipe Vision" title="Facial Scan"/>
          </div>

          {/* Center: AI Core */}
          <div className="flex flex-col justify-center my-12 md:my-0">
            <div 
              ref={aiRef} 
              className="z-10 flex flex-col items-center justify-center gap-4 bg-zinc-950 border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="h-16 w-16 bg-white flex items-center justify-center rounded-2xl relative z-10 shadow-lg">
                <Sparkles className="text-black" size={32}/>
              </div>
              <div className="text-center relative z-10">
                <h3 className="text-white font-bold text-xl tracking-tight">Moodify AI</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Dual-Logic Core</p>
              </div>
            </div>
          </div>

          {/* Right Side: Outputs */}
          <div className="flex flex-col justify-center gap-12">
            <Node icon={Music} ref={spotifyRef} subtitle="Cloud Playback" title="Spotify API"/>
            <Node icon={AudioLines} ref={localRef} subtitle="Hi-Fi Engine" title="Local Audio"/>
          </div>
        </div>

        {/* Dynamic Beams */}
        <AnimatedBeam containerRef={containerRef} duration={3} fromRef={scanRef} toRef={aiRef}/>
        <AnimatedBeam containerRef={containerRef} curvature={150} delay={0.5} duration={3} fromRef={aiRef} toRef={spotifyRef}/>
        <AnimatedBeam containerRef={containerRef} curvature={-150} delay={1} duration={3} fromRef={aiRef} toRef={localRef}/>
      </div>
    </section>
  );
};

export default HowItWorks;
