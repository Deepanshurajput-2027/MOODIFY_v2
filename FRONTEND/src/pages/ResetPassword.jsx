import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Countdown timer for automatic redirection
  useEffect(() => {
    let timer;
    if (successMessage && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (successMessage && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [successMessage, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new link.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { token, password },
        { withCredentials: true }
      );

      setSuccessMessage(response.data.message || 'Password has been reset successfully!');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 md:py-24">
      {/* Back Button */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/10">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Set New Password</h1>
            <p className="mt-2 text-sm text-gray-500">
              Please enter and confirm your new secure password below.
            </p>
          </div>

          {/* Missing Token Alert */}
          {!token && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium">Missing Reset Token</p>
                <p className="mt-1 text-xs text-amber-700">
                  No valid reset token found in URL. Please click the link from your email or request a new one.
                </p>
                <Link
                  to="/forgot-password"
                  className="mt-3 inline-block font-semibold text-amber-900 underline text-xs"
                >
                  Request new reset link →
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success State with 3-second redirect countdown */}
          {successMessage ? (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/70 p-6">
                <CheckCircle2 className="mb-3 h-12 w-12 text-green-600 animate-bounce" />
                <h2 className="text-lg font-bold text-gray-900">Password Reset Complete!</h2>
                <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
                <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-800">
                  Redirecting to login in {countdown}s...
                </div>
              </div>

              <Link
                to="/login"
                className="block w-full rounded-xl bg-black py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    disabled={isLoading || !token}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    disabled={isLoading || !token}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-black py-3.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Know your password?{' '}
                  <Link to="/login" className="font-semibold text-black hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
