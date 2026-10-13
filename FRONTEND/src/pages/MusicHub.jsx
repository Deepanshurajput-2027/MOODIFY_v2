import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { FloatingPlayer } from '../components/player/FloatingPlayer';
import { Play, Heart, MoreHorizontal, Sparkles, Loader2, RefreshCw } from 'lucide-react';

const MusicHub = () => {
  const location = useLocation();
  const detectedMood = location.state?.mood || "Energetic";
  
  const [playlist, setPlaylist] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch songs from the backend (ImageKit cloud)
  const fetchCloudSongs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/songs/cloud');
      const data = await res.json();

      if (data.success && data.tracks.length > 0) {
        const tracksWithMood = data.tracks.map(track => ({
          ...track,
          mood: detectedMood,
        }));
        setPlaylist(tracksWithMood);
        setActiveTrack(tracksWithMood[0]); // Auto-select first track
      } else {
        setError('No songs found in your ImageKit cloud.');
      }
    } catch (err) {
      console.error('Failed to fetch cloud songs:', err);
      setError('Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudSongs();
  }, []);

  const handlePlayLog = (track) => {
    console.log(`Logging to history: Played ${track.title} while feeling ${detectedMood}`);
  };

  return (
    <DashboardLayout>
      {/* Force Dark Theme Container */}
      <div className="bg-[#050505] min-h-full w-full rounded-[32px] p-6 md:p-10 text-white shadow-2xl">
        <div className="flex flex-col gap-8 pb-32">
          
          {/* Header Navigation */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest overflow-x-auto w-full md:w-auto">
              <span className="text-white border-b-2 border-[#E2FF6F] pb-1 cursor-pointer whitespace-nowrap">Curated for You</span>
              <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors whitespace-nowrap">Local Cloud</span>
              <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors whitespace-nowrap">Spotify Library</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full text-[#E2FF6F] whitespace-nowrap border border-white/5">
              <Sparkles size={14}/> {detectedMood}
            </div>
          </header>

          {/* Cinematic Banner */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-[32px] overflow-hidden group shadow-2xl border border-white/10">
            {/* Use first track's cover as the banner if available */}
            <img 
              src={activeTrack?.cover || "https://images.unsplash.com/photo-1493225457124-a1a2a5f13498?auto=format&fit=crop&w=1600&q=80"} 
              alt="Featured Mood" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <span className="text-[#E2FF6F] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">AI Generated Audio</span>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none uppercase">
                {detectedMood.split(' ')[0]} <br className="hidden md:block"/> VIBES
              </h1>
              <p className="text-gray-300 max-w-md font-medium mb-8 text-sm md:text-base">
                A localized high-fidelity synthesis calibrated precisely for your current emotional baseline.
              </p>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => activeTrack && setActiveTrack(playlist[0])}
                  disabled={isLoading || !playlist.length}
                  className="h-12 md:h-14 px-6 md:px-8 bg-[#E2FF6F] text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
                >
                  <Play fill="black" size={20}/> Play Engine
                </button>
                <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <Heart size={20}/> {playlist.length} Tracks
                </div>
              </div>
            </div>
          </div>

          {/* Split Section: Tracklist & Details */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Main Tracklist */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Cloud Queue</h3>
                <button onClick={fetchCloudSongs} className="text-gray-500 hover:text-white transition-colors cursor-pointer" title="Refresh">
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/>
                </button>
              </div>
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-[#E2FF6F]" size={32}/>
                  <span className="ml-4 text-gray-400 font-medium">Scanning ImageKit Cloud...</span>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-gray-400 font-medium mb-4">{error}</span>
                  <button onClick={fetchCloudSongs} className="text-[#E2FF6F] font-bold hover:underline cursor-pointer">Try Again</button>
                </div>
              )}

              {/* Track List */}
              {!isLoading && !error && playlist.map((track, idx) => (
                <div 
                  key={track.id} 
                  onClick={() => setActiveTrack(track)}
                  className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-colors ${activeTrack?.id === track.id ? 'bg-white/10 border-white/20' : 'bg-[#121212] border-transparent hover:bg-zinc-900 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-bold w-6 text-center">{idx + 1}</span>
                    <div className="h-12 w-12 rounded-lg overflow-hidden relative shadow-md bg-zinc-800">
                      {track.cover ? (
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Play size={16}/>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="text-white" fill="white" size={16}/>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold ${activeTrack?.id === track.id ? 'text-[#E2FF6F]' : 'text-white'}`}>{track.title}</span>
                      <span className="text-gray-400 text-xs md:text-sm font-medium">{track.artist}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-6 text-gray-400">
                    <span className="hidden md:block text-sm">{track.mood} Match</span>
                    <Heart className="hover:text-white transition-colors cursor-pointer" size={18}/>
                    <MoreHorizontal className="hover:text-white transition-colors hidden md:block cursor-pointer" size={18}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-[#121212] rounded-[32px] p-8 border border-white/5 sticky top-8 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">Sonic Signature</h3>
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      <span>Tempo</span> <span>Dynamic</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-3/4 rounded-full"/>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                      <span>Energy Match</span> <span>High</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E2FF6F] w-[85%] rounded-full"/>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Source</span>
                    <p className="text-white font-medium mt-1">ImageKit Cloud</p>
                    <p className="text-gray-400 text-xs mt-1">{playlist.length} tracks loaded</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FloatingPlayer onPlayLog={handlePlayLog} track={activeTrack}/>
      
    </DashboardLayout>
  );
};

export default MusicHub;
