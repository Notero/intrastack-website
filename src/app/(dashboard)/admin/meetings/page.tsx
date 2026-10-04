import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../_components/PageHeader";
import { MeetingsAccordion } from "./MeetingsAccordion";
import type { Enums } from "@/lib/supabase/database.types";

export const metadata = { title: "Meetings · Admin" };

export type MeetingStatus = Enums<"meeting_status">;

export interface AdminMeetingRow {
  id: string;
  applicantName: string;
  requestedAt: string | null;
  scheduledAt: string | null;
  status: MeetingStatus;
}

export interface JobGroup {
  jobPostId: string;
  jobTitle: string;
  customerName: string;
  meetings: AdminMeetingRow[];
}

export default async function AdminMeetingsPage() {
  await requireRole("admin");
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("meetings")
    .select(
      `
      id,
      applicant_id,
      job_post_id,
      proposed_at,
      scheduled_at,
      status,
      created_at,
      job_posts ( title, recruiter_id )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) console.error("[admin/meetings] fetch failed:", error.message);

  const meetings = rows ?? [];

  type JobPost = { title: string; recruiter_id: string | null } | null;
  const jobPostOf = (m: (typeof meetings)[number]) =>
    (Array.isArray(m.job_posts) ? m.job_posts[0] : m.job_posts) as JobPost;

  // applicant_id / recruiter_id both point at auth.users, not profiles
  // directly, so there's no FK for PostgREST to embed a name — same
  // two-query pattern already used by admin/talent/page.tsx.
  const profileIds = [
    ...new Set([
      ...meetings.map((m) => m.applicant_id),
      ...meetings.map((m) => jobPostOf(m)?.recruiter_id).filter((id): id is string => !!id),
    ]),
  ];

  const nameById = new Map<string, string>();
  if (profileIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, display_name, email")
      .in("id", profileIds);
    for (const p of profiles ?? []) {
      nameById.set(p.id, p.full_name || p.display_name || p.email || "Unknown");
    }
  }

  const groupsByJob = new Map<string, JobGroup>();
  for (const m of meetings) {
    const jp = jobPostOf(m);
    if (!groupsByJob.has(m.job_post_id)) {
      groupsByJob.set(m.job_post_id, {
        jobPostId: m.job_post_id,
        jobTitle: jp?.title ?? "Deleted listing",
        customerName: jp?.recruiter_id ? nameById.get(jp.recruiter_id) ?? "Unknown" : "Unassigned",
        meetings: [],
      });
    }
    groupsByJob.get(m.job_post_id)!.meetings.push({
      id: m.id,
      applicantName: nameById.get(m.applicant_id) ?? "Applicant",
      requestedAt: m.proposed_at,
      scheduledAt: m.scheduled_at,
      status: m.status,
    });
  }

  // Rows were fetched newest-first, and groups/meetings are built in that
  // same order, so both are already sorted by most-recent activity.
  const jobGroups = [...groupsByJob.values()];

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Platform"
        title="Meetings"
        description="Every interview meeting across all job posts, grouped by listing. You can cancel any meeting here, regardless of who created it."
      />
      <MeetingsAccordion jobGroups={jobGroups} />
    </div>
  );
}
