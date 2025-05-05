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

type MinimalTemplateProps = {
  data: CVData;
  scale?: number;
};

export default function MinimalTemplate({ data, scale = 1 }: MinimalTemplateProps) {
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
        <header className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4 tracking-wide">{data.personalInfo.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{data.personalInfo.address}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin size={14} />
                <a href={data.personalInfo.linkedin} className="text-gray-600 hover:text-gray-900">
                  LinkedIn
                </a>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <a href={data.personalInfo.website} className="text-gray-600 hover:text-gray-900">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-6 text-center">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-[1fr_2fr] gap-6">
                  <div className="text-right">
                    <div className="text-gray-600 text-sm">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                    <div className="text-gray-900 font-medium">{exp.company}</div>
                    {exp.location && (
                      <div className="text-gray-600 text-sm">{exp.location}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{exp.position}</h3>
                    {exp.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-6 text-center">
              Education
            </h2>
            <div className="space-y-8">
              {data.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-[1fr_2fr] gap-6">
                  <div className="text-right">
                    <div className="text-gray-600 text-sm">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    <div className="text-gray-900 font-medium">{edu.institution}</div>
                    {edu.field && (
                      <div className="text-gray-600 text-sm">{edu.field}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{edu.degree}</h3>
                    {edu.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-light uppercase tracking-wider text-gray-900 mb-6 text-center">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {data.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-full px-4 py-1.5 text-sm"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}