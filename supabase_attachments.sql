-- 1. Create the Storage Bucket for Project Files
-- We use a public bucket for easier access, but you can make it private if you strictly use signed URLs.
-- Given the form is public, public read is usually fine for "portfolio" type assets, but be careful with sensitive data.
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

-- 2. Storage Policies (RLS)
-- Allow anyone (public/anon) to upload files to this bucket.
-- "gl" is for "Guest/Public" logic usually.
create policy "Public can upload project files"
on storage.objects for insert
with check ( bucket_id = 'project-files' );

-- Allow anyone to view files (if public bucket isn't enough or for explictness)
create policy "Public can view project files"
on storage.objects for select
using ( bucket_id = 'project-files' );

-- Optional: Restrict deletions to service_role (admin) only to prevent users deleting others' files.
-- No delete policy needed for public if we don't want them to delete.

-- 3. Database Schema Changes
-- Add the JSONB column to store file metadata (Name, Size, URL, Type)
alter table project_leads 
add column if not exists attachments jsonb default '[]'::jsonb;

-- 4. Secure Database Policy for Attachments (if not already covered)
-- Ensure the insert policy for project_leads allows the new column. 
-- Usually "check (true)" covers all columns, but good to verify.
