import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Form schemas
const personalInfoSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  summary: z.string().optional(),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
  linkedin: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
  github: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
});

const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(1, 'Institution name is required'),
      degree: z.string().min(1, 'Degree is required'),
      field_of_study: z.string().optional(),
      start_date: z.string().min(1, 'Start date is required'),
      end_date: z.string().optional(),
      description: z.string().optional(),
    })
  ),
});

const experienceSchema = z.object({
  experience: z.array(
    z.object({
      company: z.string().min(1, 'Company name is required'),
      position: z.string().min(1, 'Position is required'),
      start_date: z.string().min(1, 'Start date is required'),
      end_date: z.string().optional(),
      description: z.string().optional(),
    })
  ),
});

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill name is required'),
      level: z.number().min(1).max(5).optional(),
    })
  ),
});

const templateSchema = z.object({
  title: z.string().min(1, 'CV title is required'),
  template: z.string().min(1, 'Please select a template'),
});

// Combine all schemas for the final form
const cvFormSchema = z.object({
  personal_info: personalInfoSchema,
  ...educationSchema.shape,
  ...experienceSchema.shape,
  ...skillsSchema.shape,
  ...templateSchema.shape,
});

type CVFormValues = z.infer<typeof cvFormSchema>;

function CVFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!id;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
        website: '',
        linkedin: '',
        github: '',
      },
      education: [
        {
          institution: '',
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          description: '',
        },
      ],
      experience: [
        {
          company: '',
          position: '',
          start_date: '',
          end_date: '',
          description: '',
        },
      ],
      skills: [
        {
          name: '',
          level: 3,
        },
      ],
      title: '',
      template: 'modern',
    },
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = 
    useFieldArray({ control, name: 'education' });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = 
    useFieldArray({ control, name: 'experience' });
  
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = 
    useFieldArray({ control, name: 'skills' });

  // Fetch CV data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCV = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8000/cvs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          reset({
            personal_info: response.data.personal_info,
            education: response.data.education,
            experience: response.data.experience,
            skills: response.data.skills,
            title: response.data.title,
            template: response.data.template,
          });
        } catch (error) {
          console.error('Error fetching CV:', error);
          setError('Failed to load CV data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCV();
    }
  }, [id, isEditMode, reset]);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: CVFormValues) => {
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (isEditMode) {
        await axios.put(`http://localhost:8000/cvs/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:8000/cvs', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving CV:', error);
      setError('Failed to save your CV. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {isEditMode ? 'Edit Your CV' : 'Create Your CV'}
            </h1>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`h-2 w-10 rounded-full ${
                      stepNumber === step
                        ? 'bg-primary'
                        : stepNumber < step
                        ? 'bg-gray-400'
                        : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-gray-400">
                Step {step} of 5
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-error/20 border border-error/30 rounded-lg p-4 mb-6">
              <p className="text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 rounded-xl">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium mb-1.5">
                      Full Name*
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      className={`glass-input w-full ${
                        errors.personal_info?.full_name ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="John Doe"
                      {...register('personal_info.full_name')}
                    />
                    {errors.personal_info?.full_name && (
                      <p className="text-error text-sm mt-1">
                        {errors.personal_info.full_name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                      Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`glass-input w-full ${
                        errors.personal_info?.email ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="john.doe@example.com"
                      {...register('personal_info.email')}
                    />
                    {errors.personal_info?.email && (
                      <p className="text-error text-sm mt-1">
                        {errors.personal_info.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="glass-input w-full"
                      placeholder="+1 (123) 456-7890"
                      {...register('personal_info.phone')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1.5">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="glass-input w-full"
                      placeholder="City, Country"
                      {...register('personal_info.address')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-1.5">
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      className={`glass-input w-full ${
                        errors.personal_info?.website ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="https://yourwebsite.com"
                      {...register('personal_info.website')}
                    />
                    {errors.personal_info?.website && (
                      <p className="text-error text-sm mt-1">
                        {errors.personal_info.website.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium mb-1.5">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      className={`glass-input w-full ${
                        errors.personal_info?.linkedin ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="https://linkedin.com/in/yourusername"
                      {...register('personal_info.linkedin')}
                    />
                    {errors.personal_info?.linkedin && (
                      <p className="text-error text-sm mt-1">
                        {errors.personal_info.linkedin.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium mb-1.5">
                      GitHub
                    </label>
                    <input
                      id="github"
                      type="url"
                      className={`glass-input w-full ${
                        errors.personal_info?.github ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="https://github.com/yourusername"
                      {...register('personal_info.github')}
                    />
                    {errors.personal_info?.github && (
                      <p className="text-error text-sm mt-1">
                        {errors.personal_info.github.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium mb-1.5">
                    Professional Summary
                  </label>
                  <textarea
                    id="summary"
                    rows={4}
                    className="glass-input w-full"
                    placeholder="Write a brief summary of your professional background and key skills..."
                    {...register('personal_info.summary')}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                
                {educationFields.map((field, index) => (
                  <div key={field.id} className="mb-8 p-6 glass-panel rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                      {educationFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="btn-icon text-gray-400 hover:text-error"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`edu-institution-${index}`} className="block text-sm font-medium mb-1.5">
                          Institution*
                        </label>
                        <input
                          id={`edu-institution-${index}`}
                          type="text"
                          className={`glass-input w-full ${
                            errors.education?.[index]?.institution ? 'border-error' : 'border-gray-700'
                          }`}
                          placeholder="University of Example"
                          {...register(`education.${index}.institution`)}
                        />
                        {errors.education?.[index]?.institution && (
                          <p className="text-error text-sm mt-1">
                            {errors.education[index]?.institution?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`edu-degree-${index}`} className="block text-sm font-medium mb-1.5">
                          Degree*
                        </label>
                        <input
                          id={`edu-degree-${index}`}
                          type="text"
                          className={`glass-input w-full ${
                            errors.education?.[index]?.degree ? 'border-error' : 'border-gray-700'
                          }`}
                          placeholder="Bachelor of Science"
                          {...register(`education.${index}.degree`)}
                        />
                        {errors.education?.[index]?.degree && (
                          <p className="text-error text-sm mt-1">
                            {errors.education[index]?.degree?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`edu-field-${index}`} className="block text-sm font-medium mb-1.5">
                          Field of Study
                        </label>
                        <input
                          id={`edu-field-${index}`}
                          type="text"
                          className="glass-input w-full"
                          placeholder="Computer Science"
                          {...register(`education.${index}.field_of_study`)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={`edu-start-${index}`} className="block text-sm font-medium mb-1.5">
                            Start Date*
                          </label>
                          <input
                            id={`edu-start-${index}`}
                            type="text"
                            className={`glass-input w-full ${
                              errors.education?.[index]?.start_date ? 'border-error' : 'border-gray-700'
                            }`}
                            placeholder="MM/YYYY"
                            {...register(`education.${index}.start_date`)}
                          />
                          {errors.education?.[index]?.start_date && (
                            <p className="text-error text-sm mt-1">
                              {errors.education[index]?.start_date?.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`edu-end-${index}`} className="block text-sm font-medium mb-1.5">
                            End Date
                          </label>
                          <input
                            id={`edu-end-${index}`}
                            type="text"
                            className="glass-input w-full"
                            placeholder="MM/YYYY or Present"
                            {...register(`education.${index}.end_date`)}
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor={`edu-description-${index}`} className="block text-sm font-medium mb-1.5">
                          Description
                        </label>
                        <textarea
                          id={`edu-description-${index}`}
                          rows={3}
                          className="glass-input w-full"
                          placeholder="Describe your studies, achievements, etc."
                          {...register(`education.${index}.description`)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => 
                    appendEducation({
                      institution: '',
                      degree: '',
                      field_of_study: '',
                      start_date: '',
                      end_date: '',
                      description: '',
                    })
                  }
                  className="btn-outline flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Education
                </button>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
                
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="mb-8 p-6 glass-panel rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                      {experienceFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="btn-icon text-gray-400 hover:text-error"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor={`exp-company-${index}`} className="block text-sm font-medium mb-1.5">
                          Company*
                        </label>
                        <input
                          id={`exp-company-${index}`}
                          type="text"
                          className={`glass-input w-full ${
                            errors.experience?.[index]?.company ? 'border-error' : 'border-gray-700'
                          }`}
                          placeholder="Example Corporation"
                          {...register(`experience.${index}.company`)}
                        />
                        {errors.experience?.[index]?.company && (
                          <p className="text-error text-sm mt-1">
                            {errors.experience[index]?.company?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`exp-position-${index}`} className="block text-sm font-medium mb-1.5">
                          Position*
                        </label>
                        <input
                          id={`exp-position-${index}`}
                          type="text"
                          className={`glass-input w-full ${
                            errors.experience?.[index]?.position ? 'border-error' : 'border-gray-700'
                          }`}
                          placeholder="Senior Developer"
                          {...register(`experience.${index}.position`)}
                        />
                        {errors.experience?.[index]?.position && (
                          <p className="text-error text-sm mt-1">
                            {errors.experience[index]?.position?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={`exp-start-${index}`} className="block text-sm font-medium mb-1.5">
                            Start Date*
                          </label>
                          <input
                            id={`exp-start-${index}`}
                            type="text"
                            className={`glass-input w-full ${
                              errors.experience?.[index]?.start_date ? 'border-error' : 'border-gray-700'
                            }`}
                            placeholder="MM/YYYY"
                            {...register(`experience.${index}.start_date`)}
                          />
                          {errors.experience?.[index]?.start_date && (
                            <p className="text-error text-sm mt-1">
                              {errors.experience[index]?.start_date?.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`exp-end-${index}`} className="block text-sm font-medium mb-1.5">
                            End Date
                          </label>
                          <input
                            id={`exp-end-${index}`}
                            type="text"
                            className="glass-input w-full"
                            placeholder="MM/YYYY or Present"
                            {...register(`experience.${index}.end_date`)}
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor={`exp-description-${index}`} className="block text-sm font-medium mb-1.5">
                          Description
                        </label>
                        <textarea
                          id={`exp-description-${index}`}
                          rows={4}
                          className="glass-input w-full"
                          placeholder="Describe your responsibilities, achievements, etc."
                          {...register(`experience.${index}.description`)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => 
                    appendExperience({
                      company: '',
                      position: '',
                      start_date: '',
                      end_date: '',
                      description: '',
                    })
                  }
                  className="btn-outline flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Experience
                </button>
              </div>
            )}

            {/* Step 4: Skills */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                
                <div className="glass-panel p-6 rounded-lg mb-6">
                  <div className="space-y-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-4">
                        <div className="flex-grow">
                          <input
                            type="text"
                            className={`glass-input w-full ${
                              errors.skills?.[index]?.name ? 'border-error' : 'border-gray-700'
                            }`}
                            placeholder="Skill name"
                            {...register(`skills.${index}.name`)}
                          />
                          {errors.skills?.[index]?.name && (
                            <p className="text-error text-sm mt-1">
                              {errors.skills[index]?.name?.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="w-32">
                          <select
                            className="glass-input w-full"
                            {...register(`skills.${index}.level`, { valueAsNumber: true })}
                          >
                            <option value={1}>Beginner</option>
                            <option value={2}>Elementary</option>
                            <option value={3}>Intermediate</option>
                            <option value={4}>Advanced</option>
                            <option value={5}>Expert</option>
                          </select>
                        </div>
                        
                        {skillFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="btn-icon text-gray-400 hover:text-error flex-shrink-0"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => 
                        appendSkill({
                          name: '',
                          level: 3,
                        })
                      }
                      className="btn-outline flex items-center text-sm mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Template Selection */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">CV Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                      CV Title*
                    </label>
                    <input
                      id="title"
                      type="text"
                      className={`glass-input w-full ${
                        errors.title ? 'border-error' : 'border-gray-700'
                      }`}
                      placeholder="My Professional CV"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-error text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Select Template*
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['modern', 'classic', 'creative'].map((templateName) => (
                        <div key={templateName} className="relative">
                          <input
                            type="radio"
                            id={`template-${templateName}`}
                            value={templateName}
                            className="sr-only"
                            {...register('template')}
                          />
                          <label
                            htmlFor={`template-${templateName}`}
                            className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              watch('template') === templateName
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="aspect-[3/4] bg-gray-800 rounded mb-3 flex items-center justify-center">
                              {/* Template preview would go here */}
                              <span className="text-sm text-gray-400">Preview</span>
                            </div>
                            <p className="text-center capitalize font-medium">
                              {templateName}
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {errors.template && (
                      <p className="text-error text-sm mt-2">
                        {errors.template.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-outline flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditMode ? 'Update CV' : 'Create CV'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CVFormPage;