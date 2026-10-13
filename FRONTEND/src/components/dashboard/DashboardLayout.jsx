import React from 'react';
import { Home, Activity, UploadCloud, History, Settings, Plus, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const navItems = [
    { to: "/dashboard", icon: Home, end: true },
    { to: "/dashboard/scan", icon: Activity },
    { to: "/dashboard/upload", icon: UploadCloud },
    { to: "/dashboard/history", icon: History },
    { to: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-20 bg-[#121212] rounded-[32px] flex flex-col items-center py-8 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      {/* Primary Action */}
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: "#ffffff", color: "#000000" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/dashboard/scan')}
        className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white mb-12 transition-colors cursor-pointer"
      >
        <Plus size={20}/>
      </motion.button>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-6 flex-1 w-full items-center">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to}
            end={item.end}
            className={({ isActive }) => 
              `relative flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-300 ${isActive ? 'text-[#121212] bg-[#E2FF6F] shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`
            }
          >
            <item.icon size={22} />
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto cursor-pointer" onClick={() => navigate('/profile')}>
        <div className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden hover:border-white transition-colors">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User className="text-gray-400" size={18}/>
          )}
        </div>
      </div>
    </aside>
  );
};

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] font-sans flex overflow-hidden">
      <Sidebar/>
      <main className="ml-28 flex-1 p-4 md:p-8 max-w-[1600px] h-screen overflow-y-auto hide-scrollbar">
        {children}
      </main>
    </div>
  );
};
