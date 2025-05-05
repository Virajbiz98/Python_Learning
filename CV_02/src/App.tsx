import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import CVForm from './pages/CVForm';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import { supabase } from './lib/supabase';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Set up database tables if they don't exist
    const setupDatabase = async () => {
      try {
        // Check if tables exist
        const { error: tablesError } = await supabase
          .from('cvs')
          .select('id')
          .limit(1);

        if (tablesError) {
          console.error('Tables may not exist:', tablesError);
          toast.error('Error connecting to database. Please try again later.');
        }
      } catch (error) {
        console.error('Database setup error:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-cv" element={<CVForm />} />
          <Route path="edit-cv/:id" element={<CVForm />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;