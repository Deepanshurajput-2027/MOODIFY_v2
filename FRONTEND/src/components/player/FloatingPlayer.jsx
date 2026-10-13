import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Plus, Minus } from 'lucide-react';

export const FloatingPlayer = ({ track, onPlayLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Fallback track data
  const currentTrack = track || {
    title: "Awaiting Track...",
    artist: "Moodify Engine",
    cover: `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || ''}/cohort-2-moodify-posters/default-poster.jpg`,
    audioUrl: "",
    mood: "Standby"
  };

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      // Only auto-play if we were already playing something
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Autoplay prevented by browser:", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack.audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // First time play -> log to history
      if (onPlayLog && audioRef.current.currentTime === 0) {
        onPlayLog(currentTrack);
      }
      audioRef.current.play().catch(e => console.error("Playback error:", e));
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-end">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Dynamic Widget Container */}
      <motion.div 
        layout
        initial={{ borderRadius: 32 }}
        animate={{ 
          width: isExpanded ? 400 : 120,
          backgroundColor: "#1A1A1A",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative flex items-center p-2 shadow-2xl border border-white/10"
      >
        
        {/* Album Art (Always visible) */}
        <motion.div layout className="relative h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden z-10 shadow-lg">
          <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover bg-zinc-800" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-white/80 text-[10px] font-bold tracking-widest">{currentTrack.mood}</span>
          </div>
        </motion.div>

        {/* Collapsed State EQ Bars */}
        {!isExpanded && currentTrack.audioUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-1 ml-4"
          >
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                animate={{ height: isPlaying ? [6, 16, 6] : 6 }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                className="w-1.5 bg-[#E2FF6F] rounded-full"
              />
            ))}
          </motion.div>
        )}

        {/* Expanded State Controls & Text */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between flex-1 px-4 overflow-hidden"
            >
              <div className="flex flex-col whitespace-nowrap overflow-hidden mr-4">
                <span className="text-white font-bold text-sm truncate">{currentTrack.title}</span>
                <span className="text-gray-400 font-medium text-xs uppercase tracking-widest truncate">{currentTrack.artist}</span>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <button className="hover:text-[#E2FF6F] transition-colors"><SkipBack fill="currentColor" size={20}/></button>
                <button onClick={togglePlayPause} className="hover:text-[#E2FF6F] transition-colors hover:scale-110">
                  {isPlaying ? <Pause fill="currentColor" size={24}/> : <Play fill="currentColor" size={24}/>}
                </button>
                <button className="hover:text-[#E2FF6F] transition-colors"><SkipForward fill="currentColor" size={20}/></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-3 -right-3 h-8 w-8 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-lg z-20 cursor-pointer"
        >
          {isExpanded ? <Minus size={16}/> : <Plus size={16}/>}
        </button>

      </motion.div>
    </div>
  );
};
