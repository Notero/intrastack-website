import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Job posts live in the Supabase table `job_posts`. The Careers page lists
 * `published = true` rows; a job is opened in a modal on the same page,
 * so there is no detail route.
 *
 * If Supabase env vars are not set, fetchJobs() returns an empty array —
 * the UI shows an empty state.
 */

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "internship"
  | "temporary";

export type JobPost = {
  id: string;
  slug: string;
  title: string;
  team: string | null;
  location: string;
  remote: boolean;
  employment_type: EmploymentType;
  seniority: string | null;
  salary_range: string | null;
  short_description: string;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  nice_to_have: string[] | null;
  tags: string[] | null;
  posted_at: string;
};

const JOB_COLUMNS =
  "id,slug,title,team,location,remote,employment_type,seniority,salary_range,short_description,description,responsibilities,requirements,nice_to_have,tags,posted_at";

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const MOCK_JOBS: JobPost[] = [
  {
    id: "mock-1",
    slug: "senior-cloud-engineer",
    title: "Senior Cloud Engineer",
    team: "Cloud Platform",
    location: "London, UK",
    remote: true,
    employment_type: "full_time",
    seniority: "Senior",
    salary_range: "£90k – £120k",
    short_description:
      "Design and operate multi-cloud infrastructure that powers our customers' most critical workloads.",
    description:
      "We're hiring a Senior Cloud Engineer to lead the design, automation, and operation of our multi-cloud platform across AWS, Azure, and GCP. You'll work alongside architects and security engineers to deliver resilient, observable infrastructure for enterprise clients.",
    responsibilities: [
      "Design and implement infrastructure-as-code across AWS, Azure, and GCP",
      "Own reliability, observability, and incident response for production workloads",
      "Mentor engineers and review architecture decisions",
      "Partner with security to harden cloud accounts and CI/CD pipelines",
    ],
    requirements: [
      "5+ years of cloud engineering experience in production environments",
      "Strong Terraform and Kubernetes skills",
      "Deep familiarity with at least one of AWS, Azure, or GCP",
      "Experience with CI/CD, observability tooling, and on-call ownership",
    ],
    nice_to_have: [
      "Cloud certifications (AWS SA Pro, Azure Architect, GCP PCA)",
      "Experience with service mesh and zero-trust networking",
      "Background in regulated industries (finance, healthcare)",
    ],
    tags: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"],
    posted_at: new Date().toISOString(),
  },
];

export async function fetchJobs(): Promise<JobPost[]> {
  if (!supabaseConfigured()) return MOCK_JOBS;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select(JOB_COLUMNS)
    .eq("published", true)
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("[jobs] fetchJobs failed:", error.message);
    return [];
  }
  return (data ?? []) as JobPost[];
}

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  temporary: "Temporary",
};
