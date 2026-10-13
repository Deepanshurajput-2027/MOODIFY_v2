import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/authSlice';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import DashboardScan from './pages/DashboardScan';
import MusicHub from './pages/MusicHub';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const [showPreloader, setShowPreloader] = useState(true);
  
  const { isCheckingAuth } = useSelector((state) => state.auth || { isCheckingAuth: false });

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <BrowserRouter>
      {showPreloader && !isCheckingAuth && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      
      {showPreloader && isCheckingAuth && (
        <div className="fixed inset-0 z-[100] h-screen w-screen bg-black flex items-center justify-center">
           <span className="text-2xl font-bold tracking-[0.3em] text-white uppercase">Initializing</span>
        </div>
      )}
      
      <main className="relative min-h-screen w-full">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/verify-email" element={<VerifyEmail/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard/scan" element={<DashboardScan/>} />
          <Route path="/dashboard/player" element={<MusicHub/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;