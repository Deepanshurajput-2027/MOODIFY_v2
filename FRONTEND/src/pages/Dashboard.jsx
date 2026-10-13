import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Settings, Plus, Sparkles, Activity, Play, ArrowUpRight, Music, UploadCloud, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DottedProgress = ({ count, activeCount, dark }) => (
  <div className="flex gap-2 mt-4">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className={`h-6 w-3.5 rounded-full ${i < activeCount ? (dark ? 'bg-black' : 'bg-white') : (dark ? 'bg-black/10' : 'bg-white/20')}`}
      />
    ))}
  </div>
);

const PillChartBar = ({ day, topVal, bottomVal, highlight }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative h-48 w-12 rounded-full bg-gray-100 flex flex-col justify-end overflow-hidden">
      {/* Top Value (Black) */}
      <div 
        className="absolute top-0 w-full bg-[#121212] rounded-full z-10 flex justify-center pt-2"
        style={{ height: `${topVal}%` }}
      >
        <div className="h-2 w-2 rounded-full bg-white/50" />
      </div>
      {/* Bottom Value (Accent) */}
      <div 
        className={`absolute bottom-0 w-full rounded-full z-0 flex justify-center pb-2 ${highlight ? 'bg-[#E2FF6F]' : 'bg-lime-200/50'}`}
        style={{ height: `${bottomVal}%` }}
      >
        <div className="h-2 w-2 rounded-full bg-black/30" />
      </div>
      {highlight && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">
          87%
        </div>
      )}
    </div>
    <span className="text-xs text-gray-400 font-medium">{day}</span>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Face Scans', 'Audio Engine', 'Playlists', 'Spotify Link', 'Integrations'];

  return (
    <DashboardLayout>
      
      {/* 1. Header Area */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-medium tracking-tight text-[#121212] flex items-center gap-3 flex-wrap">
          Synchronize <span className="flex items-center justify-center h-10 w-10 bg-white rounded-full shadow-sm"><Activity className="text-gray-400" size={20}/></span> 
          Your Mood <br /> and 
          <span className="flex items-center justify-center h-10 w-10 bg-[#E2FF6F] rounded-full shadow-sm mx-2"><Sparkles className="text-black" size={20}/></span> 
          Music
        </h1>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-600 hover:text-black hover:shadow-md transition-all"
          >
            <Settings size={20}/>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/scan')}
            className="h-12 px-6 bg-[#121212] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-black hover:shadow-lg transition-all"
          >
            <Plus size={18}/> New Face Scan
          </motion.button>
        </div>
      </header>

      {/* 2. Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#121212] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Content (Spans 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Bento Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 (White) */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between h-56">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Activity size={18}/> Total Scans
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-[#121212]">780</span>
                  <span className="px-2 py-1 bg-lime-100 text-lime-800 rounded-full text-xs font-bold">82% <ArrowUpRight className="inline" size={12}/></span>
                </div>
                <DottedProgress activeCount={5} count={8} dark={true}/>
              </div>
            </div>

            {/* Metric 2 (Accent) */}
            <div className="bg-[#E2FF6F] rounded-[32px] p-6 shadow-sm flex flex-col justify-between h-56">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-[#121212] font-medium">
                  <Play size={18}/> Audio Synced
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-[#121212]">163</span>
                  <span className="px-2 py-1 bg-white text-[#121212] rounded-full text-xs font-bold">68% <ArrowUpRight className="inline" size={12}/></span>
                </div>
                <DottedProgress activeCount={4} count={8} dark={true}/>
              </div>
            </div>

            {/* CTA Card (Dark) */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              onClick={() => navigate('/dashboard/scan')}
              className="bg-[#121212] rounded-[32px] p-6 shadow-xl flex flex-col justify-between h-56 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
              <h3 className="text-2xl font-medium text-white leading-tight relative z-10 w-2/3">
                Take Your <ArrowUpRight className="inline text-gray-400" size={20}/> <br/> Analysis to the Next Level
              </h3>
              <div className="bg-white text-black px-6 py-3 rounded-full font-medium w-max text-sm group-hover:scale-105 transition-transform z-10 mt-auto">
                Launch Scanner &nbsp; ▷
              </div>
            </motion.div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><Activity size={20}/> Statistics</h3>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1.5 text-[#121212]"><div className="w-2 h-2 rounded-full bg-[#121212]"/> Valence</span>
                  <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-[#E2FF6F]"/> Energy</span>
                </div>
              </div>
              <select className="bg-gray-50 border-none text-sm font-medium py-2 px-4 rounded-full outline-none">
                <option>This Week</option>
              </select>
            </div>

            <div className="flex justify-between items-end px-4 md:px-12">
               <PillChartBar bottomVal={40} day="27 Jun" topVal={60}/>
               <PillChartBar bottomVal={30} day="28 Jun" topVal={40}/>
               <PillChartBar bottomVal={20} day="29 Jun" topVal={50}/>
               <div className="border-l border-dashed border-gray-200 h-48 mx-2 hidden md:block"></div>
               <PillChartBar bottomVal={50} day="1 Jul" highlight={true} topVal={70}/>
               <div className="border-l border-dashed border-gray-200 h-48 mx-2 hidden md:block"></div>
               <PillChartBar bottomVal={45} day="3 Jul" topVal={45}/>
               <PillChartBar bottomVal={25} day="4 Jul" topVal={35}/>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Audio Sources / Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow group"
            >
              <div className="h-10 w-10 bg-[#E2FF6F]/20 text-[#121212] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music size={18}/>
              </div>
              <div className="text-center mt-1">
                <span className="block text-xs font-bold text-[#121212]">Spotify</span>
                <span className="block text-[10px] text-green-600 font-semibold mt-0.5">Connected</span>
              </div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/upload')}
              className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow group"
            >
              <div className="h-10 w-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud size={18}/>
              </div>
              <div className="text-center mt-1">
                <span className="block text-xs font-bold text-[#121212]">Upload</span>
                <span className="block text-[10px] text-gray-400 font-semibold mt-0.5">Local Audio</span>
              </div>
            </motion.button>
          </div>

          {/* Sonic Memory Feed (Combined Mood & Song History) */}
          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#121212] flex items-center gap-2">
                <History size={18}/> Sonic Memory
              </h3>
              <button className="text-xs text-gray-400 hover:text-black font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex flex-col gap-5">
              
              {/* History Item 1 */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-12 w-12 bg-lime-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🤩
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold text-[#121212] line-clamp-1">Midnight City</span>
                  <span className="text-xs text-gray-400 font-medium">Joyful & Energetic • 2m ago</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#121212] group-hover:text-white transition-colors">
                  <Play className="ml-0.5" size={14}/>
                </div>
              </div>

              <hr className="border-gray-50" />
              
              {/* History Item 2 */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  😔
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold text-[#121212] line-clamp-1">Holocene</span>
                  <span className="text-xs text-gray-400 font-medium">Melancholic • 4h ago</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#121212] group-hover:text-white transition-colors">
                  <Play className="ml-0.5" size={14}/>
                </div>
              </div>

              <hr className="border-gray-50" />

              {/* History Item 3 */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  😌
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold text-[#121212] line-clamp-1">Weightless</span>
                  <span className="text-xs text-gray-400 font-medium">Calm & Focused • Yesterday</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#121212] group-hover:text-white transition-colors">
                  <Play className="ml-0.5" size={14}/>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
