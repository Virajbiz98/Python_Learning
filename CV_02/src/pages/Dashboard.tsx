import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, Plus, Trash, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CV } from '../types/database.types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Dashboard() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchCVs() {
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCvs(data || []);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        toast.error('Failed to load your CVs');
      } finally {
        setLoading(false);
      }
    }

    fetchCVs();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCvs(cvs.filter(cv => cv.id !== id));
      toast.success('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your CVs</h1>
          <p className="text-gray-400">Manage and create professional CVs</p>
        </div>
        <Link
          to="/create-cv"
          className="btn btn-primary mt-4 sm:mt-0 flex items-center justify-center sm:justify-start gap-2"
        >
          <Plus size={18} />
          <span>Create New CV</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : cvs.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No CVs yet</h2>
          <p className="text-gray-400 mb-6">
            Create your first professional CV to get started
          </p>
          <Link to="/create-cv" className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            <span>Create New CV</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map(cv => (
            <div key={cv.id} className="card flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-white mb-3">{cv.title}</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Template: {cv.template || 'Default'}
                </p>
                <p className="text-gray-400 text-sm">
                  Created: {new Date(cv.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-dark-700 p-4 flex justify-between">
                <div className="flex space-x-2">
                  <Link
                    to={`/edit-cv/${cv.id}`}
                    className="p-2 bg-dark-700 rounded-md hover:bg-dark-600 transition-colors"
                    title="Edit CV"
                  >
                    <FileText size={18} />
                  </Link>
                  <button
                    className="p-2 bg-dark-700 rounded-md hover:bg-dark-600 transition-colors"
                    title="Download PDF"
                    onClick={() => window.open(`/edit-cv/${cv.id}?download=true`, '_blank')}
                  >
                    <Download size={18} />
                  </button>
                </div>
                <button
                  className="p-2 bg-red-900/30 rounded-md hover:bg-red-900/50 transition-colors text-red-400"
                  title="Delete CV"
                  onClick={() => handleDelete(cv.id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
