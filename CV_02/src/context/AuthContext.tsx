import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; rateLimitSeconds?: number }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set a timeout to ensure loading is set to false even if auth state change doesn't fire
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setAuthLoading(false);
      return { error };
    } catch (error) {
      setAuthLoading(false);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        // Check for rate limit error
        if (signUpError.message?.includes('rate_limit')) {
          const seconds = parseInt(signUpError.message.match(/\d+/)?.[0] || '60');
          return { error: signUpError, rateLimitSeconds: seconds };
        }
        return { error: signUpError };
      }

      // Get the user ID from the session since we just signed up
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create profile entry
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: fullName,
          },
        ]);

        if (profileError) {
          return { error: new Error('Failed to create profile: ' + profileError.message) };
        }
      }
      setAuthLoading(false);
      return { error: null };
    } catch (error) {
      setAuthLoading(false);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authLoading,
        setAuthLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
