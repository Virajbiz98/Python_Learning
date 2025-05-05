import { useState } from 'react';
<<<<<<< HEAD
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/ui/LoadingScreen';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
=======
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
});

type RegisterFormValues = z.infer<typeof registerSchema>;

<<<<<<< HEAD
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signUp, user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { error, needsEmailConfirmation } = await signUp(data.email, data.password, data.name);
      if (error) {
        toast.error(error.message || 'Failed to create account');
      } else {
        if (needsEmailConfirmation) {
          setEmailSent(true);
          toast.success('Please check your email to confirm your account');
        } else {
          toast.success('Account created successfully');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
=======
function RegisterPage() {
  const { isAuthenticated, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
        </div>

        <div className="w-full max-w-md">
          <div className="glass-panel p-8 sm:p-10 text-center">
            <Mail className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 green-glow-sm">Check your email</h2>
            <p className="text-gray-300 mb-6">
              We've sent you an email with a confirmation link. Please check your inbox and click the link to activate your account.
            </p>
            <Link to="/login" className="btn-primary">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-primary-500/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-panel p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold green-glow-sm">Create Account</h1>
            <p className="text-gray-400 mt-2">Join ShimmerCV to create professional CVs</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  className={`glass-input pl-10 w-full ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`glass-input pl-10 w-full ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`glass-input pl-10 w-full ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`glass-input pl-10 w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingScreen /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300">
                Sign in
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
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-gray-400 mt-1">Join ShimmerCV and create your CV</p>
            </div>

            {error && (
              <div className="bg-error/20 border border-error/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`glass-input w-full ${
                    errors.name ? 'border-error' : 'border-gray-700'
                  }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-error text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                  Password
                </label>
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`glass-input w-full pr-10 ${
                      errors.confirmPassword ? 'border-error' : 'border-gray-700'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
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
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
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

export default RegisterPage;
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
