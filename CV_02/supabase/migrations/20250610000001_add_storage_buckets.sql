-- Create storage bucket for profile photos
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true);

-- Set up storage policy to allow authenticated users to upload their own photos
create policy "Allow authenticated users to upload their own photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'profile-photos' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set up storage policy to allow authenticated users to delete their own photos
create policy "Allow authenticated users to delete their own photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set up storage policy to allow public access to profile photos
create policy "Allow public access to profile photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'profile-photos');