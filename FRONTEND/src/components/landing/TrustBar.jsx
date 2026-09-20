import React from 'react';

const techStack = [
  "POWERED BY AI", "•", 
  "GOOGLE GEMINI", "•", 
  "SPOTIFY", "•", 
  "MEDIAPIPE", "•", 
  "REACT", "•",
  "NODE.JS", "•", 
  "MONGODB", "•", 
  "TAILWIND CSS", "•"
];

const TrustBar = () => {
  return (
    <section className="w-full bg-black py-5 md:py-6 overflow-hidden flex border-y border-gray-900 select-none">
      <div className="flex w-max animate-marquee items-center text-white font-extrabold text-xl md:text-2xl tracking-[0.2em] uppercase">
        
        {/* Render the list twice to create the seamless infinite loop */}
        {[...techStack, ...techStack].map((item, index) => (
          <span 
            key={index} 
            className={`mx-6 md:mx-10 ${item === "•" ? "text-gray-600 scale-75" : "hover:text-gray-300 transition-colors cursor-default"}`}
          >
            {item}
          </span>
        ))}

      </div>
    </section>
  );
};

export default TrustBar;
