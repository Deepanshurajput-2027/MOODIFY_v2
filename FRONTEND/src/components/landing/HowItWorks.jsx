import React, { useState, useEffect, useRef } from 'react';
import { ScanFace, Sparkles, AudioLines } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '../../lib/utils';

const steps = [
  {
    id: 1,
    title: "01. Real-Time Facial Scan",
    subtitle: "Computer Vision Analysis",
    description: "Position your face in front of the camera. MediaPipe scans 468 facial landmarks in real-time to decode micro-expressions and detect your underlying emotional state.",
    icon: ScanFace,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "02. AI Mood Mapping",
    subtitle: "Dual-Logic Emotion Engine",
    description: "Our integrated Gemini AI maps your detected mood across sub-genres and sonic frequencies—calculating valence and energy to curate your exact emotional acoustic match.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "03. Synchronized Playback",
    subtitle: "Spotify & Local Audio Engine",
    description: "Instantly launch your mood-aligned playlist with local high-fidelity audio or full Spotify integration. Fine-tune on the fly using sub-genre mood pills.",
    icon: AudioLines,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
  }
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const prevStepRef = useRef(activeStep);

  // Transition animation when step changes
  useEffect(() => {
    if (prevStepRef.current === activeStep) return;
    
    const el = imageRef.current;
    const tl = gsap.timeline();
    
    tl.to(el, {
      scale: 0.95,
      opacity: 0.5,
      rotateX: 10,
      rotateY: -15,
      duration: 0.3,
      ease: "power2.inOut"
    }).to(el, {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "back.out(1.4)"
    });

    prevStepRef.current = activeStep;
  }, [activeStep]);

  // Subtle Mouse Tilt
  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(imageRef.current, {
      rotateY: x * 16, // between -8 and 8
      rotateX: -y * 16,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1200,
      transformOrigin: "center center"
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "back.out(1.4)",
    });
  };

  return (
    <section className="w-full bg-white text-black py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">How it works</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Stepper Text */}
          <div className="flex flex-col gap-6">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <div 
                  key={step.id} 
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "flex gap-6 p-6 rounded-2xl cursor-pointer transition-all duration-300",
                    isActive ? "border-l-4 border-black bg-gray-50 shadow-sm" : "border-l-4 border-transparent hover:bg-gray-50/50 hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500",
                    isActive ? "bg-black text-white shadow-xl scale-110" : "bg-gray-100 text-gray-400"
                  )}>
                    <step.icon size={32} strokeWidth={isActive ? 2 : 1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col mb-1">
                      <span className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-1 transition-colors duration-300", isActive ? "text-gray-900" : "text-gray-400")}>
                        {step.subtitle}
                      </span>
                      <h3 className={cn("text-2xl font-black tracking-tight transition-colors duration-300", isActive ? "text-black" : "text-gray-400")}>
                        {step.title}
                      </h3>
                    </div>
                    {isActive && (
                      <div className="overflow-hidden mt-3">
                        <p className="text-gray-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Image Showcase */}
          <div 
            className="relative w-full aspect-[4/3] perspective-[1200px]"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={imageRef}
              className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img 
                src={steps[activeStep].image} 
                alt={steps[activeStep].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Subtle dark gradient overlay for extra premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
