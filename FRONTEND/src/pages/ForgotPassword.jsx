import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    return (
        <section className="relative flex min-h-screen bg-gray-50 px-4 py-16 md:py-32">
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-28 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>
            <form className="bg-gray-100 m-auto h-fit w-full max-w-sm overflow-hidden rounded-xl border shadow-md">
                <div className="bg-white -m-px rounded-xl border p-8 pb-6">
                    <div>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Recover Password</h1>
                        <p className="text-sm">Enter your email to receive a reset link</p>
                    </div>
                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="block text-sm" htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="name@example.com" required type="email"/>
                        </div>
                        <Button className="w-full">Send Reset Link</Button>
                    </div>
                </div>
                <div className="p-3">
                    <p className="text-gray-900 text-center text-sm">
                        Remembered your password?
                        <Button asChild className="px-2" variant="link">
                            <Link to="/login">Log in</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
