import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white/20">404</h1>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          The page you are looking for doesn't exist, has been moved, or the URL contains a typo.
        </p>
        <Link 
          to="/" 
          className="mt-4 rounded-full bg-white px-8 py-3 text-black text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105"
        >
          Return Home
        </Link>
      </motion.div>
    </main>
  );
};

export default NotFound;
