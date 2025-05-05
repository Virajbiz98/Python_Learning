import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
<<<<<<< HEAD
  signUp: (email: string, password: string, name: string) => Promise<{error?: {message: string}, needsEmailConfirmation?: boolean}>;
=======
  register: (name: string, email: string, password: string) => Promise<void>;
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/token', formData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      const userResponse = await axios.get('http://localhost:8000/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      
      setUser(userResponse.data);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

<<<<<<< HEAD
  // SignUp function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post('http://localhost:8000/users', {
=======
  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('http://localhost:8000/users', {
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
        name,
        email,
        password
      });
      
<<<<<<< HEAD
      if (response.status === 201) {
        return { needsEmailConfirmation: true };
      }
      return {};
    } catch (error: any) {
      if (error.response) {
        return { error: { message: error.response.data.detail || 'Registration failed' } };
      }
      return { error: { message: 'Network error - could not connect to server' } };
=======
      // Auto login after successful registration
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
<<<<<<< HEAD
    signUp,
=======
    register,
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
<<<<<<< HEAD
}
=======
}
>>>>>>> ca37b1b5e09e2f953b100fb69347e0da9580f893
