import jsPDF from 'jspdf';
import { PersonalInfo, Education, Experience, Skill, CV } from '../types/database.types';

export const generatePdf = async (cvData: CV, personalInfo: PersonalInfo, education: Education[], experience: Experience[], skills: Skill[]) => {
  const { title, template } = cvData;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;
  const leftMargin = 15;

  const addText = (text: string | string[], x: number, yPos: number, fontSize: number, lineHeight = 7) => {
    doc.setFontSize(fontSize);
    if (Array.isArray(text)) {
      text.forEach(line => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 10;
        }
        doc.text(line, x, yPos);
        yPos += lineHeight;
      });
    } else {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 10;
      }
      doc.text(text, x, yPos);
      yPos += lineHeight;
    }
    return yPos;
  };

  y = addText(title, leftMargin, y, 18, 10);

  y = addText('Personal Information', leftMargin, y, 14, 8);

  y = addText(`Name: ${personalInfo.fullName}`, leftMargin, y, 12);
  y = addText(`Title: ${personalInfo.title}`, leftMargin, y, 12);
  y = addText(`Email: ${personalInfo.email}`, leftMargin, y, 12);
  y = addText(`Phone: ${personalInfo.phone}`, leftMargin, y, 12);
  y = addText(`Location: ${personalInfo.location}`, leftMargin, y, 12);
  y = addText('Summary:', leftMargin, y, 12);
  y = addText(doc.splitTextToSize(personalInfo.summary, pageWidth - 2 * leftMargin), leftMargin, y, 12, 7);

  if (education.length > 0) {
    y = addText('Education', leftMargin, y, 14, 8);
    education.forEach((edu) => {
      y = addText(`${edu.degree} in ${edu.field}`, leftMargin, y, 12);
      y = addText(`${edu.institution} (${edu.startDate} - ${edu.endDate})`, leftMargin, y, 12, 10);
    });
  }

  if (experience.length > 0) {
    y = addText('Experience', leftMargin, y, 14, 8);
    experience.forEach((exp: Experience, idx: number) => {
      y = addText(`${exp.position} at ${exp.company}`, leftMargin, y, 12);
      y = addText(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, leftMargin, y, 12, 10);
    });
  }

  if (skills.length > 0) {
    y = addText('Skills', leftMargin, y, 14, 8);
    const skillsText = skills.map(skill => `${skill.name} (${skill.level}/5)`).join(', ');
    y = addText(skillsText, leftMargin, y, 12, 10);
  }

  doc.save(`${title}.pdf`);
};
