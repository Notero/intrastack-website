import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../_components/PageHeader";
import { ApplicationsTable } from "./ApplicationsTable";
import type { Enums } from "@/lib/supabase/database.types";

export const metadata = { title: "Applications · Admin" };

export type ApplicationRow = {
  id: string;
  jobPostId: string;
  applicantName: string;
  jobTitle: string;
  customerName: string;
  appliedAt: string;
  status: Enums<"application_status">;
};

export default async function AdminTalentPage() {
  await requireRole("admin");
  const supabase = createAdminSupabaseClient();

  const { data: apps, error } = await supabase
    .from("applications")
    .select("id,job_post_id,applicant_id,created_at,status")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) console.error("[admin/talent] fetch failed:", error.message);

  const rows = apps ?? [];

  const jobIds = [...new Set(rows.map((r) => r.job_post_id))];
  const jobById = new Map<string, { title: string; recruiterId: string | null }>();
  if (jobIds.length) {
    const { data: jobs } = await supabase
      .from("job_posts")
      .select("id,title,recruiter_id")
      .in("id", jobIds);
    for (const j of jobs ?? []) {
      jobById.set(j.id, { title: j.title, recruiterId: j.recruiter_id });
    }
  }

  // Applicants and the customers who posted the jobs both live in profiles.
  const profileIds = [
    ...new Set([
      ...rows.map((r) => r.applicant_id),
      ...[...jobById.values()].map((j) => j.recruiterId).filter((id): id is string => !!id),
    ]),
  ];
  const nameById = new Map<string, string>();
  if (profileIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name,display_name,email")
      .in("id", profileIds);
    for (const p of profiles ?? []) {
      nameById.set(p.id, p.full_name || p.display_name || p.email || "Unknown");
    }
  }

  const applications: ApplicationRow[] = rows.map((r) => {
    const job = jobById.get(r.job_post_id);
    return {
      id: r.id,
      jobPostId: r.job_post_id,
      applicantName: nameById.get(r.applicant_id) ?? "Applicant",
      jobTitle: job?.title ?? "Deleted listing",
      customerName: job?.recruiterId ? nameById.get(job.recruiterId) ?? "Unknown" : "Unassigned",
      appliedAt: r.created_at,
      status: r.status,
    };
  });

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Platform"
        title="Applications"
        description="Every application across all job posts. You can change any status here, including ones a customer has already set."
      />
      <ApplicationsTable applications={applications} />
    </div>
  );
}
