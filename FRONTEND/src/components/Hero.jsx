import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { ScanFace } from 'lucide-react';

const CrowdCanvas = ({ src, rows = 15, cols = 7 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const config = { src, rows, cols };

    // UTILS
    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (array) => randomRange(0, array.length) | 0;
    const removeFromArray = (array, i) => array.splice(i, 1)[0];
    const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX, endX;

      if (direction === 1) {
        startX = -peep.width; endX = stage.width; peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width; endX = 0; peep.scaleX = -1;
      }
      peep.x = startX; peep.y = startY; peep.anchorY = startY;
      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;
      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 }, 0);
      return tl;
    };
    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({ image, rect }) => {
      const peep = {
        image, rect: [], width: 0, height: 0, drawArgs: [], x: 0, y: 0, anchorY: 0, scaleX: 1, walk: null,
        setRect: (rect) => {
          peep.rect = rect; peep.width = rect[2]; peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(peep.image, peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3], 0, 0, peep.width, peep.height);
          ctx.restore();
        },
      };
      peep.setRect(rect);
      return peep;
    };

    const img = document.createElement("img");
    const stage = { width: 0, height: 0 };
    const allPeeps = []; const availablePeeps = []; const crowd = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;
      for (let i = 0; i < total; i++) {
        allPeeps.push(createPeep({
          image: img,
          rect: [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight],
        }));
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) { addPeepToCrowd().walk.progress(Math.random()); }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep, props: resetPeep({ peep, stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep); addPeepToCrowd();
      });
      peep.walk = walk; crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep); availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save(); ctx.scale(devicePixelRatio, devicePixelRatio);
      crowd.forEach((peep) => { peep.render(ctx); });
      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth; stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio; canvas.height = stage.height * devicePixelRatio;
      crowd.forEach((peep) => { if (peep.walk) peep.walk.kill(); });
      crowd.length = 0; availablePeeps.length = 0; availablePeeps.push(...allPeeps);
      initCrowd();
    };

    const init = () => {
      createPeeps(); resize(); gsap.ticker.add(render);
    };

    img.onload = init; img.src = config.src;
    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => { if (peep.walk) peep.walk.kill(); });
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 h-full w-full block" />;
};

const Hero = () => {
  return (
    <section className="relative h-screen w-full bg-white overflow-hidden text-black font-sans">
      
      {/* TEXT & CTA OVERLAY */}
      <div className="absolute top-[2%] sm:top-[2%] md:top-[2%] left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center px-4 text-center z-20 pointer-events-auto bg-gradient-to-b from-white via-white/80 to-transparent pb-12 pt-8">
        
        <span className="relative mb-4 md:mb-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400 after:absolute after:left-1/2 after:top-full after:mt-2 md:after:mt-4 after:h-8 md:after:h-12 after:w-px after:-translate-x-1/2 after:bg-gradient-to-b after:from-gray-300 after:to-transparent">
          Moodify V1
        </span>
        
        <h1 className="mt-8 md:mt-12 max-w-7xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 leading-[1.1] md:leading-tight">
          Say <span style={{ fontFamily: '"Syne Tactile", cursive' }}>Goodbye</span> to the Selection Overhead <br className="hidden md:block" /> 
          Let Your <span style={{ fontFamily: '"Syne Tactile", cursive' }}>Mood</span> Flow in Words.
        </h1>
        
        <p className="mt-4 md:mt-6 max-w-xl text-base md:text-lg text-gray-500 font-medium tracking-wide px-2">
          AI-driven playback that adapts to how you feel in real-time.
        </p>

        <button className="group relative mt-6 md:mt-10 flex h-14 md:h-16 w-64 items-center justify-center overflow-hidden rounded-full bg-black text-xs md:text-sm font-semibold uppercase tracking-widest text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:w-72 hover:bg-zinc-900 hover:shadow-[0_8px_40px_rgb(0,0,0,0.4)]">
          
          {/* Shimmer Sweep Effect */}
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
            <div className="relative h-full w-10 bg-white/20" />
          </div>
          
          {/* Text Label */}
          <span className="transition-all duration-300 group-hover:-translate-x-3">
            Start Face Scan
          </span>
          
          {/* Sliding Icon */}
          <ScanFace className="absolute right-6 h-5 w-5 translate-x-8 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"/>
          
        </button>

      </div>

      {/* CANVAS CONTAINER */}
      <div className="absolute bottom-0 left-0 h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[75vh] w-full pointer-events-none z-10">
        <CrowdCanvas cols={7} rows={15} src="/images/peeps/all-peeps.png"/>
      </div>

    </section>
  );
};

export { CrowdCanvas, Hero as default };
