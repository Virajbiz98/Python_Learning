import { useState } from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '../../lib/validationSchemas';
import type { z } from 'zod';

type PersonalInfoInputs = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  personalInfo: PersonalInfoInputs;
  setPersonalInfo: (personalInfo: PersonalInfoInputs) => void;
}

function PersonalInfoForm({ personalInfo, setPersonalInfo }: PersonalInfoFormProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof PersonalInfoInputs, value);
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Please select a photo to upload.');
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/${crypto.randomUUID()}.${fileExt}`;

      // Upload photo to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update personal info with photo URL
      setValue('photoUrl', publicUrl);
      setPersonalInfo({
        ...personalInfo,
        photoUrl: publicUrl
      });

      toast.success('Profile photo uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
      <p className="text-gray-400 mb-6">
        Add your contact information and professional summary.
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
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
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
              <label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </label>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              name="fullName"
              className={`block w-full pl-10 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary 
                ${errors.fullName ? 'border-red-500' : 'border-dark-700'}`}
              placeholder="John Doe"
              onChange={handleChange}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Professional Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Professional Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('title')}
              type="text"
              id="title"
              name="title"
              className={`block w-full pl-10 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary
                ${errors.title ? 'border-red-500' : 'border-dark-700'}`}
              placeholder="Software Engineer"
              onChange={handleChange}
            />
          </div>
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('email')}
              type="email"
              id="email"
              name="email"
              className={`block w-full pl-10 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary
                ${errors.email ? 'border-red-500' : 'border-dark-700'}`}
              placeholder="john@example.com"
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              name="phone"
              className={`block w-full pl-10 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary
                ${errors.phone ? 'border-red-500' : 'border-dark-700'}`}
              placeholder="+1 (555) 123-4567"
              onChange={handleChange}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('location')}
              type="text"
              id="location"
              name="location"
              className={`block w-full pl-10 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary
                ${errors.location ? 'border-red-500' : 'border-dark-700'}`}
              placeholder="City, Country"
              onChange={handleChange}
            />
          </div>
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Summary */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-300">
            Professional Summary
          </label>
          <textarea
            {...register('summary')}
            id="summary"
            name="summary"
            rows={4}
            className={`block w-full px-3 py-2 bg-dark-800 border rounded-lg focus:ring-primary focus:border-primary
              ${errors.summary ? 'border-red-500' : 'border-dark-700'}`}
            placeholder="Write a brief summary of your professional background and key skills..."
            onChange={handleChange}
          ></textarea>
          {errors.summary && (
            <p className="text-sm text-red-500">{errors.summary.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default PersonalInfoForm;