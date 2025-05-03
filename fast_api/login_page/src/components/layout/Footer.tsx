import { Link } from 'react-router-dom';
import { FileText, Github, Linkedin, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900/60 border-t border-gray-800 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold">
                Shimmer<span className="text-primary">CV</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Create professional resumes with our modern and intuitive CV builder. 
              Choose from beautiful templates and export to PDF.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="btn-icon bg-gray-800 hover:bg-gray-700 text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="btn-icon bg-gray-800 hover:bg-gray-700 text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="btn-icon bg-gray-800 hover:bg-gray-700 text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ShimmerCV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;