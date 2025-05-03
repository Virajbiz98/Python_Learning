import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HeroSphere from './HeroSphere';

function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" 
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)' 
        }}
      ></div>

      <div className="container py-20 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your <span className="glow-text text-primary">Professional CV</span> in Minutes
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              Create standout resumes with our intuitive builder. Choose from beautiful templates, 
              customize to your needs, and export to PDF instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-center text-base px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-center text-base px-8 py-3">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn-outline text-center text-base px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <HeroSphere />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;