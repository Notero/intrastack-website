import type { ServiceContent } from "@/components/public/templates/servicePage";
//PRICING OPTIONS SHOULD BE CHANGED
const tiers = (deliverables: string, services: string): ServiceContent["tiers"] => [
  {
    name: "Sprint",
    price: "~$45k · 4 wks",
    tagline: "Targeted intervention",
    items: [
      `1 ${deliverables.toLowerCase()}, 1 environment`,
      "Audit and prioritized recommendations",
      "2 enablement sessions",
      "No on-call coverage",
    ],
  },
  {
    name: "Program",
    price: "12 wks · fixed bid",
    tagline: "Full delivery engagement",
    items: [
      "Everything in Sprint",
      `Full ${services} delivery`,
      "5 components migrated",
      "30-day post-launch warranty",
    ],
    featured: true,
  },
  {
    name: "Embedded",
    price: "monthly retainer",
    tagline: "Ongoing delivery accountability",
    items: [
      "Everything in Program",
      "Senior engineer embedded",
      "24/7 on-call rotation",
      "Quarterly architecture review",
    ],
  },
];

export const SERVICES: Record<string, ServiceContent> = {
  cloud_transformation: {
    slug: "cloud_transformation",
    name: "Cloud Transformation",
    heroImage: "/images/unsplash/photo-1544197150-b99a580bb7a8-1600.webp",
    accent: "cyan",
    pills: ["AWS · Azure · GCP", "Landing zones", "FinOps", "Governance"],
    headline: { lead: "Cloud Transformation. Delivered with", emph: "accountability.", tail: "" },
    lede: "Strategy. Migration. Operations. One motion — landing zones, governance, and FinOps wired in from day one. 40–60% TCO reduction. 99.95% availability targets. Under 90 days to a production-ready landing zone.",
    narrative: {
      tagline: "Cloud modernization at enterprise scale",
      intro:
        "Cloud is infrastructure for the business — not a destination. We deliver end-to-end cloud transformation across AWS, Azure, and GCP. From architecture assessment through production deployment and ongoing platform operations. Multi-cloud depth across all three hyperscalers. No vendor lock-in. No delivery risk passed to the customer.",
      sectionTitle: "Why [[Intrastack.]]",
      sectionLede:
        "Every architecture decision is evaluated against performance, cost, security, and long-term operability. Cloud is not a migration project. It is a platform that must accelerate the business and outlive the people who built it.",
      pillars: [
        {
          title: "Architecture-Led Strategy",
          body: "Senior architects map the target operating model against your workload taxonomy and cost envelope. The strategy is not a deck. It is a roadmap with owners, decision points, and budgets attached.",
        },
        {
          title: "Hyperscaler Depth",
          body: "Certified architects across AWS, Azure, and GCP. We pick the platform that fits your latency, cost, and compliance envelope — not the one closest to hand.",
        },
        {
          title: "Workload-Fit Solutions",
          body: "Each workload gets the disposition that minimizes cost and risk against your timeline. Rehost, replatform, refactor, repurchase, retire, retain — chosen on evidence, not preference.",
        },
        {
          title: "Security and Compliance by Design",
          body: "Security baseline lands before workloads do. Controls codified. Evidence pipelined. FedRAMP, PCI DSS, HIPAA, SOC — frameworks treated as engineering constraints, not paperwork.",
        },
        {
          title: "FinOps Embedded",
          body: "Tagging strategy, budgets, showback by team and product — wired into the same workflow that ships workloads. Cost discipline is not a separate project.",
        },
        {
          title: "Operate, Not Hand Off",
          body: "Managed operations, optimization cadence, and capability transfer. The platform compounds value after we leave. Your team owns it on day 91.",
        },
      ],
      closing:
        "Cloud transformation is not a one-off project. It is the foundation the next decade of the business runs on. We build it that way.",
    },
    deliverables: [
      { letter: "A", title: "Cloud strategy", body: "Target operating model · workload taxonomy · cost envelope." },
      { letter: "B", title: "Landing zones", body: "Multi-account topology · IAM baseline · network and connectivity." },
      { letter: "C", title: "Migration factory", body: "Wave plan · runbooks · cutover playbook for each workload class." },
      { letter: "D", title: "FinOps + governance", body: "Tagging · budgets · guardrails · showback by team and product." },
    ],
    //can change the process banner
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Estate inventory · TCO baseline · readiness scoring." },
      { weeks: "Wk 3–4", title: "Design", body: "Target architecture · governance framework · decision log." },
      { weeks: "Wk 5–8", title: "Build", body: "Landing zones · IaC pipelines · first wave migrated." },
      { weeks: "Wk 9–10", title: "Migrate", body: "Phased waves · rollback protocols · cost and reliability tuning." },
      { weeks: "Wk 11–12", title: "Operate", body: "Capability transfer · runbooks · 30-day warranty." },
    ],
    tiers: tiers("workload", "transformation"),
  },
  devops_automation: {
    slug: "devops_automation",
    name: "DevOps & Automation",
    heroImage: "/images/unsplash/photo-1555066931-4365d14bab8c-1600.webp",
    accent: "mixed",
    pills: ["GitOps", "Terraform", "Observability", "12-week delivery"],
    headline: { lead: "DevOps and Platform Engineering.", emph: "Delivered.", tail: "" },
    lede: "Slow pipelines are not a technical problem. They are a competitive disadvantage. Pipelines, infrastructure-as-code, and observability installed and handed over in 12 weeks. 3–5× deployment frequency. 60% reduction in change failure rate. 70% reduction in MTTR.",
    narrative: {
      tagline: "Engineering delivery systems built to scale",
      intro:
        "Enterprise software delivery fails not because engineers lack capability. It fails because the platforms, pipelines, and processes surrounding them are fragmented, manual, and ungoverned. We eliminate that drag. We engineer delivery systems that are automated, observable, and built to scale with the organization.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "The result is not faster deployments in isolation. It is an engineering organization that compounds velocity over time — measured against DORA, governed by policy-as-code, and operated against SLOs.",
      pillars: [
        {
          title: "CI/CD Pipeline Modernization",
          body: "End-to-end delivery pipelines built on GitHub Actions, GitLab CI, Jenkins, or Azure DevOps. Policy-as-code. Automated security gates. Reusable workflow templates. Deployment frequency increases 3–5× following modernization.",
        },
        {
          title: "Infrastructure as Code",
          body: "Terraform, Pulumi, or AWS CDK for repeatable, auditable provisioning. Module libraries, state management, and drift detection wired into PRs. Environments become reproducible — not artisanal.",
        },
        {
          title: "Automated Quality Gates",
          body: "Unit, integration, SAST, DAST, and policy compliance — all enforced in pipeline. Change failure rate drops 60% when quality gates stop being optional.",
        },
        {
          title: "Platform Engineering Discipline",
          body: "Paved roads, golden paths, and reusable templates. Engineering teams adopt the standard because it is the lowest-friction option — not because of a mandate.",
        },
        {
          title: "Observability and Incident Response",
          body: "Datadog, Prometheus, Grafana, OpenTelemetry — instrumented against SLOs that match the business. Runbook automation reduces MTTR by 70%.",
        },
        {
          title: "12-Week Hand-Over",
          body: "Pipelines, modules, dashboards, alerts — installed, documented, handed over with 30-day warranty. Your team owns it on day 91. No retainer required.",
        },
      ],
      closing:
        "Delivery velocity is not a slogan. It is a property of the platform. We engineer it in.",
    },
    deliverables: [
      { letter: "A", title: "CI/CD pipelines", body: "Standardized GitHub Actions / GitLab CI / Jenkins · reusable templates per stack." },
      { letter: "B", title: "Infrastructure-as-code", body: "Terraform modules · environments split · drift detection wired into PRs." },
      { letter: "C", title: "Observability stack", body: "Metrics, logs, traces · SLO-aligned alert rules · dashboards on-call actually opens." },
      { letter: "D", title: "Runbook and training", body: "Written docs and 2 enablement sessions · your team owns it on day 91." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Audit current pipelines, infrastructure, observability, on-call." },
      { weeks: "Wk 3–4", title: "Design", body: "Target state · proposed stack · decision log." },
      { weeks: "Wk 5–8", title: "Build", body: "Pipelines, modules, dashboards, alerts." },
      { weeks: "Wk 9–10", title: "Migrate", body: "First 3 services migrated · DORA delta measured." },
      { weeks: "Wk 11–12", title: "Operate", body: "Training · runbook · 30-day warranty." },
    ],
    tiers: tiers("pipeline", "DevOps stack"),
  },
  ai_engineering: {
    slug: "ai_engineering",
    name: "AI & Machine Learning",
    heroImage: "/images/unsplash/photo-1677442136019-21780ecad995-1600.webp",
    accent: "yellow",
    pills: ["LLM ops", "RAG", "Evals", "Production-grade"],
    headline: { lead: "AI in production.", emph: "Not demos.", tail: "" },
    lede: "Model design, training pipelines, evaluation, and inference at scale. AI features engineered to survive contact with real users, real latency budgets, and real cost ceilings. Outcomes measured against the workflow KPI. Not the demo.",
    narrative: {
      tagline: "AI engineered as a production system",
      intro:
        "AI initiatives fail in production. Not because the models are weak — but because the systems around them were never engineered as production systems. We deliver AI and machine learning as a discipline. Use-case shaping. Data and training pipelines. Inference at scale. Evals. Cost and safety guardrails. Ongoing care.",
      sectionTitle: "Built to [[compound.]]",
      sectionLede:
        "Every engagement starts with the workflow KPI. If we cannot draw a line from the model to the number the business runs on, we do not build it.",
      pillars: [
        {
          title: "Predictive Analytics and ML",
          body: "Forecasting, churn, propensity, anomaly detection, computer vision, NLP. Production-grade models tied to the workflow KPI — not lab demos. Evals and retraining cadence built in.",
        },
        {
          title: "Outcomes, Not Activity",
          body: "AI features shipped against real users, real latency targets, and real cost envelopes. Outcomes measured, not promised. Improvements proved before they are claimed.",
        },
        {
          title: "Certified Across Google, AWS, and Azure AI",
          body: "Deep credentials across the major cloud AI platforms. We pick the stack that fits your latency, cost, and compliance envelope — not the one we used last.",
        },
        {
          title: "Eval-Driven Development",
          body: "Offline eval harness. Online metrics. Prompt and policy regression suites. Quality drift is caught before users see it — not after.",
        },
        {
          title: "Cost-Aware Inference",
          body: "Caching, batching, model routing, quota guardrails, open-model fallback. Token spend is a first-class engineering constraint — not a quarterly surprise on the bill.",
        },
        {
          title: "Owned End-to-End",
          body: "Use-case shaping through ongoing operation — one team, one shared backlog, one accountable engineer from week 1 to day 91 and beyond.",
        },
      ],
      closing:
        "AI is a production system. We deliver it that way — with the same engineering discipline as the rest of the platform.",
    },
    deliverables: [
      { letter: "A", title: "Use-case shaping", body: "Problem framing · success metrics · build-or-buy call per component." },
      { letter: "B", title: "Data and training pipeline", body: "Feature store · training infrastructure · reproducible runs · eval harness." },
      { letter: "C", title: "Inference stack", body: "Serving · caching · cost guardrails · A/B and shadow rollouts." },
      { letter: "D", title: "Eval and safety", body: "Offline evals · online metrics · prompt and policy regression suite." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Use cases · data audit · feasibility scoring." },
      { weeks: "Wk 3–4", title: "Design", body: "Architecture · model choices · eval criteria." },
      { weeks: "Wk 5–8", title: "Build", body: "Training, serving, evals end to end." },
      { weeks: "Wk 9–10", title: "Migrate", body: "Shadow then canary then production · cost and quality gates enforced." },
      { weeks: "Wk 11–12", title: "Operate", body: "Playbook · on-call · ongoing eval cadence." },
    ],
    tiers: tiers("use case", "AI stack"),
  },
  cybersecurity: {
    slug: "cybersecurity",
    name: "Cybersecurity",
    heroImage: "/images/unsplash/photo-1550751827-4bd374c3f58b-1600.webp",
    accent: "cyan",
    pills: ["SOC", "FedRAMP", "Zero Trust", "Audit-ready"],
    headline: { lead: "Cybersecurity Engineered, ", emph: "not layered.", tail: "" },
    lede: "Security is not a product you buy. It is an architecture you engineer. Identity, workloads, and data — hardened end to end. Zero-trust aligned to NIST SP 800-207. Compliance evidence falls out of the pipeline, not out of a binder.",
    narrative: {
      tagline: "Security and compliance as engineering",
      intro:
        "Enterprise security posture degrades silently. Cloud misconfiguration. Identity sprawl. Unpatched attack surfaces. Compliance frameworks that exist on paper but not in practice. We address that reality directly — with architecture-led programs that embed security into infrastructure, pipelines, and platforms rather than layering controls on top of systems never designed to be secure.",
      sectionTitle: "Hardened [[end to end.]]",
      sectionLede:
        "From cloud security architecture through compliance evidence and incident response — controls are codified, monitored, and proven continuously. MTTD measured. MTTC measured. Both trending the right direction.",
      pillars: [
        {
          title: "Cloud Security Architecture",
          body: "Comprehensive security architectures designed against your risk profile. Network, identity, workload, and data — engineered as one system. Hardened baselines land before workloads do.",
        },
        {
          title: "Compliance and Standards",
          body: "FedRAMP, PCI DSS, SOC, HIPAA, GDPR, CMMC, and PII protection. One codified control set, mapped to many frameworks. Audit evidence is collected continuously — not assembled the week before review.",
        },
        {
          title: "Zero-Trust Implementation",
          body: "NIST SP 800-207 aligned. Identity, endpoints, network, applications, and data — implemented as five coordinated pillars. Phish-resistant MFA. ZTNA. Micro-segmentation. Least privilege as a measurable property.",
        },
        {
          title: "Threat Modeling",
          body: "Asset inventory, trust boundaries, prioritized risk register. We start by knowing what we are defending and from whom. Controls follow from that — not the other way around.",
        },
        {
          title: "Detection and Response",
          body: "SIEM and SOAR wired up. Alert rules tuned to your environment. Runbooks rehearsed via tabletop. MTTD under 15 minutes. P1 response under 1 hour. When something goes wrong, the response is already written.",
        },
        {
          title: "Continuous Evidence",
          body: "Compliance evidence falls out of the pipeline — not out of a binder at audit time. Control mapping, automated proofs, and an evidence dashboard auditors accept.",
        },
      ],
      closing:
        "Identity. Workloads. Data. Hardened end to end. Defenses move from reactive scrambling to a measured operational property.",
    },
    deliverables: [
      { letter: "A", title: "Threat model", body: "Asset inventory · trust boundaries · prioritized risk register." },
      { letter: "B", title: "Hardened baseline", body: "Identity · network · workload · supply-chain controls codified." },
      { letter: "C", title: "Detection and response", body: "SIEM/SOAR wired · runbooks · tabletop exercise." },
      { letter: "D", title: "Compliance evidence", body: "SOC / HIPAA / FedRAMP / PCI DSS control mapping and continuous proof." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Posture audit · gap analysis against target framework." },
      { weeks: "Wk 3–4", title: "Design", body: "Control set · ownership · evidence pipeline." },
      { weeks: "Wk 5–8", title: "Build", body: "Controls implemented in code · monitors live." },
      { weeks: "Wk 9–10", title: "Migrate", body: "Tabletop · remediation sprint · stakeholder sign-off." },
      { weeks: "Wk 11–12", title: "Operate", body: "Runbooks · evidence dashboard · 30-day warranty." },
    ],
    tiers: tiers("control set", "security program"),
  },
  software_development: {
    slug: "software_development",
    name: "Software Development",
    heroImage: "/images/unsplash/photo-1517694712202-14dd9538aa97-1600.webp",
    accent: "yellow",
    pills: ["Greenfield", "Modernization", "Senior-only", "Owned end-to-end"],
    headline: { lead: "Custom platforms.", emph: "Built to scale. Owned end to end.", tail: "" },
    lede: "Greenfield builds, legacy modernization, and the connective tissue between them. Senior engineers. Opinionated defaults. Production-grade from the first release.",
    narrative: {
      tagline: "Software engineered for the team that will own it",
      intro:
        "Custom software is the platform the business runs on. We deliver web, mobile, and custom applications engineered to outlive their launch quarter. From the discovery spike through day-91 hand-over, the same senior engineers stay with you end to end. No agency layering. No juniors learning on your dollar.",
      sectionTitle: "What we [[build.]]",
      sectionLede:
        "Three delivery shapes covering the bulk of what business software needs to be. Scoped up front. Delivered with one team, one shared backlog, one accountable engineer.",
      pillars: [
        {
          title: "Web Development",
          body: "Brochure, e-commerce, or complex web applications. Production-grade architecture from the first commit. SEO, accessibility, and performance budgets are constraints — not afterthoughts.",
        },
        {
          title: "Custom Application Development",
          body: "Internal systems, customer portals, revenue-bearing platforms. Scalable, secure, and engineered for the operating team that inherits them in two years.",
        },
        {
          title: "Mobile Application Development",
          body: "iOS and Android — native or cross-platform. Chosen against your team, device matrix, and performance budget. Not against vendor preference.",
        },
        {
          title: "Architecture and Domain Model",
          body: "Service boundaries, data flow, and integration map drawn before code is written. Optimized for the team that owns this in two years — not the demo next week.",
        },
        {
          title: "Production-Ready by Default",
          body: "CI/CD, tests, observability, and security baseline are part of the build — not a phase-two retrofit. The first release is the production release.",
        },
        {
          title: "Senior-Only Delivery",
          body: "No juniors learning on your dollar. No agency layering. The engineers writing your code are the same engineers you scoped with.",
        },
      ],
      closing:
        "Software that keeps working long after the launch. Owned by your team. Engineered to last.",
    },
    deliverables: [
      { letter: "A", title: "Product discovery", body: "Outcomes · user journeys · MVP scope · technical spike." },
      { letter: "B", title: "Architecture", body: "Domain model · service boundaries · data and integration map." },
      { letter: "C", title: "Production build", body: "Code · tests · CI/CD · observability · security baseline." },
      { letter: "D", title: "Hand-over", body: "Documentation · runbooks · enablement · 30-day warranty." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Users, constraints, success metrics." },
      { weeks: "Wk 3–4", title: "Design", body: "Architecture · UX · sequencing." },
      { weeks: "Wk 5–8", title: "Build", body: "Iterative releases measured against real users." },
      { weeks: "Wk 9–10", title: "Harden", body: "Performance · security · operational readiness." },
      { weeks: "Wk 11–12", title: "Operate", body: "Cutover · training · warranty starts." },
    ],
    tiers: tiers("module", "software build"),
  },
  mobile_development: {
    slug: "mobile_development",
    name: "Mobile Development",
    heroImage: "/images/unsplash/photo-1512941937669-90a1b58e7e9c-1600.webp",
    accent: "cyan",
    pills: ["iOS", "Android", "React Native", "Flutter"],
    headline: { lead: "Mobile applications.", emph: "Engineered for retention.", tail: "" },
    lede: "Native and cross-platform mobile applications designed, built, and shipped end to end. CI, store releases, crash-free baselines, and accessibility wired in from the first sprint.",
    narrative: {
      tagline: "Mobile delivery as a discipline",
      intro:
        "Mobile is where customers and employees meet the business most often. We deliver iOS and Android applications engineered for the operating reality of mobile — store review cycles, device fragmentation, offline state, accessibility compliance, and the performance budgets that determine whether a user opens the app a second time.",
      sectionTitle: "End-to-end [[mobile delivery.]]",
      sectionLede:
        "Concept, design, build, store release, and the post-launch instrumentation that turns a launch into a product — under one team and one accountable engineer.",
      pillars: [
        {
          title: "Product and UX",
          body: "Audience research, jobs-to-be-done framing, flows, and clickable prototypes. The experience is engineered before a single screen ships to a real device.",
        },
        {
          title: "Native or Cross-Platform",
          body: "iOS, Android, React Native, or Flutter — selected against your team, device matrix, and performance budget. Not against vendor preference.",
        },
        {
          title: "Release Pipeline",
          body: "TestFlight, Play internal track, feature flags, phased rollouts. Releases are routine — not heroic.",
        },
        {
          title: "Accessibility and Offline-First",
          body: "VoiceOver, TalkBack, dynamic type, offline state and sync built in from the first sprint. Accessibility is a delivery requirement, not a remediation backlog.",
        },
        {
          title: "Crash-Free Baseline",
          body: "Crashlytics, performance traces, ANR monitoring, and analytics wired up before launch. The experience users actually have is measured — not assumed.",
        },
        {
          title: "Post-Launch Care",
          body: "A/B framework, monthly review cadence, and a backlog driven by the metrics — not by the loudest meeting.",
        },
      ],
      closing:
        "Mobile applications engineered for retention. Released routinely. Measured against the metrics that matter.",
    },
    deliverables: [
      { letter: "A", title: "Product and UX", body: "Flows · prototypes · store positioning." },
      { letter: "B", title: "Application build", body: "iOS and Android · accessibility · offline-first patterns." },
      { letter: "C", title: "Release pipeline", body: "TestFlight · Play internal · feature flags · phased rollout." },
      { letter: "D", title: "Post-launch", body: "Crashlytics · analytics · A/B framework · monthly review." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Audience · jobs-to-be-done · device matrix." },
      { weeks: "Wk 3–4", title: "Design", body: "UX · architecture · platform choice." },
      { weeks: "Wk 5–8", title: "Build", body: "Iterative beta releases on TestFlight and internal track." },
      { weeks: "Wk 9–10", title: "Harden", body: "Store assets · review prep · performance budget." },
      { weeks: "Wk 11–12", title: "Operate", body: "Store release · feature-flag rollout · warranty." },
    ],
    tiers: tiers("feature", "mobile build"),
  },
  it_services: {
    slug: "it_services",
    name: "Hardware & Software",
    heroImage: "/images/unsplash/photo-1558494949-ef010cbdcc31-1600.webp",
    accent: "mixed",
    pills: ["Procurement", "MDM", "Helpdesk", "Lifecycle"],
    headline: { lead: "Hardware, software, and lifecycle.", emph: "Managed as one estate.", tail: "" },
    lede: "Procurement, integration, and lifecycle management for the IT estate behind your product. One accountable partner across vendors, sites, and stacks — with audit-ready evidence at every refresh.",
    narrative: {
      tagline: "IT estate operated as a managed asset",
      intro:
        "IT estates accumulate quietly. Contracts overlap. Vendors multiply. Renewal calendars drift. We deliver a single operating model for procurement, integration, and lifecycle management — so the estate stops being a scattered set of contracts and becomes a measured, governed asset.",
      sectionTitle: "Why partner with [[Intrastack.]]",
      sectionLede:
        "One partner across procurement, integration, MDM, helpdesk, refresh, and disposal. Audit-ready evidence falls out of the operating model — not out of a binder at year end.",
      pillars: [
        {
          title: "Expansive Product Portfolio",
          body: "Servers, storage, networking, productivity software, cybersecurity tools, and endpoint hardware. Direct partner contracts across the catalog.",
        },
        {
          title: "Trusted Vendor Relationships",
          body: "Direct relationships with leading manufacturers and vendors. Better pricing. Faster availability. Access to roadmaps before they are public.",
        },
        {
          title: "Negotiated Rates",
          body: "Aggregated volume across our client portfolio translates into rates difficult to match buying alone. Pricing transparency is part of the contract.",
        },
        {
          title: "Workload-Fit Configurations",
          body: "We do not sell catalogs. Configurations are shaped against the actual workload, compliance envelope, and growth plan — not against quota.",
        },
        {
          title: "Scalable Operating Model",
          body: "From a single site to a global rollout, the same intake, deployment, and lifecycle process scales with you. No reinvention at each growth stage.",
        },
        {
          title: "Engineering-Backed Support",
          body: "Engineers — not just sales — sit between you and the vendors. Helpdesk, MDM, endpoint, and renewal calendar handled end to end.",
        },
        {
          title: "Forward-Planned Refresh",
          body: "Refresh cycles are planned against what the business will need — not against what is already obsolete. Lifecycle is forecast, not reactive.",
        },
        {
          title: "End-to-End Accountability",
          body: "Procurement, integration, MDM, helpdesk, refresh, disposal. One accountable partner across the entire IT lifecycle. One escalation path.",
        },
      ],
      closing:
        "The IT estate behind your product — operated as a managed asset, governed by evidence, accountable to a single partner.",
    },
    deliverables: [
      { letter: "A", title: "Estate inventory", body: "Assets · licenses · contracts · renewal calendar." },
      { letter: "B", title: "Procurement", body: "Vendor consolidation · negotiated rates · SOW templates." },
      { letter: "C", title: "Integration", body: "Identity · MDM · endpoint · network · helpdesk." },
      { letter: "D", title: "Lifecycle", body: "Refresh plan · disposal · compliance evidence." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Full estate scan · cost and risk baseline." },
      { weeks: "Wk 3–4", title: "Design", body: "Target operating model · vendor strategy." },
      { weeks: "Wk 5–8", title: "Build", body: "Consolidation · integrations · MDM rollout." },
      { weeks: "Wk 9–10", title: "Stabilize", body: "Helpdesk SLAs · monitoring · backlog burn-down." },
      { weeks: "Wk 11–12", title: "Operate", body: "Runbooks · evidence · ongoing review cadence." },
    ],
    tiers: tiers("site", "IT operation"),
  },
  staff_augmentation: {
    slug: "staff_augmentation",
    name: "Staffing Services",
    heroImage: "/images/unsplash/photo-1522071820081-009f0129c71c-1600.webp",
    accent: "yellow",
    pills: ["Senior engineers", "Embedded", "Paid trial week", "No bench"],
    headline: { lead: "Senior engineers.", emph: "Embedded in your delivery, not bolted on.", tail: "" },
    lede: "Vetted senior engineers and consultants embedded directly into your team. They ship inside your process, your CI, your on-call. No parallel agency timeline. No handoff theater. Under 14-day placement SLA on cleared roles.",
    narrative: {
      tagline: "Workforce solutions engineered for delivery accountability",
      intro:
        "Staffing fails when contractors are external to delivery. We embed senior engineers — Cloud Architects, IT Consultants, DevOps Specialists, Site Reliability Engineers, Security Engineers, and Project Managers — directly into your standups, your repositories, your on-call rotation. They are accountable to the same outcomes your team is.",
      sectionTitle: "The Intrastack [[workforce model.]]",
      sectionLede:
        "Vetted senior engineers who ship inside your process. Not a parallel agency timeline. Not a deck of resumes. Not a handoff in week ten. Replacement SLA under 14 days when a placement needs to change.",
      pillars: [
        {
          title: "Expert Talent Acquisition",
          body: "Senior recruiters with deep industry networks identify candidates who are actively delivering — not the resumes still circulating from last quarter's contracts.",
        },
        {
          title: "Rigorous Screening",
          body: "Candidates assessed for technical proficiency, delivery track record, and operating fit. The shortlist is two or three engineers — not twenty. Every finalist is hireable.",
        },
        {
          title: "Engagement-Fit Shapes",
          body: "Single specialist, embedded squad, or fractional senior — the engagement shape fits the need. Approach, timeline, and budget aligned at scope.",
        },
        {
          title: "Proven Delivery Record",
          body: "Track record across regulated and high-availability industries. References available — including from clients who renewed.",
        },
        {
          title: "Current Stack Coverage",
          body: "Access to current skill sets across the cloud, DevOps, security, AI, and data stacks. Including the niche capabilities in-house recruiting cannot filter for.",
        },
        {
          title: "Industry Context",
          body: "Deep understanding of the IT landscape. Engineers placed have shipped in adjacent territory — not learning your domain on your timeline.",
        },
        {
          title: "Quality-Driven, Time-Compressed",
          body: "Rigorous vetting compresses time-to-hire without compromising bar. Placement against cleared roles in under 14 days.",
        },
        {
          title: "Scalable Engagement",
          body: "From individual specialists to embedded squads — the model scales to your requirements without forcing you onto a fixed bench you are paying to idle.",
        },
      ],
      closing:
        "The right engineers, embedded in your delivery, accountable to your outcomes. That is the workforce model.",
    },
    deliverables: [
      { letter: "A", title: "Role shaping", body: "Target profile · scorecard · ramp plan." },
      { letter: "B", title: "Bench match", body: "2–3 finalists · paid trial week · go/no-go." },
      { letter: "C", title: "Embedded delivery", body: "Engineers in your standups, your CI, your on-call." },
      { letter: "D", title: "Knowledge transfer", body: "Documentation · pairing · explicit handoff plan from day one." },
    ],
    process: [
      { weeks: "Wk 1", title: "Scope", body: "Role · team context · success metrics." },
      { weeks: "Wk 2", title: "Match", body: "Shortlist · interviews · trial." },
      { weeks: "Wk 3", title: "Onboard", body: "Access · context · first PR in week one." },
      { weeks: "Mo 2+", title: "Deliver", body: "Embedded sprints · weekly review with Intrastack." },
      { weeks: "Exit", title: "Transition", body: "Knowledge transfer plan executed before rolloff." },
    ],
    processHeading: { lead: "How the", emph: "engagement", tail: "proceeds." },
    tiers: tiers("role", "team"),
  },
  cloud_migration: {
    slug: "cloud_migration",
    name: "Cloud Migration",
    heroImage: "/images/unsplash/photo-1451187580459-43490279c0fa-1600.webp",
    accent: "cyan",
    pills: ["6 Rs", "Wave plan", "Multi-cloud", "Phased cutover"],
    headline: { lead: "Cloud Migration.", emph: "Phased. Measured. De-risked.", tail: "" },
    lede: "Migration is not a single event. It is a phased program across AWS, Azure, and GCP — wave by wave, workload by workload, measured against business outcomes. No big-bang cutovers. No surprise bills. Under 90 days to a production-ready landing zone.",
    narrative: {
      tagline: "Migration as a managed program",
      intro:
        "We help organizations transition workloads to Azure, AWS, and GCP under a phased, evidence-led program. Each workload gets the disposition that minimizes cost and risk against the timeline. Cutovers are dry-run before they are scheduled. Cost discipline is wired in from the first wave.",
      sectionTitle: "How we [[migrate.]]",
      sectionLede:
        "Every organization has unique constraints. We tailor the strategy — then deliver it. Application by application. Environment by environment. Wave by wave.",
      pillars: [
        {
          title: "Custom Migration Strategy",
          body: "Senior architects develop the migration strategy against your business goals, technical constraints, and budget. From a single application to the entire estate — the roadmap minimizes disruption and prioritizes business outcomes.",
        },
        {
          title: "Azure Migration",
          body: "Microsoft partner-led Azure migrations across compute, data, and applications. Lift-and-shift through re-architecting — selected against the workload, not vendor preference.",
        },
        {
          title: "AWS Migration",
          body: "AWS migrations across data, applications, and entire data centers. Landing zones, well-architected baselines, and FinOps wired in before workloads land.",
        },
        {
          title: "GCP Migration",
          body: "Google Cloud Platform migrations across compute, BigQuery, and AI workloads. First-time migration or optimization of an existing footprint — both delivered to production discipline.",
        },
        {
          title: "6 Rs Disposition",
          body: "Rehost, replatform, refactor, repurchase, retire, retain. Each workload gets the disposition that minimizes cost and risk against your timeline.",
        },
        {
          title: "Cutover and Verification",
          body: "Pre and post checks. Rollback rehearsal. User sign-off. Every cutover is dry-run before it becomes a Friday-night incident.",
        },
      ],
      closing:
        "Wave by wave. Workload by workload. Measured against the business outcomes that justified the migration in the first place.",
    },
    deliverables: [
      { letter: "A", title: "Discovery and 6Rs", body: "Workload inventory · disposition · wave plan." },
      { letter: "B", title: "Migration factory", body: "Tooling · runbooks · automated cutover patterns." },
      { letter: "C", title: "Cutover and verify", body: "Pre/post checks · rollback rehearsal · user sign-off." },
      { letter: "D", title: "Optimize", body: "Right-size · reserve · idle-kill · monthly cost review." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Assess", body: "Application inventory · dependencies · TCO model." },
      { weeks: "Wk 3–4", title: "Design", body: "Wave plan · landing zones · cutover patterns." },
      { weeks: "Wk 5–8", title: "Build", body: "Factory · first 5 workloads migrated and verified." },
      { weeks: "Wk 9–10", title: "Migrate", body: "Remaining waves · source decommissioned." },
      { weeks: "Wk 11–12", title: "Operate", body: "Cost · reliability · hand-over." },
    ],
    tiers: tiers("wave", "migration"),
  },
  it_consulting: {
    slug: "it_consulting",
    name: "Cloud Strategy & Design",
    heroImage: "/images/unsplash/photo-1542744173-8e7e53415bb0-1600.webp",
    accent: "yellow",
    pills: ["Strategy", "Roadmap", "Vendor selection", "Steerco"],
    headline: { lead: "Cloud strategy.", emph: "Paired with a credible delivery plan.", tail: "" },
    lede: "Senior advisors who have delivered the work. Technology and business strategy paired with a sequenced, costed, ownership-assigned roadmap. The deck has a Monday-morning step — not a six-month restart.",
    narrative: {
      tagline: "Strategy engineered for execution",
      intro:
        "Cloud strategy fails when it stops at the deck. We deliver strategy that ships. Architecture, sequencing, organizational design, vendor selection, and steerco cadence — all paired with the delivery plan that turns the strategy into operating reality.",
      sectionTitle: "Why partner on [[strategy.]]",
      sectionLede:
        "Strategy paired with a credible delivery plan. Decision points, owners, and budgets attached to each milestone. Steerco cadence wired in before the first initiative kicks off.",
      pillars: [
        {
          title: "Architecture-Led Strategy",
          body: "Senior architects align cloud strategy with business objectives. Technology becomes a measured accelerator — not a perpetual cost center.",
        },
        {
          title: "Workload-Fit Solutions",
          body: "Tailored architectures designed against existing infrastructure, compliance envelope, and growth plan. No template strategy. No copy-paste recommendations.",
        },
        {
          title: "Multi-Cloud Depth",
          body: "Certified depth across AWS, Azure, and GCP. Multi-cloud strategies engineered to leverage each platform against the workload — not vendor preference.",
        },
        {
          title: "Strategic Alignment",
          body: "Every architecture decision is traceable to a business objective. The roadmap aligns to outcomes the board can measure.",
        },
        {
          title: "Architecture That Scales",
          body: "Senior architects translate goals into scalable cloud architectures. Designed for the operating team that inherits them — not just the launch.",
        },
        {
          title: "Security by Design",
          body: "Security and compliance are designed in from the first whiteboard session — not retrofitted after the steering committee asks about audit.",
        },
        {
          title: "Sequenced Implementation Path",
          body: "Detailed roadmap with decision points, owners, and budgets attached to each milestone. Execution path documented before the first dollar is spent.",
        },
        {
          title: "Accountable Partnership",
          body: "We are accountable for execution, not just advisory. From first cloud step through optimizing existing footprints — delivery accountability stays with us.",
        },
      ],
      closing:
        "Strategy that ships. A roadmap with owners. A delivery plan the business can plan against.",
    },
    deliverables: [
      { letter: "A", title: "Diagnostic", body: "Current state · constraints · stakeholder alignment." },
      { letter: "B", title: "Strategy", body: "Target state · investment thesis · sequencing." },
      { letter: "C", title: "Roadmap", body: "12-month plan · staffing · cost · decision points." },
      { letter: "D", title: "Execution support", body: "Vendor selection · steerco · monthly review." },
    ],
    process: [
      { weeks: "Wk 1–2", title: "Diagnose", body: "Interviews · data pulls · current-state map." },
      { weeks: "Wk 3–4", title: "Frame", body: "Options · tradeoffs · recommendation." },
      { weeks: "Wk 5–6", title: "Plan", body: "Roadmap · organizational model · cost case." },
      { weeks: "Wk 7–8", title: "Activate", body: "First initiative kickoff · vendor decisions." },
      { weeks: "Wk 9–12", title: "Govern", body: "Steerco cadence · KPIs · course-correction." },
    ],
    tiers: tiers("initiative", "strategy program"),
  },
};
