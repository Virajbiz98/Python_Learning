import React from 'react';

import { Skill } from '../../types/database.types';

interface CVPreviewProps {
  personalInfo: any;
  education: any[];
  experience: any[];
  skills: Skill[];
}

const CVPreview: React.FC<CVPreviewProps> = ({ personalInfo, education, experience, skills }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">CV Preview</h2>
      <h3 className="text-md font-semibold mb-1">Personal Information</h3>
      <p>Name: {personalInfo?.name}</p>
      <p>Email: {personalInfo?.email}</p>
      <p>Phone: {personalInfo?.phone}</p>
      <p>Address: {personalInfo?.address}</p>

      <h3 className="text-md font-semibold mt-2 mb-1">Education</h3>
      {education?.map((edu, index) => (
        <div key={index}>
          <p>School: {edu.school}</p>
          <p>Degree: {edu.degree}</p>
          <p>Years: {edu.startYear} - {edu.endYear}</p>
        </div>
      ))}

      <h3 className="text-md font-semibold mt-2 mb-1">Experience</h3>
      {experience?.map((exp, index) => (
        <div key={index}>
          <p>Title: {exp.title}</p>
          <p>Company: {exp.company}</p>
          <p>Years: {exp.startYear} - {exp.endYear}</p>
        </div>
      ))}

      <h3 className="text-md font-semibold mt-2 mb-1">Skills</h3>
      <ul>
        {skills?.map((skill, index) => (
          <li key={index}>{skill.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CVPreview;
