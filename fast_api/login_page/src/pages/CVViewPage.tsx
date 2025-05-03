import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Download, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface CV {
  id: string;
  title: string;
  template: string;
  personal_info: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    summary?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    level?: number;
  }>;
}

function CVViewPage() {
  const { id } = useParams<{ id: string }>();
  const [cv, setCv] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchCV = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/cvs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCv(response.data);
      } catch (error) {
        console.error('Error fetching CV:', error);
        setError('Failed to load CV data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // This would be implemented to call the backend PDF generation endpoint
      alert('PDF generation would be implemented in a production version.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again later.');
    } finally {
      setIsGeneratingPDF(false);
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

  if (error || !cv) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container max-w-4xl">
            <div className="glass-panel p-8 text-center">
              <AlertCircle className="h-16 w-16 text-error mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Error Loading CV</h2>
              <p className="text-gray-400 mb-6">{error || 'CV not found'}</p>
              <div className="flex justify-center space-x-4">
                <Link to="/dashboard" className="btn-outline">
                  Back to Dashboard
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-400 hover:text-primary mb-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">{cv.title}</h1>
              <p className="text-gray-400">
                Template: <span className="capitalize">{cv.template}</span>
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Link 
                to={`/edit-cv/${cv.id}`} 
                className="btn-outline flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button 
                onClick={handleDownloadPDF} 
                className="btn-primary flex items-center"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download PDF
              </button>
            </div>
          </div>

          {/* CV Preview based on template */}
          <div className="glass-panel p-8 rounded-xl">
            {cv.template === 'modern' && (
              <div className="bg-white text-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="border-l-4 border-primary pl-4 mb-6">
                  <h2 className="text-3xl font-bold">{cv.personal_info.full_name}</h2>
                  {cv.personal_info.summary && (
                    <p className="text-gray-600 mt-2">{cv.personal_info.summary}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">EMAIL</p>
                    <p>{cv.personal_info.email}</p>
                  </div>
                  {cv.personal_info.phone && (
                    <div>
                      <p className="font-semibold text-sm text-gray-600">PHONE</p>
                      <p>{cv.personal_info.phone}</p>
                    </div>
                  )}
                  {cv.personal_info.address && (
                    <div>
                      <p className="font-semibold text-sm text-gray-600">LOCATION</p>
                      <p>{cv.personal_info.address}</p>
                    </div>
                  )}
                </div>
                
                {cv.experience.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
                      Experience
                    </h3>
                    <div className="space-y-6">
                      {cv.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex flex-col md:flex-row md:justify-between mb-1">
                            <h4 className="font-bold">{exp.position}</h4>
                            <p className="text-gray-600 text-sm">
                              {exp.start_date} - {exp.end_date || 'Present'}
                            </p>
                          </div>
                          <p className="text-primary font-medium mb-2">{exp.company}</p>
                          {exp.description && (
                            <p className="text-gray-700">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cv.education.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
                      Education
                    </h3>
                    <div className="space-y-6">
                      {cv.education.map((edu, index) => (
                        <div key={index}>
                          <div className="flex flex-col md:flex-row md:justify-between mb-1">
                            <h4 className="font-bold">{edu.degree}</h4>
                            <p className="text-gray-600 text-sm">
                              {edu.start_date} - {edu.end_date || 'Present'}
                            </p>
                          </div>
                          <p className="text-primary font-medium mb-1">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-gray-700 mb-2">{edu.field_of_study}</p>
                          )}
                          {edu.description && (
                            <p className="text-gray-700">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cv.skills.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-100 rounded-full px-3 py-1 text-gray-700"
                        >
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {cv.template === 'classic' && (
              <div className="bg-white text-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">
                    {cv.personal_info.full_name}
                  </h2>
                  <div className="flex justify-center space-x-4 text-gray-600">
                    <p>{cv.personal_info.email}</p>
                    {cv.personal_info.phone && (
                      <>
                        <span>•</span>
                        <p>{cv.personal_info.phone}</p>
                      </>
                    )}
                    {cv.personal_info.address && (
                      <>
                        <span>•</span>
                        <p>{cv.personal_info.address}</p>
                      </>
                    )}
                  </div>
                </div>
                
                {cv.personal_info.summary && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-3">
                      Professional Summary
                    </h3>
                    <p className="text-gray-700">{cv.personal_info.summary}</p>
                  </div>
                )}
                
                {cv.experience.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-3">
                      Experience
                    </h3>
                    <div className="space-y-6">
                      {cv.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold">{exp.position}</h4>
                            <p className="text-gray-600">
                              {exp.start_date} - {exp.end_date || 'Present'}
                            </p>
                          </div>
                          <p className="italic mb-2">{exp.company}</p>
                          {exp.description && (
                            <p className="text-gray-700">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cv.education.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-3">
                      Education
                    </h3>
                    <div className="space-y-6">
                      {cv.education.map((edu, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold">{edu.degree}</h4>
                            <p className="text-gray-600">
                              {edu.start_date} - {edu.end_date || 'Present'}
                            </p>
                          </div>
                          <p className="italic mb-1">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-gray-700 mb-2">{edu.field_of_study}</p>
                          )}
                          {edu.description && (
                            <p className="text-gray-700">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cv.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-3">
                      Skills
                    </h3>
                    <ul className="list-disc list-inside columns-2">
                      {cv.skills.map((skill, index) => (
                        <li key={index} className="mb-1">
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {cv.template === 'creative' && (
              <div className="bg-white text-gray-900 rounded-lg p-0 max-w-2xl mx-auto overflow-hidden">
                <div className="bg-primary text-white p-8">
                  <h2 className="text-3xl font-bold mb-2">{cv.personal_info.full_name}</h2>
                  {cv.personal_info.summary && (
                    <p className="text-white/90 mb-6">{cv.personal_info.summary}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">Email:</span>
                      <span>{cv.personal_info.email}</span>
                    </div>
                    {cv.personal_info.phone && (
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Phone:</span>
                        <span>{cv.personal_info.phone}</span>
                      </div>
                    )}
                    {cv.personal_info.address && (
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Location:</span>
                        <span>{cv.personal_info.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                      {cv.experience.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-4">
                            Experience
                          </h3>
                          <div className="space-y-6">
                            {cv.experience.map((exp, index) => (
                              <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-primary">
                                <div className="absolute w-3 h-3 bg-primary rounded-full left-[-6px] top-1"></div>
                                <h4 className="font-bold">{exp.position}</h4>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <p className="text-gray-600 text-sm mb-2">
                                  {exp.start_date} - {exp.end_date || 'Present'}
                                </p>
                                {exp.description && (
                                  <p className="text-gray-700">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {cv.education.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-4">
                            Education
                          </h3>
                          <div className="space-y-6">
                            {cv.education.map((edu, index) => (
                              <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-primary">
                                <div className="absolute w-3 h-3 bg-primary rounded-full left-[-6px] top-1"></div>
                                <h4 className="font-bold">{edu.degree}</h4>
                                <p className="text-primary font-medium">{edu.institution}</p>
                                <p className="text-gray-600 text-sm mb-2">
                                  {edu.start_date} - {edu.end_date || 'Present'}
                                </p>
                                {edu.field_of_study && (
                                  <p className="text-gray-700 mb-1">{edu.field_of_study}</p>
                                )}
                                {edu.description && (
                                  <p className="text-gray-700">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-8">
                      {cv.skills.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-4">
                            Skills
                          </h3>
                          <div className="space-y-2">
                            {cv.skills.map((skill, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{skill.name}</p>
                                  {skill.level && (
                                    <p className="text-sm">{skill.level}/5</p>
                                  )}
                                </div>
                                {skill.level && (
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-primary h-1.5 rounded-full" 
                                      style={{ width: `${(skill.level / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-4">
                          Contact
                        </h3>
                        <div className="space-y-2">
                          <p className="font-medium">{cv.personal_info.email}</p>
                          {cv.personal_info.phone && (
                            <p>{cv.personal_info.phone}</p>
                          )}
                          {cv.personal_info.website && (
                            <p>{cv.personal_info.website}</p>
                          )}
                          {cv.personal_info.linkedin && (
                            <p>{cv.personal_info.linkedin}</p>
                          )}
                          {cv.personal_info.github && (
                            <p>{cv.personal_info.github}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CVViewPage;