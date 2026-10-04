import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { CustomerMeetingsList } from "./_components/CustomerMeetingsList";

export const metadata = { title: "Meetings · Customer" };

export default async function CustomerMeetingsPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  // Use raw query since "meetings" isn't in the generated types yet
  const { data, error } = await (supabase as unknown as import("@supabase/supabase-js").SupabaseClient)
    .from("meetings")
    .select(`
      id,
      created_at,
      proposed_at,
      scheduled_at,
      duration_minutes,
      meeting_link,
      notes,
      status,
      applicant_id,
      job_post_id,
      job_posts ( title )
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[customer/meetings] fetch failed:", error.message);

  type JobPost = { title: string } | null;

  const rows = data ?? [];

  // meetings.applicant_id → auth.users, not public.profiles, so there's no
  // direct FK for PostgREST to embed — look names up in a second query
  // (same pattern as admin/tickets/page.tsx's requester lookup).
  const applicantIds = [...new Set(rows.map((r: Record<string, unknown>) => r.applicant_id as string))];
  const { data: profileRows = [] } = applicantIds.length
    ? await supabase.from("profiles").select("id, full_name, email").in("id", applicantIds)
    : { data: [] };
  const profileMap = Object.fromEntries(
    (profileRows ?? []).map((p) => [p.id, p.full_name ?? p.email ?? "Unknown applicant"]),
  );

  const meetings = rows.map((row: Record<string, unknown>) => {
    const jp = (Array.isArray(row.job_posts) ? row.job_posts[0] : row.job_posts) as JobPost;
    return {
      id: row.id as string,
      createdAt: row.created_at as string,
      proposedAt: row.proposed_at as string | null,
      scheduledAt: row.scheduled_at as string | null,
      durationMinutes: row.duration_minutes as number,
      meetingLink: row.meeting_link as string | null,
      notes: row.notes as string | null,
      status: row.status as "requested" | "confirmed" | "completed" | "cancelled" | "onboarding",
      jobTitle: jp?.title ?? "Unknown Role",
      applicantName: profileMap[row.applicant_id as string] ?? "Unknown applicant",
    };
  });

  const needsAction = meetings.filter((m) => m.status === "requested" || m.status === "confirmed");
  const past = meetings.filter((m) => !needsAction.includes(m));

  return (
    <div className="w-full space-y-8">
      <PageHeader
        eyebrow="Interviews"
        title="Meetings"
        description="Requests from applicants who've reached the interview stage."
      />

      <CustomerMeetingsList upcoming={needsAction} past={past} />
    </div>
  );
}
