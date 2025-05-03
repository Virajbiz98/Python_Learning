import { useState } from 'react';
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
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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
    } finally {
      setIsLoading(false);
    }
  };

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