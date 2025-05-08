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
import { useSearchParams } from 'react-router-dom';
import { generatePdf } from '../lib/pdfGenerator';

type FormStep = 'template' | 'personal' | 'education' | 'experience' | 'skills' | 'review';

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

  const goToNextStep = () => {
    if (validateStep()) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].name);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error('Please fix errors before proceeding');
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].name);
      window.scrollTo(0, 0);
    }
  };

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
        <div className="mt-4 grid grid-cols-6 gap-2">
          {steps.map((step, index) => (
            <button
              key={step.name}
              onClick={() => setCurrentStep(step.name)}
              className={`text-xs px-1 py-2 rounded-md transition-colors ${
                index === currentStepIndex
                  ? 'bg-primary-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-dark-700 text-white'
                  : 'bg-dark-800 text-gray-400'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form steps */}
      <div className="glass-panel p-6 md:p-8">
        {currentStep === 'template' && (
          <TemplateSelection
            title={title}
            setTitle={setTitle}
            template={template}
            setTemplate={setTemplate}
          />
        )}

        {currentStep === 'personal' && (
          <PersonalInfoForm
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        )}

        {currentStep === 'education' && (
          <EducationForm 
            education={education} 
            setEducation={setEducation} 
          />
        )}

        {currentStep === 'experience' && (
          <ExperienceForm 
            experience={experience} 
            setExperience={setExperience} 
          />
        )}

        {currentStep === 'skills' && (
          <SkillsForm 
            skills={skills} 
            setSkills={setSkills} 
          />
        )}

        {currentStep === 'review' && (
            <div className="flex gap-4">
              <button
                onClick={handleSaveAndDownload}
                className="btn btn-primary flex items-center gap-2"
                disabled={saving}
              >
                  {saving ? <LoadingSpinner size="sm" /> : <Download size={18} />}
                  <span>{saving ? 'Saving...' : 'Save & Download'}</span>
                </button>
              </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t border-dark-700">
          <button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Previous</span>
          </button>
          
          {currentStep !== 'review' ? (
            <button
              onClick={goToNextStep}
              className="btn btn-primary flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CVForm;
