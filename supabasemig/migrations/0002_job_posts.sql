-- Job posts for the public Careers board.
-- Includes customer submission support.

do $$ begin
  create type employment_type as enum (
    'full_time',
    'part_time',
    'contract',
    'freelance',
    'internship',
    'temporary'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.job_posts (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  title              text not null,
  team               text,                       -- e.g. "Cloud Engineering"
  location           text not null,              -- e.g. "Las Vegas, NV" or "Anywhere"
  remote             boolean not null default false,
  employment_type    employment_type not null,
  seniority          text,                       -- e.g. "Senior", "Staff"
  salary_range       text,                       -- e.g. "$60k – $100k"
  short_description  text not null,              -- shown on the card (1–2 sentences)
  description        text,                       -- full body shown in the modal
  responsibilities   text[],                     -- bullet list in modal
  requirements       text[],                     -- bullet list in modal
  nice_to_have       text[],                     -- bullet list in modal
  tags               text[],                     -- e.g. {AWS,Kubernetes,Terraform}
  published          boolean not null default true,
  posted_at          timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- Customer submissions: null means admin-created post
  recruiter_id       uuid references public.profiles(id) on delete set null
);

-- Index for public careers board query
create index if not exists job_posts_published_posted_at_idx
  on public.job_posts (posted_at desc)
  where published = true;

-- Index for customer's own listings
create index if not exists job_posts_recruiter_idx
  on public.job_posts (recruiter_id)
  where recruiter_id is not null;

-- Index for admin pending-review queue (oldest first)
create index if not exists job_posts_pending_review_idx
  on public.job_posts (created_at asc)
  where published = false and recruiter_id is not null;

alter table public.job_posts enable row level security;

-- Public: only published posts
drop policy if exists "job_posts public read" on public.job_posts;
create policy "job_posts public read"
  on public.job_posts for select
  using (published = true);

-- Customer: see own posts regardless of published state
drop policy if exists "job_posts_customer_select_own" on public.job_posts;
create policy "job_posts_customer_select_own"
  on public.job_posts for select
  to authenticated
  using (recruiter_id = auth.uid() and public.auth_user_role() = 'customer'::public.user_role);

-- Customer: submit new listing (always unpublished, must own the row)
drop policy if exists "job_posts_customer_insert_own" on public.job_posts;
create policy "job_posts_customer_insert_own"
  on public.job_posts for insert
  to authenticated
  with check (
    recruiter_id = auth.uid()
    and published = false
    and public.auth_user_role() = 'customer'::public.user_role
  );

-- Customer: edit own listing only while still pending
drop policy if exists "job_posts_customer_update_own_pending" on public.job_posts;
create policy "job_posts_customer_update_own_pending"
  on public.job_posts for update
  using (recruiter_id = auth.uid() and published = false and public.auth_user_role() = 'customer')
  with check (recruiter_id = auth.uid() and published = false and public.auth_user_role() = 'customer');

-- Customer: withdraw own pending listing
drop policy if exists "job_posts_customer_delete_own_pending" on public.job_posts;
create policy "job_posts_customer_delete_own_pending"
  on public.job_posts for delete
  using (recruiter_id = auth.uid() and published = false and public.auth_user_role() = 'customer');

-- Admin dashboard: full read/write access.
drop policy if exists "job_posts_admin_all" on public.job_posts;
create policy job_posts_admin_all
  on public.job_posts for all
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop trigger if exists job_posts_set_updated_at on public.job_posts;
create trigger job_posts_set_updated_at
  before update on public.job_posts
  for each row execute function public.set_updated_at();
