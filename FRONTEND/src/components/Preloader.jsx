import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const stairsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Unmount the preloader from the DOM when finished
        if (onComplete) onComplete();
      },
    });

    // 1. Fade out the text slightly after load
    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.6, // Initial pause so user sees the text
    });

    // 2. Stagger the stairs shrinking upwards
    tl.to(stairsRef.current, {
      scaleY: 0,
      transformOrigin: 'top', // Shrinks towards the top
      stagger: 0.1, // The "stair" effect delay between each column
      duration: 0.8,
      ease: 'power4.inOut',
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex h-screen w-screen overflow-hidden"
    >
      {/* Centered Loading Text */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <span className="text-2xl font-bold tracking-[0.3em] text-white uppercase">
          Initializing
        </span>
      </div>

      {/* The 5 Stair Columns */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (stairsRef.current[i] = el)}
          className="h-full w-full bg-black"
        ></div>
      ))}
    </div>
  );
};

export default Preloader;
