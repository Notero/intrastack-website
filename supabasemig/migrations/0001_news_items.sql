-- News items: blogs, trends, whitepapers, client stories.
-- A single table with a `kind` discriminator keeps queries trivial and
-- mirrors how the Next.js app fetches at `fetchNewsList(kind)` /
-- `fetchNewsItem(kind, slug)`.

do $$ begin
  create type news_kind as enum ('blog', 'trend', 'whitepaper', 'client_story', 'press');
exception when duplicate_object then null; end $$;

create table if not exists public.news_items (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  kind          news_kind not null,
  title         text not null,
  excerpt       text not null,
  body          text,
  -- images live in the `news-images` storage bucket; columns store object
  -- paths within the bucket (see migration 0004 for the bucket setup).
  cover_image_path text not null,
  image_2_path  text,
  image_3_path  text,
  tags          text[] not null default '{}',
  author        text,
  -- whitepaper
  pages         integer,
  file_size     text,
  file_url      text,
  -- client_story
  client        text,
  industry      text,
  metric_value  text,
  metric_label  text,
  -- trend
  read_time     integer check (read_time is null or read_time > 0),
  -- publishing
  published     boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (kind, slug)
);

create index if not exists news_items_kind_published_at_idx
  on public.news_items (kind, published_at desc)
  where published = true;

-- Row-level security: public can read published rows; authenticated users
-- with the `editor` role (or service-role key from a server) can write.
alter table public.news_items enable row level security;

drop policy if exists "news_items public read" on public.news_items;
create policy "news_items public read"
  on public.news_items
  for select
  using (published = true);

-- Admin dashboard: full read/write access.
drop policy if exists "news_items_admin_all" on public.news_items;
create policy news_items_admin_all
  on public.news_items for all
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_items_set_updated_at on public.news_items;
create trigger news_items_set_updated_at
  before update on public.news_items
  for each row execute function public.set_updated_at();
