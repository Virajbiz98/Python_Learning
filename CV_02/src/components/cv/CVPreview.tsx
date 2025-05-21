import React from 'react';
import { User } from 'lucide-react';
import { Education, Experience, PersonalInfo, Skill } from '../../types/database.types';

interface CVPreviewProps {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  template?: string;
}

const CVPreview: React.FC<CVPreviewProps> = ({ personalInfo, education, experience, skills, template = 'modern' }) => {
  const renderPhoto = () => {
    if (personalInfo.photoUrl) {
      return (
        <img
          src={personalInfo.photoUrl}
          alt={personalInfo.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />
      );
    }
    return (
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
        <User size={48} className="text-gray-400" />
      </div>
    );
  };

  return (
    <div className={`cv-preview ${template} bg-white text-gray-900 p-8 rounded-lg shadow-xl max-w-4xl mx-auto`}>
      {/* Header with photo */}
      <div className="flex items-center gap-8 mb-8 border-b pb-8">
        {renderPhoto()}
        <div>
          <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{personalInfo.title}</h2>
          <div className="text-gray-600 space-y-1">
            <p>{personalInfo.email}</p>
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.location}</p>
            {personalInfo.website && (
              <p>
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {personalInfo.website}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Professional Experience</h3>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-gray-800 font-medium">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{exp.startDate}</span>
                    <span> - </span>
                    <span>{exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{exp.location}</p>
                <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                  {Array.isArray(exp.description) 
                    ? exp.description.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))
                    : <li>{exp.description}</li>
                  }
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-800 font-medium">{edu.degree} in {edu.field}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{edu.startDate}</span>
                    <span> - </span>
                    <span>{edu.endDate}</span>
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Skills</h3>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <span className="text-gray-700">{skill.name}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;
