import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

type CVData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  education: {
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
};

type ModernTemplateProps = {
  data: CVData;
  scale?: number;
};

export default function ModernTemplate({ data, scale = 1 }: ModernTemplateProps) {
  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      className="bg-white text-gray-900 w-[210mm] min-h-[297mm] shadow-xl mx-auto"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-12">
        {/* Header */}
        <header className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-4xl font-bold mb-3">{data.personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{data.personalInfo.address}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin size={16} />
                <a href={data.personalInfo.linkedin} className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe size={16} />
                <a href={data.personalInfo.website} className="text-blue-600 hover:underline">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <span className="text-gray-600 text-sm">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">
                    {exp.company}
                    {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg">{edu.degree}</h3>
                    <span className="text-gray-600 text-sm">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">
                    {edu.institution}
                    {edu.field && <span className="text-gray-500"> • {edu.field}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 rounded-full px-4 py-2 text-sm flex items-center gap-2"
                >
                  <span>{skill.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          i < skill.level ? 'bg-primary-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}