-- 0033_offer_letters.sql
-- Offer-letter round trip: customer uploads an offer letter for an
-- application (also flips applications.status interview -> offer),
-- the applicant downloads it, signs it outside the app, and re-uploads
-- the signed copy, then the customer reviews and accepts it (which flips
-- applications.status offer -> accepted). One row per application.
--
-- Kept as its own table/bucket rather than folded into onboarding_documents:
-- this is the first place an *applicant* needs upload rights, and
-- onboarding_documents/onboarding-docs currently grant applicants none —
-- safer to scope that separately than widen an existing bucket's blast
-- radius. State-transition guarding (who can move sent -> signed -> accepted,
-- and when) happens in the server actions via the service-role client, the
-- same convention already used by customer/.../talent/actions.ts. RLS here
-- is a read/write boundary, not the state machine.

do $$ begin
  create type public.offer_letter_status as enum ('sent', 'signed', 'accepted');
exception when duplicate_object then null; end $$;

create table if not exists public.offer_letters (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null unique references public.applications(id) on delete cascade,
  job_post_id       uuid not null references public.job_posts(id) on delete cascade,
  customer_id       uuid not null references auth.users(id) on delete cascade,
  applicant_id      uuid not null references auth.users(id) on delete cascade,
  uploaded_by       uuid not null references public.profiles(id) on delete cascade,

  file_path         text not null,
  signed_file_path  text,
  status            public.offer_letter_status not null default 'sent',

  created_at        timestamptz not null default now(),
  signed_at         timestamptz,
  accepted_at       timestamptz,

  constraint offer_letters_file_path_check
    check (char_length(trim(file_path)) > 0)
);

create index if not exists offer_letters_customer_idx  on public.offer_letters (customer_id);
create index if not exists offer_letters_applicant_idx on public.offer_letters (applicant_id);

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────

alter table public.offer_letters enable row level security;

drop policy if exists "offer_letters_select" on public.offer_letters;
create policy "offer_letters_select"
on public.offer_letters
for select
using (
  public.auth_is_admin()
  or customer_id = auth.uid()
  or applicant_id = auth.uid()
);

drop policy if exists "offer_letters_customer_insert" on public.offer_letters;
create policy "offer_letters_customer_insert"
on public.offer_letters
for insert
with check (
  public.auth_is_admin()
  or (
    customer_id = auth.uid()
    and exists (
      select 1 from public.job_posts jp
      where jp.id = offer_letters.job_post_id
        and jp.recruiter_id = auth.uid()
    )
  )
);

drop policy if exists "offer_letters_update" on public.offer_letters;
create policy "offer_letters_update"
on public.offer_letters
for update
using (
  public.auth_is_admin()
  or customer_id = auth.uid()
  or applicant_id = auth.uid()
)
with check (
  public.auth_is_admin()
  or customer_id = auth.uid()
  or applicant_id = auth.uid()
);

-- ─────────────────────────────────────────────────────────────
-- Storage bucket
--
-- Path convention:
--   offer-letters/{application_id}/original/{filename}  (customer-writable)
--   offer-letters/{application_id}/signed/{filename}     (applicant-writable)
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'offer-letters',
  'offer-letters',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

drop policy if exists "offer_letters_insert_customer" on storage.objects;

create policy "offer_letters_insert_customer"
on storage.objects
for insert
with check (
  bucket_id = 'offer-letters'
  and array_length(storage.foldername(name), 1) >= 2
  and (storage.foldername(name))[2] = 'original'
  and char_length(name) <= 255
  and lower(name) ~ '\.(pdf|doc|docx)$'
  and (
    public.auth_is_admin()
    or exists (
      select 1
      from public.applications a
      join public.job_posts jp on jp.id = a.job_post_id
      where a.id::text = (storage.foldername(name))[1]
        and jp.recruiter_id = auth.uid()
    )
  )
);

drop policy if exists "offer_letters_insert_applicant" on storage.objects;

create policy "offer_letters_insert_applicant"
on storage.objects
for insert
with check (
  bucket_id = 'offer-letters'
  and array_length(storage.foldername(name), 1) >= 2
  and (storage.foldername(name))[2] = 'signed'
  and char_length(name) <= 255
  and lower(name) ~ '\.(pdf|doc|docx)$'
  and (
    public.auth_is_admin()
    or exists (
      select 1
      from public.applications a
      where a.id::text = (storage.foldername(name))[1]
        and a.applicant_id = auth.uid()
    )
  )
);

drop policy if exists "offer_letters_select_customer_or_applicant" on storage.objects;

create policy "offer_letters_select_customer_or_applicant"
on storage.objects
for select
using (
  bucket_id = 'offer-letters'
  and (
    public.auth_is_admin()
    or exists (
      select 1
      from public.applications a
      join public.job_posts jp on jp.id = a.job_post_id
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
