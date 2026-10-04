-- 0022_notifications.sql
-- In-app notifications for applicants.
-- Created server-side (by triggers or admin actions); applicants can only
-- read and mark as read — they cannot insert their own notifications.

do $$ begin
  create type public.notification_kind as enum (
    'job',        -- new job match or job post update
    'application',-- application status changed
    'info',       -- general platform message
    'alert'       -- action required (e.g. profile incomplete)
  );
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  user_id      uuid        not null references auth.users(id) on delete cascade,
  kind         public.notification_kind not null default 'info',
  title        text        not null check (char_length(title) between 1 and 200),
  body         text        not null check (char_length(body)  between 1 and 2000),
  read         boolean     not null default false,
  read_at      timestamptz,

  constraint notifications_read_at_requires_read
    check (read_at is null or read = true)
);

create index if not exists notifications_user_idx       on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx     on public.notifications (user_id) where read = false;

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.notifications enable row level security;

-- User sees only their own notifications; admin sees all
drop policy if exists "notifications_select_own_or_admin" on public.notifications;
create policy "notifications_select_own_or_admin"
  on public.notifications for select
  using (user_id = auth.uid() or public.auth_is_admin());

-- Only admin / service-role can insert notifications (no self-notification)
drop policy if exists "notifications_insert_admin" on public.notifications;
create policy "notifications_insert_admin"
  on public.notifications for insert
  with check (public.auth_is_admin());

-- User can mark their own notifications as read; admin can update any
drop policy if exists "notifications_update_own_or_admin" on public.notifications;
create policy "notifications_update_own_or_admin"
  on public.notifications for update
  using (user_id = auth.uid() or public.auth_is_admin())
  with check (user_id = auth.uid() or public.auth_is_admin());

drop policy if exists "notifications_delete_admin" on public.notifications;
create policy "notifications_delete_admin"
  on public.notifications for delete
  using (public.auth_is_admin());
