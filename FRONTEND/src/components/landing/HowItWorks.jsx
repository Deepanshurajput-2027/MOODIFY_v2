import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanFace, Sparkles, AudioLines } from 'lucide-react';
import CenterFlow from '../ui/CenterFlow';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    number: "01",
    title: "Real-Time Facial Scan",
    subtitle: "Computer Vision Analysis",
    description: "Position your face in front of the camera. MediaPipe scans 468 facial landmarks in real-time to decode micro-expressions and detect your underlying emotional state.",
    icon: ScanFace,
  },
  {
    id: 2,
    number: "02",
    title: "AI Mood Mapping",
    subtitle: "Dual-Logic Emotion Engine",
    description: "Our integrated Gemini AI maps your detected mood across sub-genres and sonic frequencies—calculating valence and energy to curate your exact emotional acoustic match.",
    icon: Sparkles,
  },
  {
    id: 3,
    number: "03",
    title: "Synchronized Playback",
    subtitle: "Spotify & Local Audio Engine",
    description: "Instantly launch your mood-aligned playlist with local high-fidelity audio or full Spotify integration. Fine-tune on the fly using sub-genre mood pills.",
    icon: AudioLines,
  }
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(stepsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-black text-black py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">How it works</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Steps */}
          <div className="flex flex-col gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                ref={el => stepsRef.current[index] = el}
                className="flex gap-6"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                  <step.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-md font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 block">
                    {step.subtitle}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: CenterFlow Visualizer */}
          <div className="w-full">
            <CenterFlow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
