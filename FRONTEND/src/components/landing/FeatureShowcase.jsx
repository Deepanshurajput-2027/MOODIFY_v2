import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlayCircle, Clock, CloudUpload } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: "feature-1",
    title: "Spotify Premium Integration",
    description: "Link your Spotify account to instantly play full tracks. Moodify routes your emotional data directly into Spotify's recommendation algorithm to find the exact sub-genre you need.",
    icon: PlayCircle,
    visual: (
      <div className="w-full h-full bg-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-zinc-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full"></div>
        <PlayCircle className="text-green-500 mb-6 relative z-10" size={80} strokeWidth={1}/>
        <h3 className="text-white text-2xl font-bold relative z-10">Synced with Spotify</h3>
      </div>
    )
  },
  {
    id: "feature-2",
    title: "Sonic Memory",
    description: "A chronological history of your moods and the tracks that matched them. Look back at how your emotions fluctuate throughout the week and discover patterns in your listening habits.",
    icon: Clock,
    visual: (
      <div className="w-full h-full bg-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-gray-200 shadow-xl">
        <div className="w-full max-w-sm space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center px-4 gap-4 opacity-80">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-24 bg-gray-300 rounded"></div>
                <div className="h-2 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "feature-3",
    title: "Bring Your Own Vibe",
    description: "Don't use streaming services? Upload your own high-fidelity MP3s directly to the Moodify cloud. Our AI will analyze the waveform and map it directly to your facial expressions.",
    icon: CloudUpload,
    visual: (
      <div className="w-full h-full bg-black rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-gray-800">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full"></div>
        <CloudUpload className="text-white mb-6 relative z-10" size={80} strokeWidth={1}/>
        <h3 className="text-white text-2xl font-bold relative z-10">Local Audio Engine</h3>
      </div>
    )
  }
];

const FeatureShowcase = () => {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const visualRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      features.forEach((_, index) => {
        
        // When the text block enters the center of the screen
        ScrollTrigger.create({
          trigger: textRefs.current[index],
          start: "top center",
          end: "bottom center",
          onEnter: () => activateFeature(index),
          onEnterBack: () => activateFeature(index),
        });
      });
    }, containerRef);

    // Helper function to handle crossfades
    const activateFeature = (activeIndex) => {
      // Update text opacity
      textRefs.current.forEach((el, i) => {
        if(el) {
          gsap.to(el, { opacity: i === activeIndex ? 1 : 0.3, duration: 0.4, ease: "power2.out" });
        }
      });
      // Update visuals opacity
      visualRefs.current.forEach((el, i) => {
        if(el) {
          gsap.to(el, { opacity: i === activeIndex ? 1 : 0, scale: i === activeIndex ? 1 : 0.95, duration: 0.5, ease: "power2.out" });
        }
      });
    };

    // Initialize the first feature as active
    activateFeature(0);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-white py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto flex flex-col space-y-4 mb-24 text-center md:text-left">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-black">
          More than just playback.
        </h2>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto md:mx-0">
          Everything you need to seamlessly integrate emotion-driven audio into your workflow.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
        
        {/* LEFT COLUMN: Scrolling Text */}
        <div className="flex flex-col">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id} 
                ref={el => textRefs.current[index] = el}
                className="min-h-[50vh] flex flex-col justify-center py-12"
              >
                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="text-black" size={28}/>
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-black mb-6">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Sticky Visuals */}
        <div className="hidden lg:block relative h-full">
          <div className="sticky top-32 h-[600px] w-full">
            {features.map((feature, index) => (
              <div 
                key={`visual-${feature.id}`} 
                ref={el => visualRefs.current[index] = el}
                className="absolute inset-0 opacity-0 transform scale-95"
              >
                {feature.visual}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureShowcase;
