import { Cloud, Server, Boxes, ShieldCheck, ClipboardList, Database } from "lucide-react";

/**
 * Company-wide certification catalog — single source of truth for both the
 * public /about/certifications page and the per-person certifications
 * picker in the leadership admin form.
 */

export type Tier = "Foundational" | "Associate" | "Professional" | "Expert" | "Specialty";

export type CertGroup = {
  id: string;
  vendor: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: "primary" | "secondary";
  certs: { name: string; tier: Tier }[];
};

export const TIER_STYLES: Record<Tier, string> = {
  Foundational: "bg-base-200 text-muted-foreground border-base-300",
  Associate: "bg-primary/10 text-brand-600 border-primary/30",
  Professional: "bg-secondary/15 text-[#92400E] border-secondary/40",
  Expert: "bg-secondary/15 text-[#92400E] border-secondary/40",
  Specialty: "bg-primary/15 text-brand-600 border-primary/40",
};

export const CERT_CATALOG: CertGroup[] = [
  {
    id: "gcp",
    vendor: "Google Cloud Platform (GCP)",
    tagline: "Architect, build, secure, and run on Google Cloud.",
    icon: Cloud,
    accent: "primary",
    certs: [
      { name: "Professional Cloud Architect", tier: "Professional" },
      { name: "Associate Cloud Engineer", tier: "Associate" },
      { name: "Professional Data Engineer", tier: "Professional" },
      { name: "Professional Cloud Developer", tier: "Professional" },
      { name: "Professional Cloud Security Engineer", tier: "Professional" },
      { name: "Professional Collaboration Engineer", tier: "Professional" },
    ],
  },
  {
    id: "aws",
    vendor: "Amazon Web Services (AWS)",
    tagline: "Premier-partner depth across the AWS catalog.",
    icon: Cloud,
    accent: "secondary",
    certs: [
      { name: "Solutions Architect – Professional", tier: "Professional" },
      { name: "Solutions Architect – Associate", tier: "Associate" },
      { name: "DevOps Engineer – Professional", tier: "Professional" },
      { name: "Developer – Associate", tier: "Associate" },
      { name: "SysOps Administrator – Associate", tier: "Associate" },
      { name: "Security – Specialty", tier: "Specialty" },
      { name: "Advanced Networking – Specialty", tier: "Specialty" },
      { name: "Machine Learning – Specialty", tier: "Specialty" },
    ],
  },
  {
    id: "azure",
    vendor: "Microsoft Azure",
    tagline: "Enterprise Azure — landing zones, identity, and beyond.",
    icon: Server,
    accent: "primary",
    certs: [
      { name: "Azure Solutions Architect Expert", tier: "Expert" },
      { name: "Azure Administrator Associate", tier: "Associate" },
      { name: "Azure DevOps Engineer Expert", tier: "Expert" },
      { name: "Azure Developer Associate", tier: "Associate" },
      { name: "Azure Security Engineer Associate", tier: "Associate" },
      { name: "Azure AI Engineer Associate", tier: "Associate" },
      { name: "Azure Data Scientist Associate", tier: "Associate" },
    ],
  },
  {
    id: "k8s",
    vendor: "Kubernetes",
    tagline: "Production K8s — administration, development, and security.",
    icon: Boxes,
    accent: "primary",
    certs: [
      { name: "Certified Kubernetes Administrator (CKA)", tier: "Professional" },
      { name: "Certified Kubernetes Application Developer (CKAD)", tier: "Professional" },
      { name: "Certified Kubernetes Security Specialist (CKS)", tier: "Specialty" },
    ],
  },
  {
    id: "security",
    vendor: "Security & Networking",
    tagline: "Cross-vendor security expertise — cloud, on-prem, and the seam between.",
    icon: ShieldCheck,
    accent: "secondary",
    certs: [
      { name: "Certified Information Systems Security Professional (CISSP)", tier: "Professional" },
      { name: "Certified Cloud Security Professional (CCSP)", tier: "Professional" },
      { name: "Red Hat Certified Engineer (RHCE)", tier: "Professional" },
      { name: "Red Hat Certified System Administrator (RHCSA)", tier: "Associate" },
    ],
  },
  {
    id: "pm",
    vendor: "Project Management & Agile",
    tagline: "Delivery discipline — the difference between a plan and a shipped program.",
    icon: ClipboardList,
    accent: "primary",
    certs: [
      { name: "Project Management Professional (PMP)", tier: "Professional" },
      { name: "Certified ScrumMaster (CSM)", tier: "Associate" },
    ],
  },
  {
    id: "data",
    vendor: "Data & Infrastructure",
    tagline: "Modern data platforms and infrastructure-as-code.",
    icon: Database,
    accent: "secondary",
    certs: [
      { name: "Databricks Certified Data Engineer Associate", tier: "Associate" },
      { name: "Databricks Certified Data Engineer Professional", tier: "Professional" },
      { name: "HashiCorp Certified: Terraform Associate", tier: "Associate" },
    ],
  },
];

export const ALL_CERT_NAMES: string[] = CERT_CATALOG.flatMap((g) => g.certs.map((c) => c.name));
