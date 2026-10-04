-- 0030_leadership_people.sql
-- Leadership + Board of Advisors content, admin-managed from the dashboard.
-- One table with a `group` discriminator, mirroring how news_items uses
-- news_kind for blog/trend/whitepaper/client_story/press. `founder` sorts
-- first in group_name ordering so the Founder (Stefan Nguyen) can be
-- admin-editable like everyone else, rather than a hardcoded record in
-- src/app/about/leadership/page.tsx.

do $$ begin
  create type leadership_group as enum ('founder', 'executive', 'vp', 'director', 'advisor');
exception when duplicate_object then null; end $$;

create table if not exists public.leadership_people (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  title         text not null,
  group_name    leadership_group not null,
  -- advisors show a region (Vietnam, Japan, ...); available to any row
  region        text,
  -- photo lives in the `leadership-photos` storage bucket; column stores the
  -- object path within the bucket. Convention: `<slug>/photo-<uuid8>.<ext>`.
  photo_path    text,
  -- optional contact / social links — rendered on the bio page only when present
  email         text,
  phone         text,
  linkedin_url  text,
  instagram_url text,
  twitter_url   text,
  -- bio content: paragraphs, focus-area highlight cards, closing pull-quote.
  -- Left empty, a person still shows as a card with no linked bio page.
  intro         text[] not null default '{}',
  -- names from the master catalog in src/lib/content/certifications.ts that
  -- apply to this person; no DB-side lookup table.
  certifications text[] not null default '{}',
  highlights    jsonb not null default '[]',
  closing       text,
  display_order integer not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists leadership_people_group_order_idx
  on public.leadership_people (group_name, display_order)
  where published = true;

-- Row-level security: public can read published rows; admins can read/write everything.
alter table public.leadership_people enable row level security;

drop policy if exists "leadership_people_public_read" on public.leadership_people;
create policy leadership_people_public_read
  on public.leadership_people
  for select
  using (published = true);

drop policy if exists "leadership_people_admin_all" on public.leadership_people;
create policy leadership_people_admin_all
  on public.leadership_people for all
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop trigger if exists leadership_people_set_updated_at on public.leadership_people;
create trigger leadership_people_set_updated_at
  before update on public.leadership_people
  for each row execute function public.set_updated_at();

-- ─── Storage bucket for leadership/advisor photos ──────────────────────────

insert into storage.buckets (id, name, public)
values ('leadership-photos', 'leadership-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "leadership_photos_public_read" on storage.objects;
create policy "leadership_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'leadership-photos');

drop policy if exists "leadership_photos_admin_write" on storage.objects;
create policy "leadership_photos_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'leadership-photos' and public.auth_is_admin());

drop policy if exists "leadership_photos_admin_update" on storage.objects;
create policy "leadership_photos_admin_update"
  on storage.objects for update
  using (bucket_id = 'leadership-photos' and public.auth_is_admin())
  with check (bucket_id = 'leadership-photos' and public.auth_is_admin());

drop policy if exists "leadership_photos_admin_delete" on storage.objects;
create policy "leadership_photos_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'leadership-photos' and public.auth_is_admin());
