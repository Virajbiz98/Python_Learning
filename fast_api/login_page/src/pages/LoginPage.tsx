import { useState } from 'react';
<<<<<<< HEAD
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/ui/LoadingScreen';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
=======
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

<<<<<<< HEAD
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: data.email,
          password: data.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const { access_token } = await response.json();
      localStorage.setItem('token', access_token);
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
=======
function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-panel p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold green-glow-sm">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to your ShimmerCV account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ... form fields remain unchanged ... */}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingScreen /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <div className="glass-panel p-8 rounded-xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-gray-400 mt-1">Sign in to your ShimmerCV account</p>
            </div>

            {error && (
              <div className="bg-error/20 border border-error/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`glass-input w-full ${
                    errors.email ? 'border-error' : 'border-gray-700'
                  }`}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`glass-input w-full pr-10 ${
                      errors.password ? 'border-error' : 'border-gray-700'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
