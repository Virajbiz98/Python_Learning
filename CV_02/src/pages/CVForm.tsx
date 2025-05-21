import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  PersonalInfo, Education, Experience, Skill, CV
} from '../types/database.types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PersonalInfoForm from '../components/cv/PersonalInfoForm';
import EducationForm from '../components/cv/EducationForm';
import ExperienceForm from '../components/cv/ExperienceForm';
import SkillsForm from '../components/cv/SkillsForm';
import TemplateSelection from '../components/cv/TemplateSelection';
import CVPreview from '../components/cv/CVPreview';
import { useSearchParams } from 'react-router-dom';
import { generatePdf } from '../lib/pdfGenerator';
import { JobAnalyzer } from '../components/cv/JobAnalyzer';

type FormStep = 'template' | 'personal' | 'education' | 'experience' | 'skills' | 'analyze' | 'review';

function CVForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('template');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // CV Data
  const [title, setTitle] = useState('My Professional CV');
  const [template, setTemplate] = useState('modern');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  });
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Load CV data if editing
  useEffect(() => {
    if (isEditing && user) {
      const fetchCV = async () => {
        try {
          const { data, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          if (!data) {
            toast.error('CV not found');
            navigate('/dashboard');
            return;
          }

          // Populate form with CV data
          setTitle(data.title);
          setTemplate(data.template);
          setPersonalInfo(data.personal_info as PersonalInfo);
          setEducation(data.education as Education[]);
          setExperience(data.experience as Experience[]);
          setSkills(data.skills as Skill[]);
        } catch (error) {
          console.error('Error fetching CV:', error);
          toast.error('Failed to load CV data');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };

      fetchCV();
    } else {
      setLoading(false);
    }
  }, [id, user, isEditing, navigate]);

  const steps: { name: FormStep; label: string }[] = [
    { name: 'template', label: 'Template' },
    { name: 'personal', label: 'Personal Info' },
    { name: 'education', label: 'Education' },
    { name: 'experience', label: 'Experience' },
    { name: 'skills', label: 'Skills' },
    { name: 'analyze', label: 'Analyze Job' },
    { name: 'review', label: 'Review' },
  ];

  const currentStepIndex = steps.findIndex(step => step.name === currentStep);

  // Validation functions for each step
  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 'personal') {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!personalInfo.title.trim()) newErrors.title = 'Professional Title is required';
      if (!personalInfo.email.trim()) newErrors.email = 'Email is invalid';
      else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = 'Email is invalid';
      if (!personalInfo.phone.trim()) newErrors.phone = 'Phone is required';
      if (!personalInfo.location.trim()) newErrors.location = 'Location is required';
      if (!personalInfo.summary.trim()) newErrors.summary = 'Summary is required';
    } else if (currentStep === 'education') {
      if (education.length === 0) newErrors.education = 'At least one education entry is required';
      else {
        education.forEach((edu, idx) => {
          if (!edu.institution.trim()) newErrors[`education_institution_${idx}`] = 'Institution is required';
          if (!edu.degree.trim()) newErrors[`education_degree_${idx}`] = 'Degree is required';
          if (!edu.field.trim()) newErrors[`education_field_${idx}`] = 'Field of study is required';
          if (!edu.startDate.trim()) newErrors[`education_startDate_${idx}`] = 'Start date is required';
          if (!edu.endDate.trim()) newErrors[`education_endDate_${idx}`] = 'End date is required';
        });
      }
    } else if (currentStep === 'experience') {
      if (experience.length === 0) newErrors.experience = 'At least one experience entry is required';
      else {
        experience.forEach((exp: Experience, idx: number) => {
          if (!exp.company.trim()) newErrors[`experience_company_${idx}`] = 'Company is required';
          if (!exp.position.trim()) newErrors[`experience_position_${idx}`] = 'Position is required';
          if (!exp.startDate.trim()) newErrors[`experience_startDate_${idx}`] = 'Start date is required';
          if (!exp.endDate.trim() && !exp.current) newErrors[`experience_endDate_${idx}`] = 'End date is required unless current';
        });
      }
    } else if (currentStep === 'skills') {
      if (skills.length === 0) newErrors.skills = 'At least one skill is required';
      else {
        skills.forEach((skill, idx) => {
          if (!skill.name.trim()) newErrors[`skill_name_${idx}`] = 'Skill name is required';
          if (skill.level < 1 || skill.level > 5) newErrors[`skill_level_${idx}`] = 'Skill level must be between 1 and 5';
        });
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, personalInfo, education, experience, skills]);

  const handleSaveAndDownload = async () => {
    if (!user) return;

    if (!validateStep()) {
      toast.error('Please fix errors before saving');
      return;
    }

    setSaving(true);
    let cvData: CV;
    try {
      const cvDataPayload = {
        title,
        template,
        personal_info: personalInfo,
        education,
        experience,
        skills,
        user_id: user.id,
      };

      if (isEditing && id) {
        const { data, error } = await supabase
          .from('cvs')
          .update(cvDataPayload)
          .eq('id', id);

        if (error) throw error;
        toast.success('CV updated successfully');

        const { data: fetchedCvData, error: fetchError } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!fetchedCvData) {
          toast.error('CV not found');
          navigate('/dashboard');
          return;
        }
        cvData = fetchedCvData as CV;
      } else {
        const { data: insertedCvData, error } = await supabase
          .from('cvs')
          .insert([cvDataPayload])
          .select('*')
          .single();

        if (error) throw error;
        cvData = insertedCvData as CV;
        toast.success('CV created successfully');
      }

      await generatePdf(cvData, personalInfo, education, experience, skills);

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestionsGenerated = useCallback((suggestions: any) => {
    // Update skills
    const newSkills = [
      ...skills,
      ...suggestions.skills.map((skill: string) => ({
        id: crypto.randomUUID(),
        name: skill,
        level: 3
      }))
    ];
    // Remove duplicates based on skill name
    setSkills(Array.from(new Map(newSkills.map(s => [s.name, s])).values()));

    // Update experience suggestions
    if (suggestions.experience && suggestions.experience.length > 0) {
      const newExperience = suggestions.experience.map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        startDate: '',
        endDate: '',
        current: false,
        description: exp.description,
        location: ''
      }));
      setExperience(prev => [...prev, ...newExperience]);
    }

    // Update education suggestions
    if (suggestions.education) {
      toast.success('AI suggestions applied successfully!');
    }
  }, [skills]);

  const handleAutoCreate = useCallback(async (suggestions: any) => {
    try {
      // Get user profile data
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (!userProfile) {
        toast.error('Please complete your profile first');
        return;
      }

      // Update CV data with user profile and AI suggestions
      setPersonalInfo({
        fullName: userProfile.full_name,
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        title: userProfile.professional_title || '',
        summary: userProfile.professional_summary || '',
        website: userProfile.website || '',
      });

      // Update education if it exists in profile
      if (userProfile.education) {
        setEducation(userProfile.education);
      }

      // Update experience with AI suggestions
      const enhancedExperience = userProfile.experience?.map((exp: any) => {
        const matchingSuggestion = suggestions.experience?.find(
          (s: any) => s.title.toLowerCase().includes(exp.title.toLowerCase())
        );
        return {
          ...exp,
          description: matchingSuggestion ? 
            [...exp.description, ...matchingSuggestion.relevantPoints] : 
            exp.description
        };
      }) || [];
      setExperience(enhancedExperience);

      // Merge existing skills with AI-suggested skills
      const existingSkills = userProfile.skills || [];
      const suggestedSkills = suggestions.keySkills?.map((skill: string) => ({
        id: crypto.randomUUID(),
        name: skill,
        level: 3
      })) || [];
      
      const allSkills = [...existingSkills, ...suggestedSkills];
      // Remove duplicates based on skill name
      setSkills(Array.from(new Map(allSkills.map(s => [s.name, s])).values()));

      setCurrentStep('review');
      toast.success('CV created with your profile data and AI suggestions!');
    } catch (error) {
      console.error('Error auto-creating CV:', error);
      toast.error('Failed to auto-create CV');
    }
  }, [user, setCurrentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'template':
        return (
          <TemplateSelection
            title={title}
            setTitle={setTitle}
            template={template}
            setTemplate={setTemplate}
            onAutoCreate={handleAutoCreate}
          />
        );
      case 'personal':
        return (
          <PersonalInfoForm
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        );
      case 'education':
        return (
          <EducationForm 
            education={education} 
            setEducation={setEducation} 
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            experience={experience} 
            setExperience={setExperience} 
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            skills={skills} 
            setSkills={setSkills} 
          />
        );
      case 'analyze':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">
              Analyze Job Description
            </h2>
            <JobAnalyzer onSuggestionsGenerated={handleSuggestionsGenerated} />
          </div>
        );
      case 'review':
        return (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSaveAndDownload}
              className="btn btn-primary flex items-center gap-2"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="sm" /> : <Download size={18} />}
              <span>{saving ? 'Saving...' : 'Save & Download'}</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    return (
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            const prevIndex = currentStepIndex - 1;
            if (prevIndex >= 0) {
              setCurrentStep(steps[prevIndex].name);
              window.scrollTo(0, 0);
            }
          }}
          className="btn btn-secondary"
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        {currentStep !== 'review' && (
          <button
            onClick={() => {
              if (currentStep === 'analyze' || validateStep()) {
                const nextIndex = currentStepIndex + 1;
                if (nextIndex < steps.length) {
                  setCurrentStep(steps[nextIndex].name);
                  window.scrollTo(0, 0);
                }
              } else {
                toast.error('Please fix errors before proceeding');
              }
            }}
            className="btn btn-primary"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          {isEditing ? 'Edit CV' : 'Create New CV'}
        </h1>
        <p className="text-gray-400">
          {isEditing
            ? 'Update your CV information'
            : 'Fill out the form to create your professional CV'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-400">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-dark-800 rounded-full">
          <div
            className="h-2 bg-primary-600 rounded-full animated-progress"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step navigation */}
        <div className="mt-4 grid grid-cols-7 gap-2">
          {steps.map((step, index) => (
            <button
              key={step.name}
              onClick={() => {
                if (currentStep === 'analyze' || validateStep()) {
                  setCurrentStep(step.name);
                  window.scrollTo(0, 0);
                } else {
                  toast.error('Please fix errors before proceeding');
                }
              }}
              disabled={index > currentStepIndex + 1}
              className={`text-xs px-1 py-2 rounded-md transition-colors ${
                index === currentStepIndex
                  ? 'bg-primary-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-dark-700 text-white'
                  : 'bg-dark-800 text-gray-400'
              } ${index > currentStepIndex + 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current step content */}
      {renderStep()}

      {/* Navigation buttons */}
      {renderNavigation()}
    </div>
  );
}

export default CVForm;
