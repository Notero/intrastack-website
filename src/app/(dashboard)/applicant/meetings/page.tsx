import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { MeetingsList } from "./_components/MeetingsList";

export const metadata = { title: "Meetings · Applicant" };

export default async function MeetingsPage() {
  const user = await requireRole("applicant");
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
      job_post_id,
      job_posts ( title )
    `)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[meetings] fetch failed:", error.message);

  type JobPost = { title: string } | null;

  const meetings = (data ?? []).map((row: Record<string, unknown>) => {
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
    };
  });

  const upcoming = meetings.filter((m) => m.status === "requested" || m.status === "confirmed");
  const past = meetings.filter((m) => !upcoming.includes(m));

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Meetings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your interview meetings.
          {meetings.length > 0 ? ` ${meetings.length} meeting${meetings.length === 1 ? "" : "s"} total.` : ""}
        </p>
      </div>

      <MeetingsList upcoming={upcoming} past={past} />
    </div>
  );
}
