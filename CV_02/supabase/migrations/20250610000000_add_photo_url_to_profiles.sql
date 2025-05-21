-- Add photoUrl column to user_profiles table

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('profile-photos', 'profile-photos')
ON CONFLICT DO NOTHING;

-- Set up storage policies for the profile-photos bucket
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Update types in the database to include photo_url
DO $$ BEGIN
  CREATE TYPE public.user_profile_with_photo AS (
    id uuid,
    user_id uuid,
    full_name text,
    professional_title text,
    professional_summary text,
    email text,
    phone text,
    location text,
    website text,
    photo_url text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
