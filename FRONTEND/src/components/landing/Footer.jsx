import React from 'react';
import { Link } from 'react-router-dom';

const TwitterIcon = ({ size = 20, strokeWidth = 1.5, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = ({ size = 20, strokeWidth = 1.5, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 20, strokeWidth = 1.5, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const LinkedinIcon = ({ size = 20, strokeWidth = 1.5, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-8 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Socials (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <p className="text-gray-300 text-lg mb-8 max-w-sm font-medium">
              Moodify is the modern and intuitive way to synchronize your music with your emotions.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="p-2.5 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                <TwitterIcon size={20} strokeWidth={1.5}/>
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                <InstagramIcon size={20} strokeWidth={1.5}/>
              </a>
              <a href="#" aria-label="YouTube" className="p-2.5 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                <YoutubeIcon size={20} strokeWidth={1.5}/>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
                <LinkedinIcon size={20} strokeWidth={1.5}/>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-semibold text-lg mb-2">Product</h4>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">Features</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">How it Works</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">Spotify Integration</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-semibold text-lg mb-2">Resources</h4>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">Customer stories</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">API Docs</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">MediaPipe Setup</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-semibold text-lg mb-2">Company</h4>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">About</Link>
            <div className="flex items-center gap-2">
              <Link className="text-gray-400 hover:text-white transition-colors" to="#">Careers</Link>
              <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                We're Hiring
              </span>
            </div>
            <Link className="text-gray-400 hover:text-white transition-colors" to="#">Contact</Link>
          </div>
        </div>

      </div>

      {/* Massive Faded Outline Logo */}
      <div className="relative flex justify-center items-end mt-12 w-full overflow-hidden select-none pointer-events-none">
        <h1 
          className="text-[16vw] font-black leading-[0.8] tracking-tighter text-transparent w-full text-center"
          style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)' }}
        >
          MOODIFY
        </h1>
        {/* Gradient overlay to fade the bottom of the text */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black h-[110%] w-full"></div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-medium">
          <p>© 2026 Moodify / Synchronize your emotions</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link className="hover:text-white transition-colors" to="#">Security</Link>
            <Link className="hover:text-white transition-colors" to="#">Terms of service</Link>
            <Link className="hover:text-white transition-colors" to="#">Privacy policy</Link>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
