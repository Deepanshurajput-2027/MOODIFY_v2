import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
        <div>
          © 2026 Moodify. Powered by AI.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black transition-colors">GitHub</a>
          <a href="#" className="hover:text-black transition-colors">Portfolio</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
