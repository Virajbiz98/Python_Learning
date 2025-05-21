export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  professional_title?: string;
  professional_summary?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  website?: string;
  photoUrl?: string;
}

export interface CV {
  id: string;
  user_id: string;
  title: string;
  template: string;
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      cvs: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          template: string;
          personal_info: Json;
          education: Json[];
          experience: Json[];
          skills: Json[];
          additional_info: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          template: string;
          personal_info: Json;
          education: Json[];
          experience: Json[];
          skills: Json[];
          additional_info?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          template?: string;
          personal_info?: Json;
          education?: Json[];
          experience?: Json[];
          skills?: Json[];
          additional_info?: Json | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type CV = Database['public']['Tables']['cvs']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  linkedIn?: string;
  website?: string;
  photoUrl?: string;
};

export interface BaseEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Education extends BaseEducation {
  id: string;
}

export interface BaseExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Experience extends BaseExperience {
  id: string;
}

export interface BaseSkill {
  name: string;
  level: number;
}

export interface Skill extends BaseSkill {
  id: string;
}

export type AdditionalInfo = {
  languages: { language: string; proficiency: string }[];
  certifications: { name: string; issuer: string; date: string }[];
  interests: string[];
  references: { name: string; company: string; position: string; contact: string }[];
};