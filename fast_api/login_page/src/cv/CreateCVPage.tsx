import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import CVForm from '../../components/cv/CVForm';

// CV data structure
type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Skill = {
  id: string;
  name: string;
  level: number; // 1-5
};

type CVData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  template: string;
};

export default function CreateCVPage() {
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CVData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Insert CV
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .insert({
          user_id: user.id,
          title: data.personalInfo.fullName + "'s CV",
          template: data.template,
          personal_info: data.personalInfo,
        })
        .select()
        .single();

      if (cvError) throw cvError;
      
      const cvId = cvData.id;

      // Insert education entries
      if (data.education.length > 0) {
        const { error: educationError } = await supabase
          .from('education')
          .insert(
            data.education.map(edu => ({
              cv_id: cvId,
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field,
              start_date: edu.startDate,
              end_date: edu.endDate,
              description: edu.description
            }))
          );
        
        if (educationError) throw educationError;
      }

      // Insert experience entries
      if (data.experience.length > 0) {
        const { error: experienceError } = await supabase
          .from('experience')
          .insert(
            data.experience.map(exp => ({
              cv_id: cvId,
              company: exp.company,
              position: exp.position,
              location: exp.location,
              start_date: exp.startDate,
              end_date: exp.endDate,
              current: exp.current,
              description: exp.description
            }))
          );
        
        if (experienceError) throw experienceError;
      }

      // Insert skills
      if (data.skills.length > 0) {
        const { error: skillsError } = await supabase
          .from('skills')
          .insert(
            data.skills.map(skill => ({
              cv_id: cvId,
              name: skill.name,
              level: skill.level
            }))
          );
        
        if (skillsError) throw skillsError;
      }

      toast.success('CV created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 green-glow-sm">Create a New CV</h1>
        <CVForm onSubmit={handleSubmit} isSubmitting={loading} />
      </motion.div>
    </div>
  );
}