import type { SolutionContent } from "@/components/public/templates/solutionPage";

const std = (us: string): SolutionContent["compare"] => [
  { capability: "Time-to-production", us: "6 to 8 weeks", diy: "6 to 12 months" },
  { capability: "Best-practice defaults", us: "Day 1", diy: "Deferred" },
  { capability: "Multi-environment parity", us: "Same controls", diy: "Forks per team" },
  { capability: "On-call rotation", us: "Optional 24/7", diy: "Your engineers" },
  { capability: us, us: "Included", diy: "Scoped separately" },
];

export const SOLUTIONS: Record<string, SolutionContent> = {
  data_analytics: {
    slug: "data_analytics",
    name: "Data Analytics",
    heroImage: "/images/unsplash/photo-1551288049-bebda4e38f71-1600.webp",
    accent: "cyan",
    headline: { lead: "Data engineered into operational ", emph: "insight.", tail: "" },
    lede: "Unify sources. Model the business. Put trusted numbers in front of the people making decisions — without a six-month warehouse rebuild. Six weeks to first dashboard. Lineage and freshness wired in from day one.",
    accentPills: ["Snowflake", "BigQuery", "Redshift"],
    pills: ["dbt", "Airflow", "Looker", "Power BI"],
    narrative: {
      tagline: "Data engineered into operating decisions",
      intro:
        "Data analytics fails when the numbers leadership uses cannot be trusted. We deliver the full analytics stack — from data collection and preparation through advanced analysis and insight generation — engineered against the operating decisions the business actually makes. Tests, lineage, and freshness are part of the pipeline. Not an afterthought.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "Six capabilities. One delivery shape. Strategy through governance — engineered so the numbers the business runs on can be trusted by default.",
      pillars: [
        {
          title: "Data Strategy and Planning",
          body: "Senior architects partner with the business to develop a data strategy aligned to operating objectives. Existing infrastructure assessed. Source map produced. Governance framework defined — covering quality, consistency, and access control.",
        },
        {
          title: "Data Integration and Management",
          body: "Sources connected. Formats harmonized. Estate managed at rest and in motion. Analysts work from a single source of truth — not a maze of forks.",
        },
        {
          title: "Data Analysis and Insights",
          body: "From exploratory analysis to executive dashboards — raw signal engineered into the insights leadership actually uses to set direction.",
        },
        {
          title: "Visualization and Reporting",
          body: "Dashboards, scorecards, and self-serve patterns built around the questions the business actually asks — not the screenshots from the vendor demo.",
        },
        {
          title: "Predictive Analytics and ML",
          body: "Forecasting, churn, propensity, anomaly detection. Production-grade models tied to the workflow KPI. Evaluation harness and retraining cadence built in.",
        },
        {
          title: "Data Governance and Compliance",
          body: "Lineage, access control, retention, and audit trail wired into the same pipeline that delivers the dashboards. Compliance evidence falls out — not bolted on.",
        },
      ],
      closing:
        "Data engineered into operating decisions. Trusted by default. Governed continuously. Owned by the team that runs the business.",
    },
    why: [
      { icon: "★", title: "Trusted by default", body: "Tests, freshness, and lineage wired in." },
      { icon: "⚡", title: "Fast to first metric", body: "Reusable models · 6 weeks to first dashboard." },
      { icon: "⌘", title: "Warehouse-agnostic", body: "Same patterns on Snowflake, BigQuery, Redshift." },
      { icon: "⚑", title: "Stewarded", body: "Documentation and ownership baked in." },
    ],
    capabilities: [
      { title: "Ingestion", items: ["Source connectors", "CDC and batch", "PII handling"] },
      { title: "Warehouse", items: ["Layered modeling", "Cost guardrails", "Workload tuning"] },
      { title: "Transformation", items: ["dbt projects", "CI tests", "Reusable macros"] },
      { title: "BI and semantics", items: ["Looker / LookML or Power BI", "Metric layer", "Self-serve patterns"] },
      { title: "Activation", items: ["Reverse ETL", "Audience segmentation", "ML feature export"] },
      { title: "Governance", items: ["Lineage", "Access control", "Data contracts"] },
    ],
    stack: ["Snowflake", "BigQuery", "dbt", "Airflow", "Fivetran", "Looker", "Power BI", "Hightouch", "Great Expectations"],
    compare: std("Documentation and lineage"),
  },
  security_compliance: {
    slug: "security_compliance",
    name: "Security & Compliance",
    heroImage: "/images/unsplash/photo-1450101499163-c8848c66ca85-1600.webp",
    accent: "yellow",
    headline: { lead: "Continuous security. Built into your ", emph: "CI/CD.", tail: "" },
    lede: "Controls aligned to FedRAMP, PCI DSS, SOC, HIPAA, GDPR, and PII protection — implemented as code, evidenced continuously. The auditor finds receipts. Not surprises.",
    accentPills: ["FedRAMP", "PCI DSS", "SOC", "HIPAA", "GDPR"],
    pills: ["Vanta", "Drata", "OPA", "Wiz"],
    narrative: {
      tagline: "Security and compliance as engineering",
      intro:
        "Security is not a product you buy. It is an architecture you engineer. We design and implement robust security controls to safeguard the business against cyber threats and ensure compliance with industry standards and regulations. Controls live as code. Evidence is collected continuously. Auditors walk away with proof — not promises.",
      sectionTitle: "Hardened [[end to end.]]",
      sectionLede:
        "From cloud security architecture through compliance evidence and implementation — three pillars that move security from a binder of policies to a running, measured operational property.",
      pillars: [
        {
          title: "Cloud Security Architecture",
          body: "Comprehensive security architectures designed against your risk profile. Network, identity, workload, and data — engineered as one system. Hardened defenses land before workloads do.",
        },
        {
          title: "Compliance and Standards",
          body: "FedRAMP, PCI DSS, SOC, HIPAA, GDPR, CMMC, and PII protection. Frameworks treated as engineering constraints. Compliance achieved and maintained — not assembled the week before review.",
        },
        {
          title: "Implementation Discipline",
          body: "Designs translated into running systems. Firewalls configured. Intrusion detection deployed. Encryption implemented. Measures deployed effectively — not documented in slides.",
        },
        {
          title: "Evidence as Code",
          body: "Controls and proofs live in the same repository. Drift is detected automatically. The evidence pipeline never goes stale because nobody refreshed the spreadsheet.",
        },
        {
          title: "Framework Cross-Mapping",
          body: "One codified control set. Mapped to many frameworks. New attestations added to existing FedRAMP work without duplicating effort or rebuilding from zero.",
        },
        {
          title: "Continuous Posture",
          body: "Drift detection. Live posture dashboards. Quarterly tabletops. Audit week becomes a routine read of the dashboard — not a fire drill.",
        },
      ],
      closing:
        "Identity. Workloads. Data. Hardened end to end. Defenses become a quiet, instrumented, measured operational property.",
    },
    why: [
      { icon: "★", title: "Evidence as code", body: "Controls and proof live in the same repo." },
      { icon: "⚡", title: "Audit-fast", body: "Weeks, not quarters, to a clean Type II." },
      { icon: "⌘", title: "Framework-agnostic", body: "One control set · mapped to many frameworks." },
      { icon: "⚑", title: "Continuous", body: "Drift detection · live posture · no surprises." },
    ],
    capabilities: [
      { title: "Control set", items: ["Codified controls", "Owner per control", "Mapped to frameworks"] },
      { title: "Identity and access", items: ["SSO and MFA", "JIT access", "Quarterly reviews"] },
      { title: "Workload security", items: ["Hardened baselines", "Image scanning", "Runtime detection"] },
      { title: "Data protection", items: ["Encryption", "DLP", "Retention policy"] },
      { title: "Detection and response", items: ["SIEM/SOAR", "Runbooks", "Tabletop exercises"] },
      { title: "Evidence pipeline", items: ["Auto-collected", "Time-stamped", "Auditor-ready"] },
    ],
    stack: ["Vanta", "Drata", "OPA", "Kyverno", "Wiz", "Falco", "Snyk", "1Password", "Okta"],
    compare: std("Framework cross-mapping"),
  },
  business_continuity: {
    slug: "business_continuity",
    name: "Business Continuity",
    heroImage: "/images/unsplash/photo-1597733336794-12d05021d510-1600.webp",
    accent: "mixed",
    headline: { lead: "Recovery measured in", emph: "minutes.", tail: "Not days." },
    lede: "Disaster recovery and resilience engineering that holds when it matters. Tested RTO and RPO targets. Real failover drills. Runbooks engineers actually open. Recovery as a contractual property, not an aspiration.",
    accentPills: ["RTO < 1h", "RPO < 5m", "Multi-region"],
    pills: ["Velero", "AWS Backup", "Azure Site Recovery", "GCP Backup & DR"],
    narrative: {
      tagline: "Resilience as a tested operational property",
      intro:
        "Business continuity fails when the plan is never tested. We deliver comprehensive continuity solutions across Azure, AWS, and GCP — engineered to protect critical data and applications. Recovery from natural disaster, cyber attack, or hardware failure becomes a measured property, not an optimistic one in a deck.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "Six pillars that move BC/DR from a hopeful binder to a tested, measured system. Drilled quarterly. Instrumented continuously. Aligned to the frameworks the auditor cares about.",
      pillars: [
        {
          title: "Backup and Recovery",
          body: "Backup solutions engineered to protect critical data and applications against loss or corruption. Automated schedules. Retention policies. Immutable copies. Cross-region replication. Compliance maintained. Data loss minimized.",
        },
        {
          title: "BC/DR Programs",
          body: "BC/DR plans designed against your operating model and risk profile. Redundant infrastructure and failover mechanisms ensure continuous availability. Regular drills validate the plan — and surface gaps before incidents do.",
        },
        {
          title: "High Availability",
          body: "HA engineered to minimize downtime and ensure continuous access. Auto-scaling. Load balancing. Geographic redundancy. Proactive monitoring catches issues before they impact operations.",
        },
        {
          title: "Data Replication and Synchronization",
          body: "Replication and synchronization across geographic locations. Asynchronous or synchronous techniques selected against the workload. Failover and failback engineered to transition cleanly between primary and secondary regions.",
        },
        {
          title: "Cloud-Based Disaster Recovery",
          body: "Azure Site Recovery, AWS Disaster Recovery, and GCP Disaster Recovery — implemented to replicate and recover workloads. Automated failover and failback. Cross-region replication. Multi-zone deployments.",
        },
        {
          title: "Quarterly Drills",
          body: "Failover exercises every quarter. Post-mortems on every drill. A continuous-improvement loop that makes the next exercise smoother than the last. The first failover is never the production one.",
        },
      ],
      closing:
        "Recovery as a contractual property. RTO and RPO targets engineered into the platform — not asserted on a slide.",
    },
    why: [
      { icon: "★", title: "Tested, not assumed", body: "Quarterly failover drills · post-mortems." },
      { icon: "⚡", title: "Recover in minutes", body: "RTO/RPO targets contractual, not aspirational." },
      { icon: "⌘", title: "Multi-cloud capable", body: "Same patterns across AWS, Azure, GCP." },
      { icon: "⚑", title: "Compliance-aligned", body: "Maps to SOC and HIPAA controls." },
    ],
    capabilities: [
      { title: "BIA and risk", items: ["Critical-process map", "RTO/RPO per tier", "Risk register"] },
      { title: "Backup", items: ["Immutable copies", "Cross-region", "Tested restores"] },
      { title: "DR strategy", items: ["Pilot light · warm standby", "Cross-region replication", "Failover runbooks"] },
      { title: "Drills", items: ["Quarterly exercises", "Post-mortem template", "Continuous improvement"] },
      { title: "Communications plan", items: ["Status page", "Stakeholder tree", "Customer comms templates"] },
      { title: "Evidence", items: ["Drill reports", "Restore proofs", "Audit-ready"] },
    ],
    stack: ["Velero", "AWS Backup", "Azure Site Recovery", "Google Cloud Backup and DR", "Veeam", "Terraform", "Statuspage", "PagerDuty"],
    compare: std("Quarterly failover drill"),
  },
  aws: {
    slug: "aws",
    name: "AWS",
    heroImage: "/images/unsplash/photo-1523474438810-b04a2480633c-1600.webp",
    accent: "yellow",
    headline: { lead: "AWS, Engineered for production from ", emph: "day one.", tail: "" },
    lede: "Deep certified expertise across the AWS catalog. Landing zones. Well-Architected reviews. FinOps embedded. Production patterns that age well — not demo-ware from the latest re:Invent.",
    accentPills: ["AWS Certified", "Well-Architected", "FinOps"],
    pills: ["Control Tower", "EKS", "Lambda", "RDS"],
    narrative: {
      tagline: "AWS engineered to production discipline",
      intro:
        "Amazon Web Services is a leading cloud platform. Our AWS practice helps the business harness that depth to accelerate delivery and drive transformation — whether migrating data, applications, or entire data centers, or operating production workloads day to day. AWS is not a project. It is the platform the next decade runs on.",
      sectionTitle: "Why partner on [[AWS.]]",
      sectionLede:
        "Certified depth across every AWS domain. Paired with the production patterns and FinOps discipline that keep cloud bills from becoming a quarterly surprise.",
      pillars: [
        {
          title: "AWS-Certified Specialists",
          body: "Certified architects, security specialists, and data engineers across every AWS domain. The engineers on your account are credentialed — and have shipped the patterns we recommend.",
        },
        {
          title: "Well-Architected Reviews",
          body: "Six pillars — operational excellence, security, reliability, performance, cost, sustainability — scored against the AWS framework with a prioritized improvement plan attached.",
        },
        {
          title: "Multi-Account from Day One",
          body: "Control Tower, AFT pipelines, SCPs, and organization policies set up so the second, fifth, and twentieth account follow the same baseline as the first. Not a hand-managed sprawl.",
        },
        {
          title: "FinOps Embedded",
          body: "Tagging strategy. Cost and Usage Reports. Savings Plans. Right-sizing reviews wired into the same workflow that ships workloads. Cost discipline is not a separate project.",
        },
        {
          title: "Production Reference Patterns",
          body: "Reference architectures for EKS, Lambda, Aurora, and the rest of the catalog. The ones that survive contact with real traffic — not the demo-ware from the latest re:Invent.",
        },
        {
          title: "Security by Default",
          body: "IAM Identity Center, GuardDuty, Security Hub, and KMS strategy configured before workloads land. Hardened from the first commit. Not retrofitted after audit week.",
        },
      ],
      closing:
        "AWS engineered to production discipline. Patterns that age well. Bills that do not surprise. A platform the business can plan against.",
    },
    why: [
      { icon: "★", title: "Certified depth", body: "AWS-certified specialists across every domain." },
      { icon: "⚡", title: "Well-architected", body: "Six pillars · scored · improvement plan." },
      { icon: "⌘", title: "Multi-account from day 1", body: "Control Tower · SCPs · guardrails." },
      { icon: "⚑", title: "Cost-conscious", body: "FinOps embedded, not bolted on." },
    ],
    capabilities: [
      { title: "Landing zone", items: ["Control Tower", "AFT pipelines", "Org policies"] },
      { title: "Compute and containers", items: ["EKS / ECS", "Lambda patterns", "Karpenter"] },
      { title: "Data services", items: ["RDS / Aurora", "DynamoDB", "Redshift / Athena"] },
      { title: "Networking", items: ["TGW · PrivateLink", "Route 53 design", "Edge and WAF"] },
      { title: "Security", items: ["IAM Identity Center", "GuardDuty / Security Hub", "KMS strategy"] },
      { title: "FinOps", items: ["Tagging", "Cost and Usage Reports", "Savings plans"] },
    ],
    stack: ["Control Tower", "EKS", "Lambda", "Aurora", "Redshift", "CloudFront", "GuardDuty", "Terraform", "CDK"],
    compare: std("Certified specialists and escalation paths"),
  },
  azure: {
    slug: "azure",
    name: "Azure",
    heroImage: "/images/unsplash/photo-1451187580459-43490279c0fa-1600.webp",
    accent: "cyan",
    headline: { lead: "Enterprise Azure, Hybrid-aware.", emph: " Audit-ready.", tail: "" },
    lede: "Landing zones, identity, and FinOps engineered for organizations already operating in Microsoft. Production-grade defaults — not a wiki of half-applied policies.",
    accentPills: ["Azure Certified", "Landing Zones", "Entra ID"],
    pills: ["AKS", "App Service", "Functions", "Cosmos DB"],
    narrative: {
      tagline: "Azure engineered for the enterprise estate",
      intro:
        "As a Microsoft partner, we deliver Azure solutions that leverage the platform's depth against the operating reality of the enterprise. From identity and landing zones through AKS, App Service, and the full data stack — production-grade Azure engineered to fit how your enterprise already operates.",
      sectionTitle: "Why partner on [[Azure.]]",
      sectionLede:
        "Enterprise-scale defaults. Identity-first architecture. Hybrid awareness. The Azure estate operates as a managed platform — not as a sprawl of subscriptions.",
      pillars: [
        {
          title: "Identity-First Architecture",
          body: "Entra ID and Conditional Access are the keystone. PIM for privileged access. Federation patterns that match how the enterprise actually operates. Policies that hold up under audit.",
        },
        {
          title: "Enterprise-Scale Landing Zones",
          body: "Production-ready in weeks. Not quarters. Management groups, policy initiatives, and Bicep or Terraform scaffolds that scale from a single subscription to a global estate without rework.",
        },
        {
          title: "Hybrid-Aware",
          body: "Azure Arc, ExpressRoute, on-premises patterns native to the design. We meet your existing data centers, AVS clusters, and edge sites where they are — not where the cloud-only reference architecture wishes they were.",
        },
        {
          title: "Defender-Wired",
          body: "Defender for Cloud configured, tuned, and alerting against the workloads that matter. Paired with Sentinel for the SIEM layer when scale demands it.",
        },
        {
          title: "Application Modernization",
          body: "AKS, App Service, Functions, and Container Apps — chosen against your team's operating model. Lift, replatform, or rebuild selected based on what each workload actually needs.",
        },
        {
          title: "FinOps and Governance",
          body: "Cost Management. Tag governance. Reservations. Showback by team. Wired in early so the bill is explained — not investigated.",
        },
      ],
      closing:
        "Enterprise Azure engineered for how the organization actually runs. A platform — not a subscription sprawl.",
    },
    why: [
      { icon: "★", title: "Identity-first", body: "Entra ID and Conditional Access · the keystone." },
      { icon: "⚡", title: "Landing zones in weeks", body: "Enterprise-scale baseline · production-ready." },
      { icon: "⌘", title: "Hybrid-aware", body: "Arc, ExpressRoute, on-prem patterns native." },
      { icon: "⚑", title: "Defender-wired", body: "Defender for Cloud configured, tuned, alerting." },
    ],
    capabilities: [
      { title: "Landing zone", items: ["Enterprise-scale", "Management groups", "Policy initiatives"] },
      { title: "Identity", items: ["Entra ID", "Conditional Access", "PIM"] },
      { title: "Compute", items: ["AKS", "App Service", "Functions"] },
      { title: "Data", items: ["Azure SQL", "Cosmos DB", "Synapse"] },
      { title: "Networking", items: ["Hub-spoke", "Firewall and WAF", "Private DNS"] },
      { title: "FinOps", items: ["Cost Management", "Tag governance", "Reservations"] },
    ],
    stack: ["AKS", "App Service", "Entra ID", "Azure SQL", "Cosmos DB", "Defender", "Bicep", "Terraform"],
    compare: std("Defender and Entra hardening"),
  },
  kubernetes: {
    slug: "kubernetes",
    name: "Kubernetes",
    heroImage: "/images/unsplash/photo-1605745341112-85968b19335b-1600.webp",
    accent: "cyan",
    headline: { lead: "Kubernetes as a", emph: "managed platform.", tail: "Not a science project." },
    lede: "Productionized container platforms. Multi-cluster. Multi-tenant. GitOps-ready. On-call rotation pre-wired. Engineered for operational reality — not the conference talk.",
    accentPills: ["EKS", "AKS", "GKE"],
    pills: ["Argo", "Flux", "Istio", "OPA"],
    narrative: {
      tagline: "Kubernetes engineered as production infrastructure",
      intro:
        "Kubernetes is powerful — and unforgiving to teams treating it as a side project. We deliver production-grade container platforms that respect operational reality. Hardened defaults. GitOps from day one. Observability that catches problems before users do. On-call rotation pre-wired when we hand over.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "Six things every production Kubernetes platform needs — bundled by default. Not assembled from a YAML safari spanning twelve open-source projects with different release cadences.",
      pillars: [
        {
          title: "Production-Grade Defaults",
          body: "Hardened baseline. Image scanning. Pod security standards. Network policy. All configured before the first workload lands. No 'we will secure it after MVP' moments.",
        },
        {
          title: "GitOps from Day One",
          body: "Argo CD or Flux installed with the cluster — not as a phase-two project. Drift detection. Rollback in seconds. A single source of truth that survives operator turnover.",
        },
        {
          title: "Multi-Cloud Parity",
          body: "Same controls, same policies, same pipelines on EKS, AKS, and GKE. No per-cloud forks. No rebuilds when leadership adds a second provider for negotiation leverage.",
        },
        {
          title: "Observability End-to-End",
          body: "Prometheus, Grafana, Loki, Tempo. Wired up. Dashboards tuned to your services. Alert rules that catch real problems instead of paging at 3 AM for noise.",
        },
        {
          title: "Service Mesh When Justified",
          body: "Istio or Linkerd with mTLS by default — but only when the complexity is justified by the traffic patterns. We do not add mesh because the deck called for it.",
        },
        {
          title: "On-Call Pre-Wired",
          body: "Optional 24/7 SRE rotation. We hold the pager. The runbook is one our team wrote — not one we inherited and hope still works.",
        },
      ],
      closing:
        "A platform engineered to run on Monday. Not a stack that needs three months of glue code before it earns its production status.",
    },
    why: [
      { icon: "★", title: "Production-grade defaults", body: "Hardened baseline · no day-one surprises." },
      { icon: "⚡", title: "GitOps from day one", body: "Argo or Flux · drift detection · rollback in seconds." },
      { icon: "⌘", title: "Multi-cloud parity", body: "Same controls on EKS, AKS, GKE." },
      { icon: "⚑", title: "SRE on call", body: "Optional 24/7 — we hold the pager." },
    ],
    capabilities: [
      { title: "Platform foundations", items: ["Landing zone setup", "VPC, subnets, IAM", "Cluster baseline (hardened)"] },
      { title: "CI/CD and GitOps", items: ["Argo CD / Flux install", "Pipeline templates", "Secrets management"] },
      { title: "Observability", items: ["Prometheus and Grafana", "Centralized logs", "Tracing (OTel)"] },
      { title: "Security and policy", items: ["OPA / Kyverno", "Image scanning", "Network policy"] },
      { title: "Service mesh", items: ["Istio / Linkerd", "mTLS by default", "Traffic routing"] },
      { title: "Cost and capacity", items: ["Karpenter / autoscaler", "Showback by team", "Right-sizing"] },
    ],
    stack: ["Argo CD", "Helm", "Terraform", "Prometheus", "Grafana", "Loki", "Tempo", "OPA", "Kyverno", "Istio", "Karpenter", "cert-manager"],
    compare: std("GitOps, mesh, and policy bundled"),
  },
  ai_automation: {
    slug: "ai_automation",
    name: "AI Automation",
    heroImage: "/images/unsplash/photo-1620712943543-bcc4688e7485-1600.webp",
    accent: "mixed",
    headline: { lead: "AI engineered where it", emph: "compounds.", tail: "" },
    lede: "Workflow automation powered by LLMs and classical ML. We deliver against the workflows where AI moves the number — and decline the ones where it does not. Eval-driven. Cost-aware. Owned end to end.",
    accentPills: ["LLM ops", "RAG", "Agents"],
    pills: ["LangGraph", "OpenAI", "Anthropic", "vLLM"],
    narrative: {
      tagline: "AI in production. Not demos.",
      intro:
        "We deliver AI and machine learning services engineered for measurable business outcomes — not science fair projects. Predictive analytics, retrieval-augmented generation, agentic workflows, or classical ML embedded into operating processes. Delivered against the workflow KPI. Evals and cost guardrails built in.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "Six properties that separate AI features that compound from ones that quietly get turned off after six months. Bundled by default. Measured continuously.",
      pillars: [
        {
          title: "Outcomes, Not Demos",
          body: "Every engagement starts with the workflow KPI the model is moving. If we cannot draw a line from the model to the number — we do not build it.",
        },
        {
          title: "Eval-Driven Development",
          body: "Offline eval harness. Online metrics. Regression suites for prompts and policies. Quality drift is caught before users see it. Improvements proved before they are claimed.",
        },
        {
          title: "Cost-Aware Inference",
          body: "Budgets. Caching. Model routing. Open-model fallback. Token spend is a first-class engineering constraint — not a quarterly surprise on the bill.",
        },
        {
          title: "Safe by Default",
          body: "PII handling. Policy enforcement. Audit trail. Wired in from the first prototype. Compliance and trust scale with the rollout.",
        },
        {
          title: "Certified on Major Platforms",
          body: "Google, AWS, and Azure AI credentials across the team. We pick the platform that fits your latency, cost, and compliance envelope — not the one we used last.",
        },
        {
          title: "Owned End-to-End",
          body: "Use-case shaping, data, training, serving, evals, ongoing care. One team. One shared backlog. One accountable engineer from week 1 to day 91.",
        },
      ],
      closing:
        "AI engineered as a production system. Not a science project. Owned end to end. Accountable to the workflow KPI.",
    },
    why: [
      { icon: "★", title: "Outcomes, not demos", body: "Measured against the workflow KPI." },
      { icon: "⚡", title: "Eval-driven", body: "Offline and online evals · regressions caught." },
      { icon: "⌘", title: "Cost-aware", body: "Budgets · caching · routing · open-model fallback." },
      { icon: "⚑", title: "Safe by default", body: "Policy, PII handling, audit trail." },
    ],
    capabilities: [
      { title: "Use-case shaping", items: ["ROI model", "Scope contract", "Success metrics"] },
      { title: "RAG and knowledge", items: ["Ingestion", "Retrieval quality", "Freshness"] },
      { title: "Agents and workflows", items: ["Tool calling", "Multi-step plans", "Human-in-the-loop"] },
      { title: "Evals", items: ["Offline harness", "Online metrics", "Regression suite"] },
      { title: "Serving", items: ["Routing", "Caching", "Cost guardrails"] },
      { title: "Governance", items: ["PII policy", "Audit log", "Model lineage"] },
    ],
    stack: ["LangGraph", "OpenAI", "Anthropic", "vLLM", "Qdrant", "Weaviate", "Ragas", "LiteLLM"],
    compare: std("Eval harness and cost guardrails"),
  },
  enterprise_security: {
    slug: "enterprise_security",
    name: "Enterprise Security",
    heroImage: "/images/unsplash/photo-1563013544-824ae1b704d3-1600.webp",
    accent: "cyan",
    headline: { lead: "Zero trust. Edge to data.", emph: " Single architecture.", tail: "" },
    lede: "Edge, workload, identity, and data — designed and implemented as one architecture. Measured against time-to-detect and time-to-contain. MTTD under 15 minutes. P1 response under 1 hour.",
    accentPills: ["Zero Trust", "SASE", "XDR"],
    pills: ["Okta", "CrowdStrike", "Wiz", "Zscaler"],
    narrative: {
      tagline: "Enterprise security engineered as one architecture",
      intro:
        "Enterprise security delivered as one architecture — identity, edge, workload, and data — designed together, instrumented together, and measured against the metrics that matter: time-to-detect and time-to-contain. NIST SP 800-207 aligned. Zero-trust as a measurable operational property.",
      sectionTitle: "Why one [[architecture wins.]]",
      sectionLede:
        "Six properties that separate security programs that work from ones that collect tools and dashboards but never catch the thing that matters.",
      pillars: [
        {
          title: "One Architecture",
          body: "Edge, workload, identity, and data — designed as one system. Not bolted together from four vendors who never met. Consistent policy. Consistent telemetry. Consistent enforcement.",
        },
        {
          title: "Identity-Centered",
          body: "Phish-resistant MFA. Just-in-time access. Least privilege as a measurable property — not an aspiration. PAM for the keys to the kingdom. Quarterly access reviews that surface what drifted.",
        },
        {
          title: "Detect Fast",
          body: "MTTD measured, tuned, and improving month over month. Detection content sourced from real threat intel and your environment's telemetry — not a vendor's default rule pack.",
        },
        {
          title: "Evidence-Driven",
          body: "Findings flow back into controls. Controls produce proof. Proof flows into the same audit pipeline. One loop. Not three separate spreadsheets.",
        },
        {
          title: "Zero-Trust Reference Architecture",
          body: "ZTNA, SWG, CASB, EDR/XDR — chosen against your actual access patterns and threat model. Not a slide labeled 'zero trust' with the same flat network underneath.",
        },
        {
          title: "Board-Level Reporting",
          body: "Metrics that translate to the audit committee and the board. Control coverage. Incident rate. MTTD. MTTC. Exception trend. The story the CISO can defend.",
        },
      ],
      closing:
        "Security becomes a measured operational property. Not a defensive document the team hopes never gets tested.",
    },
    why: [
      { icon: "★", title: "One architecture", body: "Edge to workload to data — consistent." },
      { icon: "⚡", title: "Detect fast", body: "MTTD measured · tuned · improving monthly." },
      { icon: "⌘", title: "Identity-centered", body: "Phish-resistant MFA · JIT · least privilege." },
      { icon: "⚑", title: "Evidence-driven", body: "Findings to controls to proof in one loop." },
    ],
    capabilities: [
      { title: "Identity", items: ["Phish-resistant MFA", "PAM / JIT", "Quarterly reviews"] },
      { title: "Edge / SASE", items: ["ZTNA", "SWG", "CASB"] },
      { title: "Workload", items: ["EDR / XDR", "Hardened images", "Runtime detection"] },
      { title: "Data", items: ["Classification", "DLP", "Tokenization where needed"] },
      { title: "Detection and response", items: ["SIEM/SOAR", "Threat intel", "Tabletop"] },
      { title: "Governance", items: ["Policy as code", "Exception tracking", "Board-level metrics"] },
    ],
    stack: ["Okta", "CrowdStrike", "Wiz", "Zscaler", "Splunk", "Sentinel", "1Password", "HashiCorp Vault"],
    compare: std("Zero-trust reference architecture"),
  },
  cicd_transformation: {
    slug: "cicd_transformation",
    name: "CI/CD Transformation",
    heroImage: "/images/unsplash/photo-1556075798-4825dfaaf498-1600.webp",
    accent: "yellow",
    headline: { lead: "Pipelines engineered to compress the ", emph: "delivery cycle.", tail: "" },
    lede: "Platform engineering done right. Paved roads. Golden paths. A developer experience where shipping is the default action. 3–5× deployment frequency. 60% reduction in change failure rate. 70% reduction in MTTR.",
    accentPills: ["Platform Eng", "GitOps", "Backstage"],
    pills: ["GitHub Actions", "GitLab CI", "Argo CD", "Buildkite"],
    narrative: {
      tagline: "CI/CD engineered to compound delivery velocity",
      intro:
        "Slow pipelines are not a technical problem. They are a competitive disadvantage. We replace bespoke per-team pipelines with a paved road: golden paths, reusable workflows, and a developer experience where shipping is the default action — not a friction-filled exception.",
      sectionTitle: "What we [[deliver.]]",
      sectionLede:
        "Six properties that separate CI/CD transformation from a yak-shave. Bundled by default. Measured against DORA. Tuned to the constraint actually slowing delivery down.",
      pillars: [
        {
          title: "Paved Road, Not a Maze",
          body: "Golden paths. Reusable workflow templates. Documentation engineering teams actually use. New services adopt the standard because it is the lowest-friction option — not because of a mandate.",
        },
        {
          title: "Fast Feedback by Default",
          body: "Most pipelines under 10 minutes. On purpose. Caching, parallelization, hermetic builds, flake detection — engineers learn whether the change is good while it is still in their head.",
        },
        {
          title: "Same Shape Everywhere",
          body: "One pipeline language across stacks. A frontend engineer reads a backend pipeline. A backend engineer reads a data pipeline. Onboarding compresses from weeks to days.",
        },
        {
          title: "Continuous Integration and Deployment",
          body: "Code flows through automated quality gates — integrating and deploying with measured discipline. Software in a state of perpetual evolution. Always current. Always resilient.",
        },
        {
          title: "GitOps Deployment",
          body: "Argo CD or Flux for delivery. Progressive rollouts. Automated rollback in seconds. The runbook for 'something broke in production' is one command — not a war room.",
        },
        {
          title: "Measured by DORA",
          body: "Cycle time. Deployment frequency. Change failure rate. MTTR. Instrumented and visible. Improvement is not claimed. The dashboard reports it.",
        },
      ],
      closing:
        "A platform that respects engineers. A delivery system the business can plan against. Velocity that compounds over time.",
    },
    why: [
      { icon: "★", title: "Paved road, not a maze", body: "Golden paths · templates · docs." },
      { icon: "⚡", title: "Fast feedback", body: "Most pipelines under 10 minutes, on purpose." },
      { icon: "⌘", title: "Same shape everywhere", body: "One pipeline language, many stacks." },
      { icon: "⚑", title: "Measured", body: "DORA · cycle time · change-failure rate." },
    ],
    capabilities: [
      { title: "Build", items: ["Reusable workflows", "Caching", "Hermetic builds"] },
      { title: "Test", items: ["Parallelization", "Flake detection", "Coverage gates"] },
      { title: "Deploy", items: ["GitOps", "Progressive delivery", "Rollback in seconds"] },
      { title: "Platform", items: ["Backstage", "Service catalog", "Templates"] },
      { title: "Observability", items: ["Pipeline metrics", "DORA dashboards", "SLOs"] },
      { title: "Governance", items: ["Policy as code", "Approvals", "Audit trail"] },
    ],
    stack: ["GitHub Actions", "GitLab CI", "Argo CD", "Buildkite", "Backstage", "Renovate", "Trivy", "Cosign"],
    compare: std("DORA metrics live and tuned"),
  },
  hybrid_cloud: {
    slug: "hybrid_cloud",
    name: "Hybrid Cloud",
    heroImage: "/images/unsplash/photo-1573164713714-d95e436ab8d6-1600.webp",
    accent: "cyan",
    headline: { lead: "On-premises and cloud. One fabric. ", emph: "One operating model.", tail: "" },
    lede: "Workload portability. Identity continuity. A single operating model across data centers, edge sites, and public clouds. Audit-ready. FinOps-governed. Engineered for placement based on cost and gravity — not on default.",
    accentPills: ["Anthos", "Arc", "Outposts"],
    pills: ["Terraform", "Crossplane", "VMware", "OpenStack"],
    narrative: {
      tagline: "Hybrid estate operated as a managed platform",
      intro:
        "We deliver managed solutions across Azure, AWS, and GCP — and the on-premises estates beside them. Our hybrid practice ensures cloud environments operate at production-grade performance under one operating model. The business focuses on outcomes. The platform is engineered, governed, and operated as a managed asset.",
      sectionTitle: "What we [[manage.]]",
      sectionLede:
        "Six pillars that turn a sprawling hybrid estate into a managed platform. One control plane. One identity fabric. One set of pipelines that work everywhere.",
      pillars: [
        {
          title: "Infrastructure Management",
          body: "Provisioning and managing virtual machines, storage, and networking across cloud and on-premises. Resource utilization monitored and optimized for performance and cost efficiency. Scalability and redundancy engineered in.",
        },
        {
          title: "Application Management",
          body: "Deploying and managing applications on cloud platforms. Containerized and serverless architectures. Continuous performance tuning. Automated deployment pipelines streamlining delivery across environments.",
        },
        {
          title: "Security and Compliance Management",
          body: "Robust security controls protect data and applications across the hybrid estate. Regular assessments and audits identify and mitigate risks. Continuous compliance against GDPR, HIPAA, PCI DSS, and more.",
        },
        {
          title: "Cost Optimization",
          body: "Right-sizing. Reserved capacity. Idle resource cleanup. Showback by team. Wired into the same loop that ships workloads. The bill becomes explained — not investigated.",
        },
        {
          title: "24/7 Monitoring and Support",
          body: "Proactive monitoring detects and resolves issues before they impact the business. 24/7 expert support ensures rapid incident response. Regular performance and security reports keep stakeholders informed of estate health.",
        },
        {
          title: "Single Operating Model",
          body: "Same policies. Same pipelines. Same telemetry across data centers, edge sites, and public clouds. Anthos, Arc, Outposts — chosen and configured so workloads move based on cost and gravity, not on where they happened to default.",
        },
      ],
      closing:
        "Hybrid cloud operated as a managed platform. One fabric. One model. One accountable partner across the estate.",
    },
    why: [
      { icon: "★", title: "One operating model", body: "Same policies, same pipelines, anywhere." },
      { icon: "⚡", title: "Portable workloads", body: "Container-first · platform-agnostic." },
      { icon: "⌘", title: "Identity continuity", body: "One IdP, federated everywhere." },
      { icon: "⚑", title: "Cost-aware placement", body: "Workloads placed by cost and gravity." },
    ],
    capabilities: [
      { title: "Fabric", items: ["Network design", "Identity federation", "Service discovery"] },
      { title: "Compute", items: ["K8s everywhere", "VM workloads", "Edge nodes"] },
      { title: "Data", items: ["Replication", "Gravity-aware placement", "Sovereignty"] },
      { title: "Platform", items: ["Anthos / Arc / Outposts", "Crossplane control plane", "GitOps"] },
      { title: "Security", items: ["Unified IAM", "Policy as code", "Audit trail"] },
      { title: "Operations", items: ["Single pane", "Unified alerts", "Cost showback"] },
    ],
    stack: ["Anthos", "Azure Arc", "AWS Outposts", "Crossplane", "Terraform", "VMware", "Istio", "Prometheus"],
    compare: std("One control plane across estates"),
  },
};
