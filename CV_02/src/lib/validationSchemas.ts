import { z } from 'zod';

// Helper function for date validation
function validateYear(value: string): boolean {
  const [, year] = value.split('/');
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear + 10;
}

// Personal info validation schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  title: z.string().min(1, 'Professional title is required'),
  summary: z.string().min(1, 'Professional summary is required').max(500, 'Summary must be less than 500 characters'),
  website: z.string().url('Please enter a valid URL').optional(),
  linkedIn: z.string().url('Please enter a valid URL').optional(),
  photoUrl: z.string().optional(),
});

// Education entry validation schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in MM/YYYY format')
    .refine(validateYear, { message: 'Year must be between 1900 and current year + 10' }),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$|^Present$/, 'Date must be in MM/YYYY format or "Present"')
    .refine(value => value === 'Present' || validateYear(value), 
      { message: 'Year must be between 1900 and current year + 10, or "Present"' }),
  description: z.string().optional(),
});

// Experience entry validation schema
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in MM/YYYY format'),
  endDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$|^Present$/, 'Date must be in MM/YYYY format or "Present"')
    .optional(),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
});  // Skill validation schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.number().min(1).max(5, 'Skill level must be between 1 and 5'),
});



// Profile form validation schema
export const profileFormSchema = z.object({
  personal_info: personalInfoSchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema),
});
