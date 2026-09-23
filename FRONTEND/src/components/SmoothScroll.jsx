import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — wraps children in a Lenis-powered smooth scroll context.
 * Syncs with GSAP ScrollTrigger so all existing scroll animations remain correct.
 */
const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with a tuned lerp for a premium, buttery feel
    const lenis = new Lenis({
      duration: 1.2,        // scroll duration multiplier (higher = slower/smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll position to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker as the single RAF loop — keeps Lenis and GSAP in perfect sync
    const tickerCallback = (time) => {
      lenis.raf(time * 1000); // GSAP ticker gives time in seconds, Lenis expects ms
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return children;
};

export default SmoothScroll;
