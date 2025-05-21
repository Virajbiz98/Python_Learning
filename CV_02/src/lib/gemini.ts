import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserProfile } from '../types/database.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface CVSuggestion {
  keySkills: string[];
  qualifications: string[];
  responsibilities: string[];
  experience: {
    title: string;
    company: string;
    description: string[];
    relevantPoints: string[];
  }[];
  education: {
    degree: string;
    field: string;
    suggestions: string[];
  };
  strengthsAnalysis: {
    matches: string[];
    gaps: string[];
    recommendations: string[];
  };
}

export async function generateCVSuggestions(
  jobDescription: string,
  userProfile?: UserProfile
): Promise<CVSuggestion> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const userBackground = userProfile ? `
    Candidate Background:
    - Name: ${userProfile.full_name}
    - Title: ${userProfile.professional_title}
    - Summary: ${userProfile.summary}
    - Skills: ${userProfile.skills.map(s => s.name).join(', ')}
    - Experience: ${userProfile.experience.map(e => 
      `${e.title} at ${e.company} (${e.description.join(', ')})`
    ).join('; ')}
    - Education: ${userProfile.education.map(e => 
      `${e.degree} in ${e.field} from ${e.institution}`
    ).join('; ')}
  ` : '';

  const prompt = `
    As an expert recruiter and CV writer, analyze this job description in detail:
    ${jobDescription}

    ${userBackground ? `Consider this candidate's background: ${userBackground}` : ''}

    Provide a comprehensive analysis with the following components:
    1. Key Skills: Extract all required technical and soft skills
    2. Qualifications: List educational and certification requirements
    3. Core Responsibilities: Identify main job duties and expectations
    4. Experience Suggestions: Create role-specific experience points that would impress recruiters
    5. Strengths Analysis: If a background is provided, analyze:
       - Strong matches between requirements and background
       - Potential gaps or areas for improvement
       - Recommendations for highlighting relevant experience
    
    Format your response as a JSON object with the following structure:
    {
      "keySkills": ["skill1", "skill2"],
      "qualifications": ["qual1", "qual2"],
      "responsibilities": ["resp1", "resp2"],
      "experience": [{
        "title": "Suggested Title",
        "company": "Type of Company",
        "description": ["point1", "point2"],
        "relevantPoints": ["why this matches job requirements"]
      }],
      "education": {
        "degree": "required/preferred degree",
        "field": "field of study",
        "suggestions": ["educational emphasis points"]
      },
      "strengthsAnalysis": {
        "matches": ["strong match points"],
        "gaps": ["areas to improve"],
        "recommendations": ["how to present experience effectively"]
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as CVSuggestion;
  } catch (error) {
    console.error('Error generating CV suggestions:', error);
    throw new Error('Failed to generate CV suggestions');
  }
}
