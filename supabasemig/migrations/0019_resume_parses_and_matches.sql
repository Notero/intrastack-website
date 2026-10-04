-- 0029_resume_parses_and_matches.sql
-- Resume Assistant: structured resume parses and their role-match results.
-- One parse per upload; matches are replaced wholesale each time matching re-runs
-- (api/resume/match deletes existing rows for a parse before inserting the new top-3).

create table if not exists public.resume_parses (
  id                uuid        primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  applicant_id      uuid        not null references auth.users(id) on delete cascade,
  source_filename   text,
  model             text,        -- 'stub' or the model id, e.g. 'claude-opus-4-8'
  stub              boolean     not null default false,
  parsed            jsonb       not null   -- ParsedResume shape (src/lib/resume/schema.ts)
);

create index if not exists resume_parses_applicant_idx on public.resume_parses (applicant_id, created_at desc);

create table if not exists public.resume_matches (
  id                uuid        primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  applicant_id      uuid        not null references auth.users(id) on delete cascade,
  resume_parse_id   uuid        not null references public.resume_parses(id) on delete cascade,
  job_post_id       uuid        references public.job_posts(id) on delete set null,  -- null for mock/non-UUID jobs

  job_title         text        not null,
  rank              int         not null,
  score             int         not null,
  matched_skills    text[]      not null default '{}',
  gaps              text[]      not null default '{}',
  reasoning         text,
  stub              boolean     not null default false,

  constraint resume_matches_unique_rank unique (resume_parse_id, rank)
);

create index if not exists resume_matches_parse_idx     on public.resume_matches (resume_parse_id, rank);
create index if not exists resume_matches_applicant_idx on public.resume_matches (applicant_id, created_at desc);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.resume_parses  enable row level security;
alter table public.resume_matches enable row level security;

drop policy if exists "resume_parses_select_own_or_admin" on public.resume_parses;
create policy "resume_parses_select_own_or_admin"
  on public.resume_parses for select
  using (applicant_id = auth.uid() or public.auth_is_admin());

drop policy if exists "resume_parses_insert_own" on public.resume_parses;
create policy "resume_parses_insert_own"
  on public.resume_parses for insert
  with check (applicant_id = auth.uid());

drop policy if exists "resume_matches_select_own_or_admin" on public.resume_matches;
create policy "resume_matches_select_own_or_admin"
  on public.resume_matches for select
  using (applicant_id = auth.uid() or public.auth_is_admin());

drop policy if exists "resume_matches_insert_own" on public.resume_matches;
create policy "resume_matches_insert_own"
  on public.resume_matches for insert
  with check (applicant_id = auth.uid());

drop policy if exists "resume_matches_delete_own" on public.resume_matches;
create policy "resume_matches_delete_own"
  on public.resume_matches for delete
  using (applicant_id = auth.uid());
