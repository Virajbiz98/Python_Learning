import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CVPreview from '../../components/cv/CVPreview';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function PreviewCVPage() {
  const { id } = useParams<{ id: string }>();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cvData, setCvData] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

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
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('cv_id', id)
          .order('start_date', { ascending: false });
        
        if (educationError) throw educationError;
        
        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .eq('cv_id', id)
          .order('start_date', { ascending: false });
        
        if (experienceError) throw experienceError;
        
        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('cv_id', id)
          .order('name', { ascending: true });
        
        if (skillsError) throw skillsError;
        
        setCvData(cv);
        setEducation(educationData || []);
        setExperience(experienceData || []);
        setSkills(skillsData || []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch CV');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCV();
  }, [id, user, supabase]);

  const exportToPdf = async () => {
    try {
      const cvElement = document.querySelector('.cv-preview-template');
      if (!cvElement) return;

      const canvas = await html2canvas(cvElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);

      toast.success('CV exported successfully');
    } catch (error) {
      toast.error('Failed to export CV');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formattedData = {
    personalInfo: cvData.personal_info,
    education: education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.start_date,
      endDate: edu.end_date,
      description: edu.description,
    })),
    experience: experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.start_date,
      endDate: exp.end_date,
      current: exp.current,
      description: exp.description,
    })),
    skills: skills.map(skill => ({
      name: skill.name,
      level: skill.level,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link to="/dashboard" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors mb-2">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold green-glow-sm">{cvData.title}</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/edit-cv/${id}`} className="btn-outline">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={exportToPdf} className="btn-primary">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <CVPreview 
        data={formattedData}
        template={cvData.template || 'modern'}
      />
    </div>
  );
}