-- Related-news seed.
--
-- Demonstrates the `news_items.tags` convention used by the
-- <RelatedNews> section on industry / service / solution detail pages.
-- The page does an array overlap match against tags terms it
-- derives from the page subject (name, slug, accent pills). To surface a
-- news item on a page, one of the item's tags must match one of those terms.
--
-- Examples of the convention used below:
--   tags = '{Healthcare,FHIR}'      -> matches /industries/healthcare
--   tags = '{Finance,Core banking}' -> matches /industries/finance
--   tags = '{AWS landing zones}'    -> matches /solutions/aws
--   tags = '{DevOps & Automation}'  -> matches /services/devops_automation
--
-- Cover paths reuse the three real images seeded in news_items.sql so
-- the cards render without uploading new files. Slugs are unique per
-- (kind, slug); re-running this seed is safe via ON CONFLICT DO NOTHING.

insert into public.news_items
  (slug, kind, title, excerpt, cover_image_path, tag, published_at)
values
-- ----- Industry-tagged --------------------------------------------------
('fhir-interop-without-rip-replace', 'blog',
 'FHIR interoperability without the rip-and-replace',
 'Modern integration patterns that respect the EHR you already run — HL7 v2 in parallel, FHIR APIs out front.',
 'bengaluru-delivery-center/cover.jpg', 'Healthcare · FHIR', '2024-09-10'),

('core-banking-modernization-windows', 'trend',
 'Core banking modernization inside 2-hour change windows',
 'Why the strangler pattern beats the big-bang migration when markets do not stop for your roadmap.',
 'tokyo-delivery-center/cover.jpg', 'Finance · Core banking', '2024-09-18'),

('fedramp-evidence-pipeline', 'whitepaper',
 'A FedRAMP evidence pipeline that auditors actually accept',
 'Continuous monitoring, control-as-code, and the ATO acceleration playbook used on three federal programs.',
 'michael-levitre-vp-sales/cover.jpg', 'Government · FedRAMP', '2024-10-02'),

('opc-ua-cloud-bridge', 'blog',
 'Bridging plant-floor OPC UA into cloud analytics — safely',
 'A reference architecture for OT/IT convergence that respects production change windows.',
 'bengaluru-delivery-center/cover.jpg', 'Manufacturing · OT/IT', '2024-10-14'),

('omnichannel-inventory-on-product-page', 'client_story',
 'Inventory truth on the product page, mid-rush',
 'How a national retailer survived Black Friday on a brand-new real-time inventory layer.',
 'tokyo-delivery-center/cover.jpg', 'Retail · Omnichannel', '2024-11-01'),

('edge-telemetry-fleet-uptime', 'trend',
 'Edge telemetry without silent data loss',
 'Local-first ingest patterns that keep working when the truck loses signal.',
 'michael-levitre-vp-sales/cover.jpg', 'Logistics · Edge telemetry', '2024-11-09'),

('5g-cnf-data-plane', 'blog',
 'Carrier-grade CNFs without the carrier timeline',
 'Cloud-native network functions, service mesh, and the OSS/BSS modernization plan around them.',
 'bengaluru-delivery-center/cover.jpg', 'Telecom · 5G', '2024-11-20'),

('sis-lms-identity-federation', 'whitepaper',
 'Federating identity across SIS and LMS — without breaking finals week',
 'A staged identity rollout that audits cleanly under FERPA and survives registration peak.',
 'tokyo-delivery-center/cover.jpg', 'Education · SIS and LMS', '2024-12-02'),

-- ----- Service-tagged ---------------------------------------------------
('multi-cloud-landing-zone-90-days', 'whitepaper',
 'A production-grade landing zone in under 90 days',
 'How we deliver Cloud Transformation across AWS, Azure, and GCP with FinOps wired in from day one.',
 'michael-levitre-vp-sales/cover.jpg', 'Cloud Transformation', '2024-09-05'),

('dora-3x-deployment-frequency', 'trend',
 'DevOps & Automation: 3–5× deployment frequency in 12 weeks',
 'The pipeline, IaC, and observability stack we install and hand over with a 30-day warranty.',
 'bengaluru-delivery-center/cover.jpg', 'DevOps & Automation', '2024-09-22'),

('ai-eval-driven-development', 'blog',
 'Eval-driven AI development — and why your models keep regressing without it',
 'The offline + online evaluation harness we install before production traffic ever hits a model.',
 'tokyo-delivery-center/cover.jpg', 'AI & Machine Learning', '2024-10-08'),

('zero-trust-pillars-in-practice', 'whitepaper',
 'Zero-trust, in practice',
 'NIST SP 800-207 pillars implemented as five coordinated programs — identity, endpoint, network, app, data.',
 'michael-levitre-vp-sales/cover.jpg', 'Cybersecurity · Zero Trust', '2024-10-20'),

('platform-day-91', 'blog',
 'Software Development: the platform your team owns on day 91',
 'Senior-only delivery, production-grade from the first release, hand-over baked into scope.',
 'bengaluru-delivery-center/cover.jpg', 'Software Development', '2024-11-05'),

('mobile-retention-baseline', 'trend',
 'Mobile Development engineered for retention',
 'Crash-free baseline, accessibility from sprint one, A/B framework live before launch.',
 'tokyo-delivery-center/cover.jpg', 'Mobile Development', '2024-11-15'),

('it-estate-managed-asset', 'blog',
 'Operating the IT estate as a managed asset',
 'Procurement, MDM, helpdesk, and refresh — one accountable partner across vendors and sites.',
 'michael-levitre-vp-sales/cover.jpg', 'Hardware & Software', '2024-11-25'),

('senior-engineers-14-day-placement', 'client_story',
 'Staffing Services: 14-day placement on a cleared role',
 'How an embedded senior engineer shipped inside the client CI from week one.',
 'bengaluru-delivery-center/cover.jpg', 'Staffing Services', '2024-12-08'),

('6rs-migration-wave-plan', 'whitepaper',
 'The 6 Rs disposition: cloud migration without big-bang cutovers',
 'Wave-by-wave migration, dry-run cutovers, and the FinOps loop installed before the second wave.',
 'tokyo-delivery-center/cover.jpg', 'Cloud Migration', '2024-12-15'),

('cloud-strategy-monday-step', 'blog',
 'Cloud Strategy & Design: a deck with a Monday-morning step',
 'Strategy paired with a sequenced, costed, ownership-assigned delivery plan.',
 'michael-levitre-vp-sales/cover.jpg', 'Cloud Strategy & Design', '2024-12-22'),

-- ----- Solution-tagged --------------------------------------------------
('data-analytics-six-weeks-first-dashboard', 'client_story',
 'Six weeks to first trusted dashboard',
 'A mid-market client moved from spreadsheet exports to a governed Snowflake stack with lineage on every metric.',
 'bengaluru-delivery-center/cover.jpg', 'Data Analytics · Snowflake', '2025-01-08'),

('security-compliance-evidence-as-code', 'whitepaper',
 'Security & Compliance: evidence as code',
 'Controls and proofs in the same repo. Drift detected automatically. Audit week stops being a fire drill.',
 'tokyo-delivery-center/cover.jpg', 'Security & Compliance · FedRAMP', '2025-01-15'),

('aws-landing-zone-baseline', 'blog',
 'The AWS landing zone baseline we install on day one',
 'Multi-account topology, IAM baseline, network segmentation, and FinOps tagging — codified, not improvised.',
 'michael-levitre-vp-sales/cover.jpg', 'AWS landing zones', '2025-01-22'),

('azure-well-architected-in-practice', 'trend',
 'Azure Well-Architected, in practice',
 'How we apply the five pillars to enterprise workloads — without slowing delivery.',
 'bengaluru-delivery-center/cover.jpg', 'Azure', '2025-01-29'),

('hybrid-cloud-without-the-tax', 'blog',
 'Hybrid cloud without the operational tax',
 'A control plane that treats on-prem and cloud as one platform — observable, governed, audited.',
 'tokyo-delivery-center/cover.jpg', 'Hybrid Cloud', '2025-02-05'),

('kubernetes-platform-team-day-1', 'whitepaper',
 'A Kubernetes platform team can rely on, from day one',
 'Cluster topology, golden paths, policy-as-code, and the on-call rotation that keeps it running.',
 'michael-levitre-vp-sales/cover.jpg', 'Kubernetes', '2025-02-12'),

('ai-automation-production-bots', 'client_story',
 'AI Automation: putting bots into production, not into a demo',
 'A retail operations bot stack tied to the workflow KPI — measured, evaluated, retrained.',
 'bengaluru-delivery-center/cover.jpg', 'AI Automation', '2025-02-19'),

('business-continuity-rto-rpo', 'blog',
 'Business Continuity with measurable RTO and RPO',
 'How we engineer recovery objectives into the architecture rather than promising them in a binder.',
 'tokyo-delivery-center/cover.jpg', 'Business Continuity', '2025-02-26'),

('enterprise-security-posture', 'trend',
 'Enterprise Security: posture that holds up under audit',
 'A single codified control set, mapped across SOC 2, ISO 27001, and HIPAA simultaneously.',
 'michael-levitre-vp-sales/cover.jpg', 'Enterprise Security', '2025-03-05'),

('cicd-transformation-rollout', 'whitepaper',
 'CI/CD Transformation: a rollout plan engineering teams adopt',
 'Paved roads, golden paths, and policy-as-code — adopted because they are the lowest-friction option.',
 'bengaluru-delivery-center/cover.jpg', 'CI/CD Transformation', '2025-03-12')

on conflict (kind, slug) do nothing;
