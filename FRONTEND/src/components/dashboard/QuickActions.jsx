import React from 'react';
import { Link } from 'react-router-dom';
import { ScanFace, UploadCloud, History } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    title: "New Face Scan",
    description: "Launch MediaPipe to detect your current mood in real-time.",
    icon: ScanFace,
    link: "/dashboard/scan",
    primary: true,
  },
  {
    title: "Upload Audio",
    description: "Upload high-fidelity MP3s to your personal cloud.",
    icon: UploadCloud,
    link: "/dashboard/upload",
    primary: false,
  },
  {
    title: "Sonic Memory",
    description: "Review your past moods and synchronized playlists.",
    icon: History,
    link: "/dashboard/history",
    primary: false,
  }
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.div key={idx} variants={itemVariants}>
            <Link
              to={action.link}
              className={`group flex flex-col justify-between h-48 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                action.primary
                  ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]'
                  : 'bg-zinc-900 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  action.primary ? 'bg-black text-white' : 'bg-white/10 text-white'
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1">{action.title}</h3>
                <p className={`text-sm font-medium ${action.primary ? 'text-gray-600' : 'text-gray-400'}`}>
                  {action.description}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
