-- Seed data for news_items — the three real news items sourced from the
-- company PDFs (Bengaluru DC expansion, Tokyo DC expansion, Michael Levitre
-- VP Sales appointment). Run against an empty table.
--
-- cover_image_path values are the object paths within the `news-images`
-- storage bucket. Upload the matching files to the bucket before or after
-- running this seed; until they exist the cards render with a broken image.

insert into public.news_items (slug, kind, title, excerpt, cover_image_path, tags, published_at) values
(
  'bengaluru-delivery-center',
  'blog',
  'Intrastack expands with Bengaluru, India delivery center',
  'Intrastack Solutions is excited to announce the establishment of our new delivery center in Bengaluru, India — extending round-the-clock coverage across our delivery footprint.',
  'bengaluru-delivery-center/cover.jpg',
  '{Network}',
  '2024-08-09'
),
(
  'tokyo-delivery-center',
  'blog',
  'Intrastack Solutions establishes Tokyo, Japan delivery center',
  'A strategic expansion that puts senior engineers within client time zones across APAC.',
  'tokyo-delivery-center/cover.jpg',
  '{Network}',
  '2024-08-09'
),
(
  'michael-levitre-vp-sales',
  'blog',
  'Michael Levitre appointed Vice President of Sales',
  'We are thrilled to announce that Michael Levitre has joined Intrastack Solutions as our new Vice President of Sales.',
  'michael-levitre-vp-sales/cover.jpg',
  '{Team}',
  '2024-07-11'
);
