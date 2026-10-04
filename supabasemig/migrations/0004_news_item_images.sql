-- Storage bucket for news_item images. The cover_image_path / image_2_path /
-- image_3_path columns on news_items (defined in 0001) hold object paths
-- within this bucket — convention: `<id>/cover.jpg`, `<id>/image-2.jpg`,
-- `<id>/image-3.jpg`. The app resolves the public URL via
-- NEXT_PUBLIC_SUPABASE_URL + /storage/v1/object/public/<bucket>/<path>.

-- 1. Bucket
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do update set public = excluded.public;

-- 2. Public read policy on objects in this bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'news-images public read'
  ) then
    create policy "news-images public read"
      on storage.objects
      for select
      using (bucket_id = 'news-images');
  end if;
end$$;

-- 3. Admin write access
drop policy if exists "news_images_admin_write" on storage.objects;
create policy "news_images_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and public.auth_is_admin());

drop policy if exists "news_images_admin_update" on storage.objects;
create policy "news_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'news-images' and public.auth_is_admin())
  with check (bucket_id = 'news-images' and public.auth_is_admin());

drop policy if exists "news_images_admin_delete" on storage.objects;
create policy "news_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'news-images' and public.auth_is_admin());
