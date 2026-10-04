-- seed_founder.sql
-- Seed the founder row (requires migrations/0031a_leadership_founder_enum.sql
-- committed first). photo_path is left
-- null — the public page falls back to /images/team/stefan.webp until a
-- photo is uploaded from /admin/leadership.

insert into public.leadership_people (slug, name, title, group_name, intro, display_order, published)
values (
  'stefan-nguyen',
  'Stefan Nguyen',
  'Founder',
  'founder',
  array[
    'Stefan founded Intrastack Solutions in 2019 with the conviction that cloud transformation deserves a partner who treats it as engineering, not theatre. With more than three decades in technology delivery and consulting, he shapes how we hire, how we architect, and how we hand over.'
  ],
  0,
  true
)
on conflict (slug) do nothing;
