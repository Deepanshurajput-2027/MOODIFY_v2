import * as React from 'react';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cn } from "../../lib/utils";
import { Mail, Lock, User, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSuccess } from '../../store/authSlice';

const calculatePasswordStrength = (password) => {
  const requirements = { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /\d/.test(password), special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) };
  const score = Object.values(requirements).filter(Boolean).length;
  const feedback = [];
  if (!requirements.length) feedback.push('At least 8 characters');
  if (!requirements.uppercase) feedback.push('One uppercase letter');
  if (!requirements.lowercase) feedback.push('One lowercase letter');
  if (!requirements.number) feedback.push('One number');
  if (!requirements.special) feedback.push('One special character');
  return { score, feedback, requirements };
};

const PasswordStrengthIndicator = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const getStrengthColor = (score) => {
    if (score <= 1) return 'text-red-500'; if (score <= 2) return 'text-orange-500'; if (score <= 3) return 'text-yellow-500'; if (score <= 4) return 'text-blue-500'; return 'text-gray-900';
  };
  const getStrengthText = (score) => {
    if (score <= 1) return 'Very Weak'; if (score <= 2) return 'Weak'; if (score <= 3) return 'Fair'; if (score <= 4) return 'Good'; return 'Strong';
  };
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2 animate-in fade-in-50 slide-in-from-bottom-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className={`h-full ${getStrengthColor(strength.score)} bg-current rounded-full`} style={{ width: `${(strength.score / 5) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500 min-w-[60px]">{getStrengthText(strength.score)}</span>
      </div>
    </div>
  );
};

export function AuthForm({ onSuccess, onClose, initialMode = 'login', className }) {
  const dispatch = useDispatch();
  const [authMode, setAuthMode] = useState(initialMode);
  const [registrationSuccess, setRegistrationSuccess] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value) => {
    let error = '';
    switch (field) {
      case 'name': if (typeof value === 'string' && authMode === 'signup' && !value.trim()) error = 'Name is required'; break;
      case 'email': if (!value || (typeof value === 'string' && !value.trim())) error = 'Email is required'; else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address'; break;
      case 'password': if (!value) error = 'Password is required'; else if (typeof value === 'string' && value.length < 8) error = 'Password must be at least 8 characters'; break;
    }
    return error;
  }, [authMode]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const fieldsToValidate = ['email', 'password'];
    if (authMode === 'signup') fieldsToValidate.push('name');
    fieldsToValidate.forEach(field => { const error = validateField(field, formData[field]); if (error) newErrors[field] = error; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [authMode, formData, validateField]);

  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setRegistrationSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    setRegistrationSuccess('');
    
    try {
      if (authMode === 'login') {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });

        const userPayload = response.data.user || response.data;
        dispatch(loginSuccess(userPayload));
        onSuccess?.(userPayload);
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username: formData.name,
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });

        setRegisteredEmail(formData.email);
        setRegistrationSuccess(
          response.data.message ||
          'Registration successful! Please check your email to verify your account before logging in.'
        );
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthContent = () => {
    if (registrationSuccess) {
      return (
        <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <Mail className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Verify Your Email</h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              We sent a verification link to <span className="font-semibold text-gray-900">{registeredEmail}</span>.
              Please check your inbox and click the link to activate your account.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-all shadow-md"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {authMode === 'signup' && (
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"/>
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={cn("w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20", errors.name ? "border-red-500" : "border-gray-200")} />
            </div>
          </div>
        )}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"/>
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={cn("w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20", errors.email ? "border-red-500" : "border-gray-200")} />
          </div>
        </div>
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"/>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={cn("w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20", errors.password ? "border-red-500" : "border-gray-200")} />
          </div>
          {authMode === 'signup' && <PasswordStrengthIndicator password={formData.password}/>}
        </div>

        {authMode === 'login' && (
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-gray-600 hover:text-black hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full relative bg-black text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-md">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto"/> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </div>
    );
  };

  return (
    <div className={cn("p-6", className)}>
      {errors.general && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{errors.general}</span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          {registrationSuccess
            ? 'Check Your Inbox'
            : (authMode === 'login' ? 'Welcome Back' : 'Create Account')}
        </h2>
      </div>

      {!registrationSuccess && (
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => handleModeSwitch('login')} className={cn("flex-1 py-2 px-4 rounded-lg text-sm transition-all", authMode === 'login' ? "bg-white shadow-sm font-medium text-black" : "text-gray-500")} type="button">Login</button>
          <button onClick={() => handleModeSwitch('signup')} className={cn("flex-1 py-2 px-4 rounded-lg text-sm transition-all", authMode === 'signup' ? "bg-white shadow-sm font-medium text-black" : "text-gray-500")} type="button">Sign Up</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>{renderAuthContent()}</form>
    </div>
  );
}
