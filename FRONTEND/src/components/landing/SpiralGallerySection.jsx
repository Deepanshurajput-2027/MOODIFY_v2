import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Spiral3DSlider from '../ui/Spiral3DSlider';

gsap.registerPlugin(ScrollTrigger);

const grayscaleSlides = [
  { src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", alt: "Concert crowd monochrome" },
  { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", alt: "Vintage microphone" },
  { src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80", alt: "DJ turntable abstract" },
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", alt: "Moody cinematic portrait" },
  { src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80", alt: "Minimalist headphones" },
  { src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", alt: "Vinyl record spinning" },
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", alt: "Moody cinematic portrait" },
  { src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80", alt: "Minimalist headphones" },
  { src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", alt: "Vinyl record spinning" },
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", alt: "Moody cinematic portrait" },
  { src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80", alt: "Minimalist headphones" },
  { src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", alt: "Vinyl record spinning" },
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", alt: "Moody cinematic portrait" },
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", alt: "Moody cinematic portrait" },
  { src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80", alt: "Minimalist headphones" },
  { src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", alt: "Vinyl record spinning" },
];

const SpiralGallerySection = () => {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",   // section enters viewport from below
      end: "bottom top",     // section exits viewport going up
      scrub: true,
      onUpdate: (self) => {
        // self.progress goes from 0 (section just entering) to 1 (section fully exited)
        scrollProgressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-black py-28 px-6 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
          Immersive Soundscapes
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white max-w-3xl">
          A visual journey through your emotional spectrum.
        </h2>
        <p className="text-gray-400 font-medium max-w-xl mt-4 text-lg">
          Explore our dynamic 3D audio-visual library curated in striking monochrome.
        </p>
      </div>

      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
        <Spiral3DSlider
          items={grayscaleSlides}
          autoSpeed={0.12}
          className="min-h-[650px]"
          scrollProgressRef={scrollProgressRef}
        />
      </div>
    </section>
  );
};

export default SpiralGallerySection;
