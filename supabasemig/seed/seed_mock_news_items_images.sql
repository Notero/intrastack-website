-- Seed mock data for news_items table with specific local images

-- BLOGS (2)
INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, author, published) VALUES (
  gen_random_uuid(), 'blog-local-images-1', 'blog', 'The Engineering Behind Our New Dashboard', 'A deep dive into our frontend stack and performance improvements.', '<p>Our engineering team has been hard at work...</p>', 'photo-1454165804606-c3d57bc86b40-800.webp', '{engineering, frontend}', 'Jane Engineer', true
);

INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, image_2_path, tags, author, published) VALUES (
  gen_random_uuid(), 'blog-local-images-2', 'blog', 'Our Journey to Next.js 16', 'Lessons learned upgrading our core platforms to the latest version of Next.', '<p>The upgrade path to Next.js 16 was not without its hurdles...</p>', 'photo-1499750310107-5fef28a66643-1600.webp', 'photo-1451187580459-43490279c0fa-1200.webp', '{engineering, nextjs}', 'Bob Developer', true
);

-- PRESS (2)
INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, author, published) VALUES (
  gen_random_uuid(), 'press-local-images-1', 'press', 'Intrastack Announces New Series C Funding', 'The latest round of funding will accelerate product development and global expansion.', '<p>We are thrilled to announce our Series C funding round...</p>', 'photo-1542744173-8e7e53415bb0-1600.webp', '{press, funding, growth}', 'Corporate Communications', true
);

INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, author, published) VALUES (
  gen_random_uuid(), 'press-local-images-2', 'press', 'Intrastack Named to Top 100 Workplaces', 'Recognized for our culture and commitment to employee well-being.', '<p>It is an honor to be recognized as one of the top workplaces...</p>', 'photo-1522071820081-009f0129c71c-1600.webp', '{press, awards, culture}', 'Corporate Communications', true
);

-- TRENDS (2)
INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, image_2_path, tags, read_time, published) VALUES (
  gen_random_uuid(), 'trend-local-images-1', 'trend', 'Serverless Architecture in 2026', 'How serverless is evolving beyond just compute and into holistic application models.', '<p>Serverless architecture is maturing rapidly...</p>', 'photo-1451187580459-43490279c0fa-1600.webp', 'photo-1518770660439-4636190af475-1200.webp', '{serverless, trends, architecture}', 5, true
);

INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, read_time, published) VALUES (
  gen_random_uuid(), 'trend-local-images-2', 'trend', 'The Rise of Vector Databases', 'Why vector databases are becoming essential for AI-powered applications.', '<p>With the explosion of large language models, vector databases...</p>', 'photo-1550751827-4bd374c3f58b-1200.webp', '{databases, ai, trends}', 7, true
);

-- WHITEPAPERS (2)
INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, pages, file_size, file_url, published) VALUES (
  gen_random_uuid(), 'whitepaper-local-images-1', 'whitepaper', 'Mastering Microservices', 'A comprehensive guide to building and scaling microservices.', '<p>This whitepaper provides a roadmap for migrating to a microservices architecture...</p>', 'photo-1517694712202-14dd9538aa97-1200.webp', '{microservices, architecture, scaling}', 45, '3.2MB', 'placeholder/whitepaper-2.pdf', true
);

INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, image_2_path, image_3_path, tags, pages, file_size, file_url, published) VALUES (
  gen_random_uuid(), 'whitepaper-local-images-2', 'whitepaper', 'The State of Enterprise Security', 'An analysis of current threats and mitigation strategies for large organizations.', '<p>Enterprise security has never been more challenging...</p>', 'photo-1605745341112-85968b19335b-1600.webp', 'photo-1586528116311-ad8dd3c8310d-800.webp', 'photo-1558494949-ef010cbdcc31-1600.webp', '{security, enterprise, threats}', 32, '2.8MB', 'placeholder/whitepaper-3.pdf', true
);

-- CLIENT STORIES (2)
INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, tags, client, industry, metric_value, metric_label, published) VALUES (
  gen_random_uuid(), 'client-story-local-images-1', 'client_story', 'Global Logistics Co. Streamlines Operations', 'How Intrastack helped a logistics giant achieve real-time visibility.', '<p>Global Logistics Co. needed a solution to track shipments in real-time...</p>', 'photo-1581091226825-a6a2a5aee158-1200.webp', '{logistics, operations, success}', 'Global Logistics Co.', 'Logistics', '25%', 'Cost Reduction', true
);

INSERT INTO public.news_items (id, slug, kind, title, excerpt, body, cover_image_path, image_2_path, tags, client, industry, metric_value, metric_label, published) VALUES (
  gen_random_uuid(), 'client-story-local-images-2', 'client_story', 'FinTech Startup Scales with Intrastack', 'Supporting hyper-growth with resilient infrastructure.', '<p>When this FinTech startup experienced a surge in user growth...</p>', 'photo-1551288049-bebda4e38f71-1200.webp', 'photo-1563013544-824ae1b704d3-1600.webp', '{fintech, scaling, infrastructure}', 'FastPay Startup', 'FinTech', '10x', 'User Growth', true
);