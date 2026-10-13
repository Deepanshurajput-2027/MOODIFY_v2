import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const mockHistory = [
  { id: 1, track: "Midnight City", artist: "M83", mood: "Energetic", time: "2 hours ago" },
  { id: 2, track: "Holocene", artist: "Bon Iver", mood: "Melancholic", time: "Yesterday" },
  { id: 3, track: "Weightless", artist: "Marconi Union", mood: "Calm", time: "2 days ago" },
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export const RecentActivity = () => {
  return (
    <motion.div variants={itemVariants} className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors">
          View All
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-4 rounded-2xl bg-black border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <PlayCircle size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">{item.track}</span>
                <span className="text-gray-500 text-xs">{item.artist}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                {item.mood}
              </span>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Clock size={14} />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
