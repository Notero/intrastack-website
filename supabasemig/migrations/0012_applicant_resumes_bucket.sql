-- 0019_applicant_resumes_bucket.sql
-- Storage bucket for applicant resume uploads.
--
-- Path convention: resumes/{auth.uid()}/{filename}
-- Each applicant owns a folder keyed by their auth user id (not profile id —
-- they are the same uuid, but referencing auth.uid() directly means the path
-- is stable even if the profiles row is recreated).
--
-- uploaded_at is tracked via storage.objects.created_at (set by Supabase on
-- every insert). An updated_at column does not exist on storage.objects, so
-- we treat a re-upload as a new object insert at the same path; Supabase
-- upserts the row and refreshes created_at automatically.
--
-- The bucket is private — no public read — because resumes are sensitive.
-- Applicants download their own file via a signed URL generated server-side.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,                    -- private bucket; no anonymous download
  5242880,                  -- 5 MB per file
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- ─── Storage RLS ────────────────────────────────────────────────────────────
-- Supabase storage RLS targets storage.objects.
-- The path check (storage.foldername) ensures every user can only touch
-- objects inside their own {auth.uid()} folder.

-- Applicant can upload / overwrite their own resume
drop policy if exists "resumes_insert_own" on storage.objects;
create policy "resumes_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Applicant can read their own resume; admin can read any
drop policy if exists "resumes_select_own_or_admin" on storage.objects;
create policy "resumes_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.auth_is_admin()
    )
  );

-- Applicant can delete (replace) their own resume; admin can delete any
drop policy if exists "resumes_delete_own_or_admin" on storage.objects;
create policy "resumes_delete_own_or_admin"
  on storage.objects for delete
  using (
    bucket_id = 'resumes'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.auth_is_admin()
    )
  );

-- Applicant can update (overwrite) their own resume metadata
drop policy if exists "resumes_update_own_or_admin" on storage.objects;
create policy "resumes_update_own_or_admin"
  on storage.objects for update
  using (
    bucket_id = 'resumes'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.auth_is_admin()
    )
  )
  with check (
    bucket_id = 'resumes'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.auth_is_admin()
    )
  );
