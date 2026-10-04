-- Seed mock data for news_items table with placeholder images

INSERT INTO public.news_items (
  id,
  slug,
  kind,
  title,
  excerpt,
  body,
  cover_image_path,
  tags,
  author,
  published
) VALUES (
  gen_random_uuid(),
  'future-cloud-computing-2026',
  'blog',
  'The Future of Cloud Computing in 2026',
  'A deep dive into how cloud technologies are evolving and what to expect next year.',
  '<p>The cloud computing landscape continues to shift rapidly...</p>',
  'placeholder/cover-1.webp',
  '{cloud, technology, future}',
  'Jane Doe',
  true
);

INSERT INTO public.news_items (
  id,
  slug,
  kind,
  title,
  excerpt,
  body,
  cover_image_path,
  tags,
  author,
  published
) VALUES (
  gen_random_uuid(),
  'intrastack-announces-record-growth',
  'press',
  'Intrastack Announces Record Growth for Q2',
  'Enterprise adoption drives unprecedented momentum for the platform.',
  '<p>Intrastack is proud to announce significant milestones in our enterprise adoption...</p>',
  'placeholder/cover-2.webp',
  '{business, growth, press}',
  'Corporate Communications',
  true
);

INSERT INTO public.news_items (
  id,
  slug,
  kind,
  title,
  excerpt,
  body,
  cover_image_path,
  tags,
  read_time,
  published
) VALUES (
  gen_random_uuid(),
  'ai-cybersecurity-trend',
  'trend',
  'Why AI is the New Frontline Defense',
  'Exploring the critical role of artificial intelligence in modern cybersecurity strategies.',
  '<p>As cyber threats become more sophisticated, artificial intelligence provides...</p>',
  'placeholder/cover-3.webp',
  '{ai, security, trends}',
  5,
  true
);

INSERT INTO public.news_items (
  id,
  slug,
  kind,
  title,
  excerpt,
  body,
  cover_image_path,
  tags,
  pages,
  file_size,
  file_url,
  published
) VALUES (
  gen_random_uuid(),
  'zero-trust-architecture-guide',
  'whitepaper',
  'The Comprehensive Guide to Zero Trust Architecture',
  'Everything you need to know to implement zero trust in your organization.',
  '<p>This whitepaper details the foundational steps for shifting to a zero trust model...</p>',
  'placeholder/cover-4.webp',
  '{zero-trust, security, architecture}',
  24,
  '2.4MB',
  'placeholder/whitepaper-1.pdf',
  true
);

INSERT INTO public.news_items (
  id,
  slug,
  kind,
  title,
  excerpt,
  body,
  cover_image_path,
  tags,
  client,
  industry,
  metric_value,
  metric_label,
  published
) VALUES (
  gen_random_uuid(),
  'megacorp-scaled-intrastack',
  'client_story',
  'How MegaCorp Scaled Operations with Intrastack',
  'A closer look at how a leading financial firm achieved incredible operational efficiency.',
  '<p>MegaCorp was facing challenges with their legacy infrastructure. Here is how Intrastack helped...</p>',
  'placeholder/cover-5.webp',
  '{finance, scaling, success}',
  'MegaCorp',
  'Finance',
  '10x',
  'Growth',
  true
);