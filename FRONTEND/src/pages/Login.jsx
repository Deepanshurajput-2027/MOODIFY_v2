import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/ui/AuthForm';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-28 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <AuthForm initialMode="login" onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
}
