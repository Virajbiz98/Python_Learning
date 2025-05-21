import { useState } from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Upload, ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types/database.types';
import { profileFormSchema } from '../../lib/validationSchemas';
import { toast } from 'sonner';

type Step = 'personal' | 'education' | 'experience' | 'skills' | 'review';

interface ProfileFormProps {
  initialProfile?: Partial<UserProfile>;
  onComplete: (profile: Partial<UserProfile>) => Promise<void>;
  isNewUser?: boolean;
}

export default function ProfileForm({ initialProfile, onComplete, isNewUser }: ProfileFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form handling with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      personal_info: {
        fullName: initialProfile?.full_name || '',
        email: initialProfile?.email || '',
        phone: initialProfile?.phone || '',
        location: initialProfile?.location || '',
        title: initialProfile?.professional_title || '',
        summary: initialProfile?.professional_summary || '',
        photoUrl: initialProfile?.photo_url || '',
        website: initialProfile?.website || ''
      },
      education: initialProfile?.education || [
        {
          id: crypto.randomUUID(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ],
      experience: initialProfile?.experience || [
        {
          id: crypto.randomUUID(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: []
        }
      ],
      skills: initialProfile?.skills || [
        {
          id: crypto.randomUUID(),
          name: '',
          level: 3
        }
      ]
    }
  });

  // Form arrays will be set up for each section when they are implemented

  // Upload photo handler
  const handlePhotoUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setValue('personal_info.photoUrl', publicUrl);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Error uploading photo');
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  // Step validation and navigation
  const validateStep = async () => {
    let isValid = true;
    switch (currentStep) {
      case 'personal':
        isValid = await trigger('personal_info');
        break;
      case 'education':
        isValid = await trigger('education');
        break;
      case 'experience':
        isValid = await trigger('experience');
        break;
      case 'skills':
        isValid = await trigger('skills');
        break;
    }
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (!isValid) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    switch (currentStep) {
      case 'personal':
        setCurrentStep('education');
        break;
      case 'education':
        setCurrentStep('experience');
        break;
      case 'experience':
        setCurrentStep('skills');
        break;
      case 'skills':
        setCurrentStep('review');
        break;
    }
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'education':
        setCurrentStep('personal');
        break;
      case 'experience':
        setCurrentStep('education');
        break;
      case 'skills':
        setCurrentStep('experience');
        break;
      case 'review':
        setCurrentStep('skills');
        break;
    }
    window.scrollTo(0, 0);
  };

  // Form submission
  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setSaving(true);

      // Transform form data to match the UserProfile type
      const transformedData: Partial<UserProfile> = {
        full_name: data.personal_info.fullName,
        email: data.personal_info.email,
        phone: data.personal_info.phone,
        location: data.personal_info.location,
        professional_title: data.personal_info.title,
        professional_summary: data.personal_info.summary,
        website: data.personal_info.website,
        photo_url: data.personal_info.photoUrl,
        education: data.education,
        experience: data.experience.map(exp => ({
          ...exp,
          endDate: exp.endDate || (exp.current ? 'Present' : ''),
          description: Array.isArray(exp.description) ? exp.description : [exp.description]
        })) as UserProfile['experience'],
        skills: data.skills
      };

      await onComplete(transformedData);
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <p className="text-gray-400">
              Fill out your basic information to get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {watch('personal_info.photoUrl') ? (
                    <img
                      src={watch('personal_info.photoUrl')}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center">
                      <User size={32} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="photo"
                      className="btn btn-outline flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={18} />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: Square photo, 400x400 pixels or larger
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('personal_info.fullName')}
                    className="input pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {errors.personal_info?.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.fullName.message}</p>
                )}
              </div>

              {/* Professional Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Professional Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('personal_info.title')}
                    className="input pl-10"
                    placeholder="Software Engineer"
                  />
                </div>
                {errors.personal_info?.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.title.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    {...register('personal_info.email')}
                    className="input pl-10"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.personal_info?.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    {...register('personal_info.phone')}
                    className="input pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.personal_info?.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.phone.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('personal_info.location')}
                    className="input pl-10"
                    placeholder="New York, NY"
                  />
                </div>
                {errors.personal_info?.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.location.message}</p>
                )}
              </div>

              {/* Summary */}
              <div className="md:col-span-2">
                <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
                  Professional Summary *
                </label>
                <textarea
                  {...register('personal_info.summary')}
                  rows={5}
                  className="input"
                  placeholder="Write a brief summary of your professional background, skills, and career objectives..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Keep your summary concise and focused on your key professional strengths.
                </p>
                {errors.personal_info?.summary && (
                  <p className="mt-1 text-sm text-red-500">{errors.personal_info.summary.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {renderStep()}

      <div className="flex justify-between mt-8">
        {currentStep !== 'personal' && (
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-outline flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}

        {currentStep === 'review' ? (
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Profile
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="btn btn-primary flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
