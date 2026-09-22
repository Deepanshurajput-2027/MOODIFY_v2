import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const images = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1493225457124-a1a2a5f13498?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1516280440502-861f6c449e7b?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1520607162513-7770400dd8c3?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1483032469466-b937c425697b?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1485030056468-3820ff9e6e90?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=200&q=80"
];

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const stairsRef = useRef([]);
  const imagesRef = useRef([]);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    const totalImages = images.length;

    // Calculate coordinates for circles
    const getCoords = (index, radius) => {
      const angle = (index / totalImages) * Math.PI * 2;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    };

    // Initial setup: stack all images perfectly in the dead center
    gsap.set(imagesRef.current, { x: 0, y: 0, scale: 0, opacity: 0 });

    // 1. Global continuous rotation of the ring container
    tl.to(ringRef.current, {
      rotation: 135,
      duration: 5,
      ease: "power2.inOut"
    }, 0);

    // 2. Images pop in with stagger and random organic tilts
    tl.to(imagesRef.current, {
      x: (i) => getCoords(i, 160).x,
      y: (i) => getCoords(i, 160).y,
      scale: 1,
      opacity: 1,
      rotation: () => gsap.utils.random(-15, 15),
      duration: 1,
      stagger: 0.04,
      ease: "back.out(1.2)"
    }, 0);

    // (Pause for 1.5 seconds so the user can enjoy the spinning circle)

    // 3. Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8
    }, 2.5);

    // 4. Expand images massively out of frame while fading
    tl.to(imagesRef.current, {
      x: (i) => getCoords(i, window.innerWidth * 0.8).x,
      y: (i) => getCoords(i, window.innerWidth * 0.8).y,
      opacity: 0,
      scale: 1.5,
      duration: 1.5,
      ease: "power3.inOut"
    }, 2.6);

    // 5. Staggered Stair Reveal
    tl.to(stairsRef.current, {
      height: 0,
      stagger: 0.08,
      duration: 1,
      ease: "power4.inOut"
    }, 3.4);

    // 6. Unmount
    tl.call(() => {
      if (onComplete) onComplete();
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex pointer-events-none overflow-hidden">

      {/* 5 Vertical Black Stairs */}
      <div className="absolute inset-0 flex w-full h-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} ref={el => stairsRef.current[i] = el} className="w-[20vw] h-full bg-black origin-top" />
        ))}
      </div>

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h1 ref={textRef} className="text-4xl md:text-5xl font-semibold tracking-[0.3em] text-white mix-blend-difference">
          MOODIFY
        </h1>
      </div>

      {/* Rotating Ring Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-0 h-0 flex items-center justify-center" ref={ringRef}>
        {images.map((src, i) => (
          <div
            key={i}
            ref={el => imagesRef.current[i] = el}
            className={`absolute -ml-8 -mt-8 ${i % 3 === 0 ? 'w-14 h-16' : 'w-16 h-16'} bg-white p-1 rounded-sm shadow-2xl`}
          >
            <img src={src} alt="Mood" className="w-full h-full object-cover grayscale opacity-90" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Preloader;
