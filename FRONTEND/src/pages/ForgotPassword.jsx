import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      );

      setStatus({
        type: 'success',
        message: response.data.message || 'If an account exists, a reset link has been sent.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
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
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Password?</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Feedback Messages */}
          {status.type === 'error' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'success' ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/70 p-6 text-center">
                <CheckCircle2 className="mb-3 h-10 w-10 text-green-600" />
                <h2 className="text-base font-semibold text-gray-900">Check your inbox</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {status.message}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  The link will expire in 10 minutes.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus({ type: '', message: '' });
                    setEmail('');
                  }}
                  className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Send another email
                </button>
                <Link
                  to="/login"
                  className="block w-full rounded-xl bg-black py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-xl bg-black py-3.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Remember your password?{' '}
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
