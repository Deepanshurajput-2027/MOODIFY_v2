import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Music, AlertCircle, Home } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please use the link provided in your email.');
      return;
    }

    const performVerification = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/verify-email',
          { token },
          { withCredentials: true }
        );

        setStatus('success');
        setMessage(response.data.message || 'Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message ||
          'Verification failed. The link may have expired or is invalid.'
        );
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-white shadow-md">
            <Music className="h-4 w-4" />
          </div>
          <span className="font-extrabold tracking-tighter text-xl text-black">MOODIFY</span>
        </div>

        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="space-y-6 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 shadow-inner">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verifying Email</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Please wait a moment while we validate your verification token...
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="space-y-6 py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-md">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Account Activated
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Email Verified Successfully!
              </h2>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {message}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full group relative flex h-13 items-center justify-center gap-2 overflow-hidden rounded-xl bg-black text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-zinc-900 hover:shadow-xl cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="space-y-6 py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 shadow-md">
              <XCircle className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                Verification Failed
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Unable to Verify
              </h2>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {message}
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-900 cursor-pointer"
              >
                Go to Sign In
              </button>
              <Link
                to="/"
                className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
