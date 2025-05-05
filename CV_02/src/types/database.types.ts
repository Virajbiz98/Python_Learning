export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
};

export type AdditionalInfo = {
  languages: { language: string; proficiency: string }[];
  certifications: { name: string; issuer: string; date: string }[];
  interests: string[];
  references: { name: string; company: string; position: string; contact: string }[];
};