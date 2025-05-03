import { Link } from 'react-router-dom';
import { FileText, Home } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="flex justify-center mb-6">
            <FileText className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/" className="btn-primary flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <Link to="/dashboard" className="btn-outline flex items-center justify-center">
              Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;