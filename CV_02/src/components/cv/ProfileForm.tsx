import { useState } from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Upload, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Types
interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  photo_url?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  updated_at?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface ProfileFormProps {
  initialProfile?: Partial<UserProfile>;
  onComplete: (profile: Partial<UserProfile>) => Promise<void>;
  isNewUser?: boolean;
}

// Define the steps for the form
type Step = 'personal' | 'education' | 'experience' | 'skills' | 'review';

export default function ProfileForm({ initialProfile, onComplete, isNewUser }: ProfileFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(!initialProfile);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    ...initialProfile,
    user_id: user?.id
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Education state
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  // Experience state
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });

  // Skills state
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 3
  });

  // Add education entry
  const addEducation = () => {
    const education = formData.education || [];
    const newEntry = {
      ...newEducation,
      id: crypto.randomUUID()
    };
    setFormData(prev => ({
      ...prev,
      education: [...education, newEntry]
    }));
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: '',
      description: ''
    });
  };

  // Remove education entry
  const removeEducation = (id: string) => {
    const education = formData.education || [];
    setFormData(prev => ({
      ...prev,
      education: education.filter(e => e.id !== id)
    }));
  };

  // Add experience entry
  const addExperience = () => {
    const experience = formData.experience || [];
    const newEntry = {
      ...newExperience,
      id: crypto.randomUUID()
    };
    setFormData(prev => ({
      ...prev,
      experience: [...experience, newEntry]
    }));
    setNewExperience({
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    });
  };

  // Remove experience entry
  const removeExperience = (id: string) => {
    const experience = formData.experience || [];
    setFormData(prev => ({
      ...prev,
      experience: experience.filter(e => e.id !== id)
    }));
  };

  // Add skill
  const addSkill = () => {
    const skills = formData.skills || [];
    const newEntry = {
      ...newSkill,
      id: crypto.randomUUID()
    };
    setFormData(prev => ({
      ...prev,
      skills: [...skills, newEntry]
    }));
    setNewSkill({
      name: '',
      level: 3
    });
  };

  // Remove skill
  const removeSkill = (id: string) => {
    const skills = formData.skills || [];
    setFormData(prev => ({
      ...prev,
      skills: skills.filter(s => s.id !== id)
    }));
  };

  // Handle form field changes for nested objects
  const handleNestedChange = (
    type: 'education' | 'experience' | 'skills',
    id: string,
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => {
      const items = prev[type] || [];
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };

      return {
        ...prev,
        [type]: updatedItems
      };
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${crypto.randomUUID()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Update form data with photo URL
      setFormData(prev => ({
        ...prev,
        photo_url: publicUrl
      }));

      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 'personal') {
      if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.title?.trim()) newErrors.title = 'Professional title is required';
      if (!formData.location?.trim()) newErrors.location = 'Location is required';
      if (!formData.summary?.trim()) newErrors.summary = 'Professional summary is required';
    }
    
    else if (currentStep === 'education') {
      if (!formData.education?.length) {
        newErrors.education = 'At least one education entry is required';
      } else {
        formData.education.forEach((edu, idx) => {
          if (!edu.institution.trim()) {
            newErrors[`education_${idx}_institution`] = 'Institution is required';
          }
          if (!edu.degree.trim()) {
            newErrors[`education_${idx}_degree`] = 'Degree is required';
          }
          if (!edu.field.trim()) {
            newErrors[`education_${idx}_field`] = 'Field of study is required';
          }
          if (!edu.start_date.trim()) {
            newErrors[`education_${idx}_start_date`] = 'Start date is required';
          }
          if (!edu.end_date.trim()) {
            newErrors[`education_${idx}_end_date`] = 'End date is required';
          }
        });
      }
    }
    
    else if (currentStep === 'experience') {
      if (!formData.experience?.length) {
        newErrors.experience = 'At least one experience entry is required';
      } else {
        formData.experience.forEach((exp, idx) => {
          if (!exp.company.trim()) {
            newErrors[`experience_${idx}_company`] = 'Company is required';
          }
          if (!exp.position.trim()) {
            newErrors[`experience_${idx}_position`] = 'Position is required';
          }
          if (!exp.location.trim()) {
            newErrors[`experience_${idx}_location`] = 'Location is required';
          }
          if (!exp.start_date.trim()) {
            newErrors[`experience_${idx}_start_date`] = 'Start date is required';
          }
          if (!exp.end_date.trim() && !exp.current) {
            newErrors[`experience_${idx}_end_date`] = 'End date is required unless current';
          }
          if (!exp.description.trim()) {
            newErrors[`experience_${idx}_description`] = 'Description is required';
          }
        });
      }
    }
    
    else if (currentStep === 'skills') {
      if (!formData.skills?.length) {
        newErrors.skills = 'At least one skill is required';
      } else {
        formData.skills.forEach((skill, idx) => {
          if (!skill.name.trim()) {
            newErrors[`skill_${idx}_name`] = 'Skill name is required';
          }
          if (skill.level < 1 || skill.level > 5) {
            newErrors[`skill_${idx}_level`] = 'Skill level must be between 1 and 5';
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setSaving(true);
      await onComplete(formData);
      toast.success(isNewUser ? 'Profile created successfully!' : 'Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (validateStep()) {
      const steps: Step[] = ['personal', 'education', 'experience', 'skills', 'review'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['personal', 'education', 'experience', 'skills', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {formData.photo_url ? (
          <img
            src={formData.photo_url}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className={`input pl-10 ${errors.full_name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
          </div>
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Professional Title *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className={`input pl-10 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Software Engineer"
            />
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

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
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="input pl-10"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

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
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className={`input pl-10 ${errors.location ? 'border-red-500' : ''}`}
              placeholder="New York, NY"
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
            Professional Summary *
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary || ''}
            onChange={handleChange}
            rows={5}
            className={`input ${errors.summary ? 'border-red-500' : ''}`}
            placeholder="Write a brief summary of your professional background, skills, and career objectives..."
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Keep your summary concise and focused on your key professional strengths.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Education</h3>
      
      {/* Existing education entries */}
      {(formData.education || []).map((edu) => (
        <div key={edu.id} className="glass-panel p-4 relative">
          <button
            type="button"
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash className="h-5 w-5" />
          </button>
          
          <div className="pr-10">
            <h4 className="font-medium">{edu.institution}</h4>
            <p>{edu.degree} in {edu.field}</p>
            <p className="text-sm text-gray-400">{edu.start_date} - {edu.end_date}</p>
            {edu.description && (
              <p className="text-sm mt-2">{edu.description}</p>
            )}
          </div>
        </div>
      ))}

      {/* Add new education form */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4">Add Education</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Institution *
            </label>
            <input
              type="text"
              value={newEducation.institution}
              onChange={e => setNewEducation({ ...newEducation, institution: e.target.value })}
              className="input"
              placeholder="University name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Degree *
            </label>
            <input
              type="text"
              value={newEducation.degree}
              onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })}
              className="input"
              placeholder="Bachelor's, Master's, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Field of Study *
            </label>
            <input
              type="text"
              value={newEducation.field}
              onChange={e => setNewEducation({ ...newEducation, field: e.target.value })}
              className="input"
              placeholder="Computer Science, Business, etc."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="text"
                value={newEducation.start_date}
                onChange={e => setNewEducation({ ...newEducation, start_date: e.target.value })}
                className="input"
                placeholder="MM/YYYY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="text"
                value={newEducation.end_date}
                onChange={e => setNewEducation({ ...newEducation, end_date: e.target.value })}
                className="input"
                placeholder="MM/YYYY"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newEducation.description}
              onChange={e => setNewEducation({ ...newEducation, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Describe your achievements, coursework, or other relevant details..."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addEducation}
          disabled={!newEducation.institution || !newEducation.degree || !newEducation.field || !newEducation.start_date || !newEducation.end_date}
          className="btn btn-primary mt-6"
        >
          Add Education
        </button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Work Experience</h3>
      
      {/* Existing experience entries */}
      {(formData.experience || []).map((exp) => (
        <div key={exp.id} className="glass-panel p-4 relative">
          <button
            type="button"
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <Trash className="h-5 w-5" />
          </button>
          
          <div className="pr-10">
            <h4 className="font-medium">{exp.company}</h4>
            <p>{exp.position}</p>
            <p className="text-sm text-gray-400">
              {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
            </p>
            <p className="text-sm text-gray-400">{exp.location}</p>
            <p className="text-sm mt-2">{exp.description}</p>
          </div>
        </div>
      ))}

      {/* Add new experience form */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4">Add Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company *
            </label>
            <input
              type="text"
              value={newExperience.company}
              onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
              className="input"
              placeholder="Company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Position *
            </label>
            <input
              type="text"
              value={newExperience.position}
              onChange={e => setNewExperience({ ...newExperience, position: e.target.value })}
              className="input"
              placeholder="Job title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={newExperience.location}
              onChange={e => setNewExperience({ ...newExperience, location: e.target.value })}
              className="input"
              placeholder="City, Country"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="text"
                value={newExperience.start_date}
                onChange={e => setNewExperience({ ...newExperience, start_date: e.target.value })}
                className="input"
                placeholder="MM/YYYY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="text"
                value={newExperience.end_date}
                onChange={e => setNewExperience({ ...newExperience, end_date: e.target.value })}
                className="input"
                placeholder="MM/YYYY"
                disabled={newExperience.current}
              />
            </div>
          </div>
          
          <div className="col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newExperience.current}
                onChange={e => setNewExperience({ ...newExperience, current: e.target.checked })}
                className="form-checkbox h-5 w-5 text-primary-500"
              />
              <span className="ml-2 text-sm text-gray-300">I currently work here</span>
            </label>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={newExperience.description}
              onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
              className="input"
              rows={4}
              placeholder="Describe your responsibilities, achievements, and skills used..."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addExperience}
          disabled={
            !newExperience.company ||
            !newExperience.position ||
            !newExperience.location ||
            !newExperience.start_date ||
            (!newExperience.end_date && !newExperience.current) ||
            !newExperience.description
          }
          className="btn btn-primary mt-6"
        >
          Add Experience
        </button>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Skills</h3>
      
      {/* Existing skills */}
      {(formData.skills || []).length > 0 && (
        <div className="glass-panel p-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill) => (
              <div
                key={skill.id}
                className="bg-dark-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                <span>{skill.name}</span>
                <span className="text-gray-400">({skill.level}/5)</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new skill form */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4">Add Skill</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              className="input"
              placeholder="e.g., JavaScript, Project Management, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proficiency Level: {newSkill.level}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={newSkill.level}
              onChange={e => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={addSkill}
          disabled={!newSkill.name}
          className="btn btn-primary mt-6"
        >
          Add Skill
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-white">Review Your Profile</h3>
      
      {/* Personal Information */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center justify-between">
          <span>Personal Information</span>
          <button
            type="button"
            onClick={() => setCurrentStep('personal')}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Edit
          </button>
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p>{formData.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Title</p>
            <p>{formData.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p>{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <p>{formData.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Location</p>
            <p>{formData.location}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-400">Professional Summary</p>
          <p className="whitespace-pre-wrap">{formData.summary}</p>
        </div>
      </div>

      {/* Education */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center justify-between">
          <span>Education</span>
          <button
            type="button"
            onClick={() => setCurrentStep('education')}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Edit
          </button>
        </h4>
        
        {formData.education?.map((edu) => (
          <div key={edu.id} className="mb-4 last:mb-0">
            <h5 className="font-medium">{edu.institution}</h5>
            <p>{edu.degree} in {edu.field}</p>
            <p className="text-sm text-gray-400">{edu.start_date} - {edu.end_date}</p>
            {edu.description && (
              <p className="text-sm mt-1">{edu.description}</p>
            )}
          </div>
        ))}
        
        {!formData.education?.length && (
          <p className="text-gray-400">No education entries added</p>
        )}
      </div>

      {/* Experience */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center justify-between">
          <span>Work Experience</span>
          <button
            type="button"
            onClick={() => setCurrentStep('experience')}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Edit
          </button>
        </h4>
        
        {formData.experience?.map((exp) => (
          <div key={exp.id} className="mb-4 last:mb-0">
            <h5 className="font-medium">{exp.company}</h5>
            <p>{exp.position}</p>
            <p className="text-sm text-gray-400">
              {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
            </p>
            <p className="text-sm text-gray-400">{exp.location}</p>
            <p className="text-sm mt-1">{exp.description}</p>
          </div>
        ))}
        
        {!formData.experience?.length && (
          <p className="text-gray-400">No experience entries added</p>
        )}
      </div>

      {/* Skills */}
      <div className="glass-panel p-6">
        <h4 className="text-lg font-medium mb-4 flex items-center justify-between">
          <span>Skills</span>
          <button
            type="button"
            onClick={() => setCurrentStep('skills')}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Edit
          </button>
        </h4>
        
        {formData.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-dark-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.name} ({skill.level}/5)
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No skills added</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">
              Step {['personal', 'education', 'experience', 'skills', 'review'].indexOf(currentStep) + 1} of 5
            </span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full">
            <div
              className="h-2 bg-primary-600 rounded-full transition-all duration-300"
              style={{
                width: `${(((['personal', 'education', 'experience', 'skills', 'review'].indexOf(currentStep) + 1) / 5) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="glass-panel p-6">
          {currentStep === 'personal' && renderPersonalInfo()}
          {currentStep === 'education' && renderEducation()}
          {currentStep === 'experience' && renderExperience()}
          {currentStep === 'skills' && renderSkills()}
          {currentStep === 'review' && renderReview()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className={`btn btn-outline ${currentStep === 'personal' ? 'invisible' : ''}`}
          >
            Previous
          </button>

          {currentStep === 'review' ? (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Complete Profile'}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}