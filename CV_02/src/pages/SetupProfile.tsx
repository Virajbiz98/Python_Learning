import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ProfileForm from '../components/profile/ProfileForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { UserProfile } from '../types/database.types';

export default function SetupProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;
  const [isLoading, setIsLoading] = useState(true);
  const [existingProfile, setExistingProfile] = useState<Partial<UserProfile> | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has already completed their profile
    const checkProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw error;
        }

        if (data) {
          if (isNewUser) {
            // If profile exists and this is a new user, redirect to dashboard
            navigate('/dashboard');
            return;
          }
          // Set existing profile data for editing
          setExistingProfile(data);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [user, navigate, isNewUser]);

  const handleProfileComplete = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Save profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      toast.success(isNewUser ? 'Profile setup complete!' : 'Profile updated successfully');
      navigate(isNewUser ? '/create-cv' : '/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  if (isLoading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button for editing mode */}
        {!isNewUser && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-6"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        )}

        <h1 className="text-3xl font-bold text-white mb-2">
          {isNewUser ? 'Complete Your Profile' : 'Edit Profile'}
        </h1>
        <p className="text-gray-400 mb-8">
          {isNewUser
            ? "Tell us about yourself to get started with personalized CV creation"
            : "Update your profile information"}
        </p>

        <ProfileForm 
          initialProfile={existingProfile || undefined}
          onComplete={handleProfileComplete}
          isNewUser={isNewUser}
        />
            ? 'Tell us about yourself to get started with creating professional CVs.'
            : 'Update your profile information.'}
        </p>

        <ProfileForm onComplete={handleProfileComplete} />
      </div>
    </div>
  );
}
