import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from 'lucide-react';
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

type FormStep = 'template' | 'personal' | 'education' | 'experience' | 'skills' | 'review';

function CVForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('template');
  
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

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].name);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].name);
      window.scrollTo(0, 0);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const cvData = {
        title,
        template,
        personal_info: personalInfo,
        education,
        experience,
        skills,
        user_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('cvs')
          .update(cvData)
          .eq('id', id);

        if (error) throw error;
        toast.success('CV updated successfully');
      } else {
        const { error } = await supabase
          .from('cvs')
          .insert([cvData]);

        if (error) throw error;
        toast.success('CV created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} CV`);
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
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Review Your CV</h2>
            <p className="text-gray-400 mb-6">
              Review your information before saving your CV.
            </p>
            
            <div className="space-y-8">
              {/* Template & Title */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">CV Details</h3>
                <div className="bg-dark-800 p-4 rounded-md">
                  <p><span className="text-gray-400">Title:</span> {title}</p>
                  <p><span className="text-gray-400">Template:</span> {template}</p>
                </div>
              </div>
              
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <div className="bg-dark-800 p-4 rounded-md">
                  <p><span className="text-gray-400">Name:</span> {personalInfo.fullName}</p>
                  <p><span className="text-gray-400">Title:</span> {personalInfo.title}</p>
                  <p><span className="text-gray-400">Email:</span> {personalInfo.email}</p>
                  <p><span className="text-gray-400">Phone:</span> {personalInfo.phone}</p>
                  <p><span className="text-gray-400">Location:</span> {personalInfo.location}</p>
                  <p className="mt-2"><span className="text-gray-400">Summary:</span></p>
                  <p className="text-sm">{personalInfo.summary}</p>
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Education</h3>
                {education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={edu.id} className="bg-dark-800 p-4 rounded-md">
                        <p className="font-medium text-white">{edu.institution}</p>
                        <p>{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-400">
                          {edu.startDate} - {edu.endDate}
                        </p>
                        <p className="text-sm mt-2">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No education entries added</p>
                )}
              </div>
              
              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
                {experience.length > 0 ? (
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="bg-dark-800 p-4 rounded-md">
                        <p className="font-medium text-white">{exp.company}</p>
                        <p>{exp.position}</p>
                        <p className="text-sm text-gray-400">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p className="text-sm text-gray-400">{exp.location}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No experience entries added</p>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
                {skills.length > 0 ? (
                  <div className="bg-dark-800 p-4 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <div key={skill.id} className="bg-dark-700 px-3 py-1 rounded-full text-sm">
                          {skill.name} 
                          <span className="ml-1 text-gray-400">
                            ({skill.level}/5)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No skills added</p>
                )}
              </div>
            </div>
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
          
          {currentStep === 'review' ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary flex items-center gap-2"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Check size={18} />
                  <span>{isEditing ? 'Update CV' : 'Save CV'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goToNextStep}
              className="btn btn-primary flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CVForm;