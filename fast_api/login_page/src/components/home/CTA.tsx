import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function CTA() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 relative">
      {/* Background effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" 
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)' 
        }}
      ></div>
      
      <div className="container relative z-10">
        <div className="glass-panel p-8 md:p-12 text-center rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Professional CV?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully created standout 
            resumes with ShimmerCV's intuitive builder.
          </p>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="btn-primary text-lg px-8 py-3 shadow-glow"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="btn-primary text-lg px-8 py-3 shadow-glow"
            >
              Get Started Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTA;