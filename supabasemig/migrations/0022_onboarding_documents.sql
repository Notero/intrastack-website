-- 0032_onboarding_documents.sql
-- Documents uploaded by customers during applicant onboarding
-- (e.g. Offer Letter, NDA). Linked to a specific application.
--
-- Round trip: customer uploads -> applicant signs and reuploads ->
-- customer accepts/rejects (reject is not final and can be retried). Once
-- every required = true row for an application is accepted, the applicant's
-- profile is attached to that customer (profiles.employer_id, see
-- 0007_profiles.sql).

do $$ begin
  create type public.onboarding_document_status as enum ('sent', 'signed', 'accepted', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.onboarding_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  uploaded_by    uuid not null references public.profiles(id) on delete cascade,
  file_path      text not null,
  label          text not null,
  required       boolean not null default true,
  created_at     timestamptz not null default now(),
  -- tracks the applicant's first download, so customers/admins can see
  -- outstanding vs. downloaded documents
  downloaded_at  timestamptz,
  -- signing round trip
  signed_file_path text,
  status         public.onboarding_document_status not null default 'sent',
  signed_at      timestamptz,
  accepted_at    timestamptz,
  rejected_at    timestamptz,

  constraint onboarding_documents_label_check
    check (char_length(trim(label)) > 0 and char_length(label) <= 100),

  constraint onboarding_documents_file_path_check
    check (char_length(trim(file_path)) > 0)
);

create index if not exists onboarding_documents_application_id_idx
  on public.onboarding_documents (application_id);

create index if not exists onboarding_documents_uploaded_by_idx
  on public.onboarding_documents (uploaded_by);

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────

alter table public.onboarding_documents enable row level security;

-- Recruiters / Customers

drop policy if exists "onboarding_documents_customer_select" on public.onboarding_documents;
create policy "onboarding_documents_customer_select"
on public.onboarding_documents
for select
using (
  public.auth_is_admin()
  or exists (
    select 1
    from public.applications a
    join public.job_posts jp
      on jp.id = a.job_post_id
    where a.id = onboarding_documents.application_id
      and jp.recruiter_id = auth.uid()
  )
);

drop policy if exists "onboarding_documents_customer_insert" on public.onboarding_documents;
create policy "onboarding_documents_customer_insert"
on public.onboarding_documents
for insert
with check (
  public.auth_is_admin()
  or (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id = onboarding_documents.application_id
        and jp.recruiter_id = auth.uid()
    )
  )
);

-- Ownership boundary only, not the state machine: real writes to this table
-- go through the service-role client with their own explicit checks
-- (talent/actions.ts, applicant/hire-docs/actions.ts). An earlier version of
-- this policy tried to pin uploaded_by/application_id/file_path as immutable
-- by re-querying onboarding_documents from inside its own policy — querying
-- a table from within its own RLS policy makes Postgres re-apply that
-- table's RLS to the subquery, which recurses ("infinite recursion detected
-- in policy for relation onboarding_documents").
drop policy if exists "onboarding_documents_customer_update" on public.onboarding_documents;
create policy "onboarding_documents_customer_update"
on public.onboarding_documents
for update
using (
  public.auth_is_admin()
  or exists (
    select 1
    from public.applications a
    join public.job_posts jp
      on jp.id = a.job_post_id
    where a.id = onboarding_documents.application_id
      and jp.recruiter_id = auth.uid()
  )
)
with check (
  public.auth_is_admin()
  or exists (
    select 1
    from public.applications a
    join public.job_posts jp
      on jp.id = a.job_post_id
    where a.id = onboarding_documents.application_id
      and jp.recruiter_id = auth.uid()
  )
);

-- Applicant can update their own application's documents (reupload a signed
-- copy). Mirrors the join style onboarding_documents_applicant_select uses —
-- no denormalized applicant_id column needed.
drop policy if exists "onboarding_documents_applicant_update" on public.onboarding_documents;
create policy "onboarding_documents_applicant_update"
on public.onboarding_documents
for update
using (
  exists (
    select 1
    from public.applications a
    where a.id = onboarding_documents.application_id
      and a.applicant_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = onboarding_documents.application_id
      and a.applicant_id = auth.uid()
  )
);

drop policy if exists "onboarding_documents_customer_delete" on public.onboarding_documents;
create policy "onboarding_documents_customer_delete"
on public.onboarding_documents
for delete
using (
  public.auth_is_admin()
  or exists (
    select 1
    from public.applications a
    join public.job_posts jp
      on jp.id = a.job_post_id
    where a.id = onboarding_documents.application_id
      and jp.recruiter_id = auth.uid()
  )
);

-- Applicants (read only)

drop policy if exists "onboarding_documents_applicant_select" on public.onboarding_documents;
create policy "onboarding_documents_applicant_select"
on public.onboarding_documents
for select
using (
  exists (
    select 1
    from public.applications a
    where a.id = onboarding_documents.application_id
      and a.applicant_id = auth.uid()
  )
);

-- ─────────────────────────────────────────────────────────────
-- mark_onboarding_document_downloaded()
-- SECURITY DEFINER so it bypasses RLS intentionally: the applicant_select
-- policy above already gates who can call this meaningfully, and the plain
-- update would otherwise hit the same recursion the customer_update fix
-- above addresses.
-- ─────────────────────────────────────────────────────────────

create or replace function public.mark_onboarding_document_downloaded(doc_file_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.onboarding_documents
  set downloaded_at = now()
  where file_path = doc_file_path
    and downloaded_at is null
    and exists (
      select 1
      from public.applications a
      where a.id = onboarding_documents.application_id
        and a.applicant_id = auth.uid()
    );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Storage bucket for onboarding documents (Offer Letter, NDA, etc.)
-- uploaded by customers for a specific applicant's application.
--
-- Path convention:
--   onboarding-docs/{application_id}/{filename}
--
-- Bucket is private. Recruiters who own the job post may upload/manage
-- documents. Applicants may only read documents for their own application,
-- and may upload their own signed copy. Admins bypass all restrictions.
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'onboarding-docs',
  'onboarding-docs',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- INSERT
-- ─────────────────────────────────────────────────────────────

drop policy if exists "onboarding_docs_insert_customer"
on storage.objects;

drop policy if exists "onboarding_docs_insert_customer" on storage.objects;
create policy "onboarding_docs_insert_customer"
on storage.objects
for insert
with check (
  bucket_id = 'onboarding-docs'

  -- Require an application folder
  and array_length(storage.foldername(name), 1) >= 1

  -- Prevent absurdly long object names
  and char_length(name) <= 255

  -- Allow only supported extensions
  and lower(name) ~ '\.(pdf|doc|docx)$'

  and (
    public.auth_is_admin()

    or exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )
  )
);

-- Applicant can insert their signed copy. Same guards as
-- onboarding_docs_insert_customer, checked against the applicant instead of
-- the job-owning recruiter. No subfolder split needed (unlike offer-letters)
-- — file_path vs signed_file_path already distinguish original from signed
-- at the row level.
drop policy if exists "onboarding_docs_insert_applicant" on storage.objects;

create policy "onboarding_docs_insert_applicant"
on storage.objects
for insert
with check (
  bucket_id = 'onboarding-docs'

  and array_length(storage.foldername(name), 1) >= 1
  and char_length(name) <= 255
  and lower(name) ~ '\.(pdf|doc|docx)$'

  and exists (
    select 1
    from public.applications a
    where a.id::text = (storage.foldername(name))[1]
      and a.applicant_id = auth.uid()
  )
);

-- ─────────────────────────────────────────────────────────────
-- SELECT
-- ─────────────────────────────────────────────────────────────

drop policy if exists "onboarding_docs_select_customer_or_applicant"
on storage.objects;

drop policy if exists "onboarding_docs_select_customer_or_applicant" on storage.objects;
create policy "onboarding_docs_select_customer_or_applicant"
on storage.objects
for select
using (
  bucket_id = 'onboarding-docs'

  and (
    public.auth_is_admin()

    or exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )

    or exists (
      select 1
      from public.applications a
      where a.id::text = (storage.foldername(name))[1]
        and a.applicant_id = auth.uid()
    )
  )
);

-- ─────────────────────────────────────────────────────────────
-- DELETE
-- ─────────────────────────────────────────────────────────────

drop policy if exists "onboarding_docs_delete_customer"
on storage.objects;

drop policy if exists "onboarding_docs_delete_customer" on storage.objects;
create policy "onboarding_docs_delete_customer"
on storage.objects
for delete
using (
  bucket_id = 'onboarding-docs'

  and (
    public.auth_is_admin()

    or exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )
  )
);

-- ─────────────────────────────────────────────────────────────
-- UPDATE
-- (Allows overwrite, but prevents moving files between applications.)
-- ─────────────────────────────────────────────────────────────

drop policy if exists "onboarding_docs_update_customer"
on storage.objects;

drop policy if exists "onboarding_docs_update_customer" on storage.objects;
create policy "onboarding_docs_update_customer"
on storage.objects
for update
using (
  bucket_id = 'onboarding-docs'

  and (
    public.auth_is_admin()

    or exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )
  )
)
with check (
  bucket_id = 'onboarding-docs'

  and array_length(storage.foldername(name), 1) >= 1
  and char_length(name) <= 255
  and lower(name) ~ '\.(pdf|doc|docx)$'

  and (
    public.auth_is_admin()

    or exists (
      select 1
      from public.applications a
      join public.job_posts jp
        on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )
  )

  -- Prevent moving the object to another application's folder.
  and (
    (storage.foldername(name))[1] =
    (
      select (storage.foldername(o.name))[1]
      from storage.objects o
      where o.id = storage.objects.id
    )
  )
);