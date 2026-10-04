-- 0013_news_files_bucket.sql
-- Storage bucket for non-image news assets (currently: whitepaper PDFs).
-- Public read so the marketing site can deep-link to the file; writes
-- restricted to admins via storage RLS.

insert into storage.buckets (id, name, public)
values ('news-files', 'news-files', true)
on conflict (id) do nothing;

-- Allow anyone to read objects in news-files (public download links).
drop policy if exists "news_files_public_read" on storage.objects;
create policy "news_files_public_read"
  on storage.objects for select
  using (bucket_id = 'news-files');

-- Only admins may upload / overwrite / delete.
drop policy if exists "news_files_admin_write" on storage.objects;
create policy "news_files_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'news-files' and public.auth_is_admin());

drop policy if exists "news_files_admin_update" on storage.objects;
create policy "news_files_admin_update"
  on storage.objects for update
  using (bucket_id = 'news-files' and public.auth_is_admin())
  with check (bucket_id = 'news-files' and public.auth_is_admin());

drop policy if exists "news_files_admin_delete" on storage.objects;
create policy "news_files_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'news-files' and public.auth_is_admin());
