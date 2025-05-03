import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Eye, Download, Edit, Trash2, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface CV {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
}

function DashboardPage() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCVs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/cvs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCvs(response.data);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        setError('Failed to load your CVs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/cvs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (error) {
      console.error('Error deleting CV:', error);
      setError('Failed to delete the CV. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My CVs</h1>
              <p className="text-gray-400">
                Welcome back, {user?.name}. Manage your CVs here.
              </p>
            </div>
            <Link to="/create-cv" className="btn-primary flex items-center mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Create New CV
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="glass-panel p-6 text-center">
              <p className="text-error">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-outline mt-4"
              >
                Try Again
              </button>
            </div>
          ) : cvs.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No CVs yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first CV to get started on your professional journey.
              </p>
              <Link to="/create-cv" className="btn-primary">
                Create Your First CV
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <div key={cv.id} className="glass-panel p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-2">{cv.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Template: {cv.template}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/view-cv/${cv.id}`} 
                      className="btn-outline flex-1 flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                    <Link 
                      to={`/edit-cv/${cv.id}`} 
                      className="btn-outline flex items-center justify-center px-3"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(cv.id)} 
                      className="btn-outline flex items-center justify-center px-3 hover:text-error hover:border-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;