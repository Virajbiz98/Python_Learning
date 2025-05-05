import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import CVForm from '../../components/cv/CVForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EditCVPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    const fetchCV = async () => {
      if (!user || !id) return;
      
      try {
        // Fetch CV
        const { data: cv, error: cvError } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (cvError) throw cvError;
        
        // Fetch education
        const { data: education, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('cv_id', id);
        
        if (educationError) throw educationError;
        
        // Fetch experience
        const { data: experience, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .eq('cv_id', id);
        
        if (experienceError) throw experienceError;
        
        // Fetch skills
        const { data: skills, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('cv_id', id);
        
        if (skillsError) throw skillsError;
        
        // Transform data to match form structure
        const formattedData = {
          personalInfo: cv.personal_info || {},
          education: education.map((edu: any) => ({
            id: edu.id,
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            startDate: edu.start_date,
            endDate: edu.end_date,
            description: edu.description,
          })),
          experience: experience.map((exp: any) => ({
            id: exp.id,
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: exp.start_date,
            endDate: exp.end_date,
            current: exp.current,
            description: exp.description,
          })),
          skills: skills.map((skill: any) => ({
            id: skill.id,
            name: skill.name,
            level: skill.level,
          })),
          template: cv.template,
        };
        
        setCvData(formattedData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch CV');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCV();
  }, [id, user, supabase, navigate]);

  const handleSubmit = async (data: any) => {
    if (!user || !id) return;
    
    setSubmitting(true);
    try {
      // Update CV
      const { error: cvError } = await supabase
        .from('cvs')
        .update({
          personal_info: data.personalInfo,
          template: data.template,
        })
        .eq('id', id);
      
      if (cvError) throw cvError;
      
      // Handle education updates
      // This is a simplified approach - a real implementation would handle updates, deletions, and additions more carefully
      const { error: deleteEducationError } = await supabase
        .from('education')
        .delete()
        .eq('cv_id', id);
      
      if (deleteEducationError) throw deleteEducationError;
      
      if (data.education.length > 0) {
        const { error: educationError } = await supabase
          .from('education')
          .insert(
            data.education.map((edu: any) => ({
              cv_id: id,
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field,
              start_date: edu.startDate,
              end_date: edu.endDate,
              description: edu.description,
            }))
          );
        
        if (educationError) throw educationError;
      }
      
      // Handle experience updates
      const { error: deleteExperienceError } = await supabase
        .from('experience')
        .delete()
        .eq('cv_id', id);
      
      if (deleteExperienceError) throw deleteExperienceError;
      
      if (data.experience.length > 0) {
        const { error: experienceError } = await supabase
          .from('experience')
          .insert(
            data.experience.map((exp: any) => ({
              cv_id: id,
              company: exp.company,
              position: exp.position,
              location: exp.location,
              start_date: exp.startDate,
              end_date: exp.endDate,
              current: exp.current,
              description: exp.description,
            }))
          );
        
        if (experienceError) throw experienceError;
      }
      
      // Handle skills updates
      const { error: deleteSkillsError } = await supabase
        .from('skills')
        .delete()
        .eq('cv_id', id);
      
      if (deleteSkillsError) throw deleteSkillsError;
      
      if (data.skills.length > 0) {
        const { error: skillsError } = await supabase
          .from('skills')
          .insert(
            data.skills.map((skill: any) => ({
              cv_id: id,
              name: skill.name,
              level: skill.level,
            }))
          );
        
        if (skillsError) throw skillsError;
      }
      
      toast.success('CV updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update CV');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 green-glow-sm">Edit CV</h1>
      {cvData && (
        <CVForm 
          onSubmit={handleSubmit} 
          isSubmitting={submitting} 
          initialData={cvData}
        />
      )}
    </div>
  );
}