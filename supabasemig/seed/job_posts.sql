-- Mock job posts for the Careers board.
-- Run against an empty job_posts table.

insert into public.job_posts (
  slug, title, team, location, remote, employment_type, seniority, salary_range,
  short_description, description, responsibilities, requirements, nice_to_have, tags, posted_at
) values
(
  'senior-cloud-engineer-bengaluru',
  'Senior Cloud Engineer',
  'Cloud Engineering',
  'Bengaluru, India',
  true,
  'full_time',
  'Senior',
  '₹35L – ₹50L',
  'Design and operate multi-region AWS landing zones for enterprise clients across APAC.',
  'You will lead the design and rollout of secure, multi-account AWS environments for clients out of our new Bengaluru delivery center. Working closely with US and EU pods, you will own the architecture decisions that keep our platforms reliable and cost-effective at scale.',
  array[
    'Design landing zones with Control Tower, Organizations, and IaC',
    'Drive cost, reliability, and security reviews with client architects',
    'Mentor 2–3 mid-level engineers and review their PRs',
    'On-call rotation (1 week in 6) covering APAC business hours'
  ],
  array[
    '6+ years building production AWS workloads',
    'Strong Terraform and at least one of Python / Go',
    'Hands-on with EKS, IAM, networking, and observability tooling',
    'Excellent written English — async-first team'
  ],
  array[
    'AWS Solutions Architect Professional certification',
    'Experience with GCP or Azure in addition to AWS',
    'Open-source contributions to infra tooling'
  ],
  array['AWS','Terraform','Kubernetes','Python','Go'],
  '2026-05-12'
),
(
  'site-reliability-engineer-tokyo',
  'Site Reliability Engineer',
  'Platform',
  'Tokyo, Japan',
  false,
  'full_time',
  'Mid–Senior',
  '¥10M – ¥14M',
  'Keep client-facing platforms healthy across APAC from our new Tokyo delivery center.',
  'Join the founding team of our Tokyo delivery center. You will own SLOs, incident response, and capacity planning for a portfolio of client platforms, partnering with engineering teams in India and the US to ship reliability improvements end-to-end.',
  array[
    'Define and report on SLOs and error budgets per service',
    'Lead postmortems and drive durable fixes',
    'Improve observability — metrics, logs, traces, and runbooks',
    'Automate toil with Python or Go tooling'
  ],
  array[
    '4+ years SRE or platform engineering experience',
    'Comfortable in production Linux, Kubernetes, and CI/CD',
    'Conversational Japanese and professional English',
    'Calm in incidents; strong written communication'
  ],
  array[
    'Experience with Datadog, Grafana, or Honeycomb',
    'Prior on-call leadership',
    'Background in fintech or regulated industries'
  ],
  array['SRE','Kubernetes','Datadog','Python','Japanese'],
  '2026-05-08'
),
(
  'enterprise-account-executive-las-vegas',
  'Enterprise Account Executive',
  'Sales',
  'Las Vegas, NV',
  false,
  'full_time',
  'Senior',
  '$140k – $180k base + commission',
  'Land and expand mid-market and enterprise managed-services accounts across the western US.',
  'Reporting to our VP of Sales, you will own the full cycle for new logos in the $5M–$50M ARR segment — from outbound and discovery through technical evaluation with our solutions team, to contract close and a clean hand-off to delivery.',
  array[
    'Own a quarterly quota of qualified pipeline and closed revenue',
    'Run discovery, demos, and stakeholder mapping in coordination with SAs',
    'Partner with marketing on territory plays and ABM lists',
    'Forecast accurately in Salesforce'
  ],
  array[
    '6+ years selling IT services, managed services, or cloud platforms',
    'Track record of closing $250k+ ACV deals',
    'Comfortable presenting to VP / CIO buyers',
    'Based in or willing to relocate to the Las Vegas area'
  ],
  array[
    'Existing network in healthcare, finance, or logistics verticals',
    'Experience selling alongside delivery / professional-services teams'
  ],
  array['Sales','Enterprise','Managed Services','Salesforce'],
  '2026-04-29'
),
(
  'full-stack-engineer-remote',
  'Full-Stack Software Engineer',
  'Product Engineering',
  'Anywhere',
  true,
  'full_time',
  'Mid-level',
  '$110k – $145k',
  'Build internal tools and client-facing portals on a modern TypeScript stack.',
  'You will work across the stack — Next.js on the front, Postgres + serverless on the back — to ship tools that make our delivery teams faster and our clients happier. Small team, clear ownership, low meeting load.',
  array[
    'Ship features end-to-end across React, Node, and Postgres',
    'Write and review tests; care about correctness over cleverness',
    'Collaborate async with delivery and design leads',
    'Help shape the engineering culture as we grow'
  ],
  array[
    '3+ years writing production TypeScript',
    'Comfortable with React / Next.js and SQL',
    'Strong written communication — most work is async',
    'Overlap of at least 4h with US Pacific or India Standard Time'
  ],
  array[
    'Experience with Supabase, Prisma, or similar',
    'Prior work on multi-tenant SaaS',
    'Design sensibility — you can polish a UI without hand-holding'
  ],
  array['TypeScript','Next.js','React','Postgres','Supabase'],
  '2026-04-22'
),
(
  'devops-engineering-intern-bengaluru',
  'DevOps Engineering Intern',
  'Cloud Engineering',
  'Bengaluru, India',
  false,
  'internship',
  'Intern',
  '₹50k / month',
  'Six-month internship working alongside our Bengaluru cloud engineers on real client infrastructure.',
  'Structured six-month program with a mentor, weekly learning sessions, and gradually increasing ownership. Strong performers convert to a full-time engineer offer at the end of the program.',
  array[
    'Pair with senior engineers on day-to-day infrastructure work',
    'Own a scoped project end-to-end by month three',
    'Present learnings in weekly engineering reviews'
  ],
  array[
    'Final-year or recent CS / IT graduate',
    'Hands-on with Linux and at least one scripting language',
    'Curiosity about cloud platforms — projects, labs, or homelab counts',
    'Based in or able to relocate to Bengaluru'
  ],
  array[
    'AWS / GCP free-tier projects in your portfolio',
    'Contributions to open-source infra tools',
    'Familiarity with Terraform or Ansible'
  ],
  array['AWS','Linux','Terraform','Internship'],
  '2026-04-15'
);
