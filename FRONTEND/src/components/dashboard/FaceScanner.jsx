import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { Camera, Loader2, Sparkles, Activity, CheckCircle2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BUFFER_SIZE = 30; // Approx 0.5 - 1 second rolling window for smoothing

export const FaceScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const requestRef = useRef(null);
  const frameBuffer = useRef([]); // Stores blendshapes over time
  const lastVideoTimeRef = useRef(-1);

  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // App States: 'IDLE' | 'SETUP' | 'SCANNING' | 'LOCKED'
  const [scanState, setScanState] = useState('IDLE');
  const [scanProgress, setScanProgress] = useState(0);
  const [lockedMood, setLockedMood] = useState(null);
  const [averagedMetrics, setAveragedMetrics] = useState([]);
  const [countdown, setCountdown] = useState(3);

  // Initialize MediaPipe
  useEffect(() => {
    const initModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        setFaceLandmarker(landmarker);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading MediaPipe model:", error);
      }
    };
    initModel();
    return () => { if (faceLandmarker) faceLandmarker.close(); };
  }, []);

  // Cleanup Camera
  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const startCamera = async () => {
    try {
      frameBuffer.current = [];
      setScanProgress(0);
      setLockedMood(null);
      setCountdown(3);
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          setScanState('SETUP');
          
          let count = 5;
          setCountdown(5);
          const interval = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
              clearInterval(interval);
              setScanState('SCANNING');
              // Ensure we start predictWebcam after state updates
              setTimeout(() => {
                predictWebcam();
              }, 100);
            }
          }, 1000);
        }, { once: true });
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const predictWebcam = async () => {
    if (!videoRef.current || !faceLandmarker) return;

    const startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      
      const results = faceLandmarker.detectForVideo(videoRef.current, startTimeMs);
      
      if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
        // Push shapes to buffer
        frameBuffer.current.push(results.faceBlendshapes[0].categories);
        if (frameBuffer.current.length > BUFFER_SIZE) {
          frameBuffer.current.shift();
        }

        // Calculate Averages across the rolling buffer
        const getAvg = (categoryName) => {
          const sum = frameBuffer.current.reduce((acc, shapes) => {
            const shape = shapes.find(s => s.categoryName === categoryName);
            return acc + (shape ? shape.score : 0);
          }, 0);
          return sum / frameBuffer.current.length;
        };

        const smile = (getAvg('mouthSmileLeft') + getAvg('mouthSmileRight')) / 2;
        const browDown = (getAvg('browDownLeft') + getAvg('browDownRight')) / 2;
        const browInnerUp = getAvg('browInnerUp');
        const eyeWidened = (getAvg('eyeWidenedLeft') + getAvg('eyeWidenedRight')) / 2;

        // Classification Logic
        let derivedMood = "Neutral";
        if (smile > 0.4) derivedMood = "Joyful & Energetic";
        else if (browDown > 0.4) derivedMood = "Intense & Focused";
        else if (browInnerUp > 0.3) derivedMood = "Melancholic & Calm";
        else if (eyeWidened > 0.3) derivedMood = "Surprised & Elevated";

        setLockedMood(derivedMood);
        setAveragedMetrics([
          { label: "Valence (Joy)", value: smile },
          { label: "Intensity", value: browDown },
          { label: "Vulnerability", value: browInnerUp }
        ]);

      } else {
        // Reset if face is lost
        frameBuffer.current = [];
        setLockedMood("No Face Detected");
        setAveragedMetrics([]);
      }
    }
    
    // Infinite scanning loop
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full max-w-[1600px] mx-auto h-[calc(100vh-100px)]">
      
      {/* LEFT: Video Feed & Scanner */}
      <div className="xl:col-span-2 flex flex-col gap-4 h-full">
        <div className="relative w-full h-full bg-[#121212] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
          
          <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-1000 ${(scanState === 'SCANNING' || scanState === 'SETUP') ? 'opacity-100' : 'opacity-30 blur-sm'}`} />
          
          {/* Setup Countdown */}
          {scanState === 'SETUP' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
              <motion.div 
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-[120px] font-black text-white drop-shadow-2xl"
              >
                {countdown}
              </motion.div>
              <span className="text-white text-lg font-medium tracking-widest uppercase mt-4">Position your face</span>
            </div>
          )}

          {/* Scanning Reticle */}
          {scanState === 'SCANNING' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              <div className="w-64 h-64 border-2 border-white/20 rounded-full flex items-center justify-center relative">
                <div className="w-4 h-4 bg-[#E2FF6F] rounded-full animate-ping absolute" />
              </div>
              <span className="mt-8 text-[#E2FF6F] font-bold tracking-widest uppercase text-sm animate-pulse">Tracking Core Active...</span>
            </div>
          )}

          {/* Idle State */}
          {scanState === 'IDLE' && (
            <div className="flex flex-col items-center justify-center text-center p-6 z-10">
              <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6"><Camera className="text-gray-400" size={32}/></div>
              <h3 className="text-2xl font-medium text-white mb-2">Initialize Scanner</h3>
              <p className="text-gray-500 mb-8 max-w-sm">Look directly into the camera. We will analyze a 3-second sample for high-fidelity accuracy.</p>
              <button onClick={startCamera} disabled={!isModelLoaded} className="bg-[#E2FF6F] text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                {!isModelLoaded ? <><Loader2 className="animate-spin" size={18}/> Warming AI Core...</> : 'Begin Scan'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Analysis Data & Action */}
      <div className="xl:col-span-1 flex flex-col gap-6 h-full">
        
        {/* Mood Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col justify-center min-h-[250px] relative overflow-hidden transition-all duration-500">
          <div className="flex items-center gap-2 text-gray-500 font-medium mb-4 uppercase tracking-widest text-xs z-10">
            <Activity className="text-[#E2FF6F]" size={16}/> 
            Detected State
          </div>
          
          <AnimatePresence mode="wait">
            <motion.h2 
              key={lockedMood || "waiting"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-4xl font-extrabold text-[#121212] leading-tight z-10"
            >
              {lockedMood || "Awaiting Data..."}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Metrics & Redirect CTA */}
        <div className="bg-[#121212] rounded-[32px] p-8 shadow-xl flex-1 border border-white/5 flex flex-col">
          <div className="flex items-center gap-2 text-white font-medium mb-8"><Activity size={18}/> Real-time Metrics</div>
          
          <div className="flex flex-col gap-8 flex-1">
            {scanState === 'SCANNING' ? averagedMetrics.map((metric, idx) => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider">
                  <span className="text-gray-400">{metric.label}</span>
                  <span className="text-white">{(metric.value * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${metric.value * 100}%` }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="h-full bg-[#E2FF6F] rounded-full" />
                </div>
              </motion.div>
            )) : (
              <div className="text-gray-500 text-sm font-medium italic">Metrics will populate during scan...</div>
            )}
          </div>

          {/* Handoff to Audio Player */}
          <AnimatePresence>
            {scanState === 'SCANNING' && lockedMood && lockedMood !== "No Face Detected" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mt-auto flex flex-col gap-3"
              >
                <button 
                  onClick={() => navigate('/dashboard/player', { state: { mood: lockedMood } })}
                  className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Generate Playlist <Play className="fill-black group-hover:translate-x-1 transition-transform" size={16}/>
                </button>
                <button 
                  onClick={startCamera}
                  className="w-full bg-transparent text-gray-400 hover:text-white py-2 rounded-full font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Camera size={14}/> Re-Scan Face
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
