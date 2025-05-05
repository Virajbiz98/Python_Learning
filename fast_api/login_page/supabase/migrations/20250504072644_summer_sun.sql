/*
  # ShimmerCV Database Schema

  1. Tables
    - `profiles` - User profile information
    - `cvs` - CV documents
    - `education` - Education entries for CVs
    - `experience` - Work experience entries for CVs
    - `skills` - Skills entries for CVs

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  personal_info JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID REFERENCES cvs ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID REFERENCES cvs ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID REFERENCES cvs ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create profile update function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profile trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create update timestamps function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_experience_updated_at
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Set up RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- CVs policies
CREATE POLICY "Users can view own CVs"
  ON cvs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CVs"
  ON cvs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs"
  ON cvs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs"
  ON cvs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Education policies
CREATE POLICY "Users can view own education entries"
  ON education FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = education.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own education entries"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = education.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own education entries"
  ON education FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = education.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own education entries"
  ON education FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = education.cv_id
    AND cvs.user_id = auth.uid()
  ));

-- Experience policies
CREATE POLICY "Users can view own experience entries"
  ON experience FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = experience.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own experience entries"
  ON experience FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = experience.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own experience entries"
  ON experience FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = experience.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own experience entries"
  ON experience FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = experience.cv_id
    AND cvs.user_id = auth.uid()
  ));

-- Skills policies
CREATE POLICY "Users can view own skills entries"
  ON skills FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = skills.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own skills entries"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = skills.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own skills entries"
  ON skills FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = skills.cv_id
    AND cvs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own skills entries"
  ON skills FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cvs
    WHERE cvs.id = skills.cv_id
    AND cvs.user_id = auth.uid()
  ));