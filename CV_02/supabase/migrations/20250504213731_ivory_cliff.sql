/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add RLS policy to allow users to create their own profile during registration
    - Policy ensures users can only create a profile with their own user ID
*/

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);