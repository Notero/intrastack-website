-- 0027_representation_onboarding.sql
-- Private representation_agreements storage bucket for the RTR
-- (Right-to-Represent) e-signature flow. The profiles.signed_for_representation
-- flag this flow sets lives in 0007_profiles.sql, alongside the table.

-- ── 1. Storage bucket ────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'representation_agreements',
  'representation_agreements',
  false,
  10485760,   -- 10 MB
  array['application/json', 'image/png']
)
on conflict (id) do nothing;

-- ── 2. RLS ───────────────────────────────────────────────────────────────────

-- Owner or admin can read their agreement files
drop policy if exists "rep_agreements_select" on storage.objects;
create policy "rep_agreements_select"
  on storage.objects for select
  using (
    bucket_id = 'representation_agreements'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.auth_is_admin()
    )
  );

-- Owner can insert (admin client is used in practice for server-side uploads)
drop policy if exists "rep_agreements_insert" on storage.objects;
create policy "rep_agreements_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'representation_agreements'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
