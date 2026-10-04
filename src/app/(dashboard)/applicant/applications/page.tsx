import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ApplicationsTable } from "./_components/ApplicationsTable";
import { selectOfferLettersByApplicationIds } from "@/lib/db/offerLetters";

export const metadata = { title: "Applications · Applicant" };

export default async function ApplicationsPage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      status,
      notes,
      job_posts ( title, team, location )
    `)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[applications] fetch failed:", error.message);

  const applicationIds = (data ?? []).map((row) => row.id);
  const { data: offerLetters } = await selectOfferLettersByApplicationIds(supabase, applicationIds);
  const offerLetterByApp = new Map((offerLetters ?? []).map((ol) => [ol.application_id, ol]));

  type JobPost = { title: string; team: string | null; location: string } | null;
  const applications = (data ?? []).map((row) => {
    const jp = (Array.isArray(row.job_posts) ? row.job_posts[0] : row.job_posts) as JobPost;
    const offerLetter = offerLetterByApp.get(row.id);
    return {
      id: row.id,
      jobTitle: jp?.title ?? "Unknown Role",
      company: jp?.team ?? "Intrastack",
      location: jp?.location ?? "—",
      appliedAt: row.created_at,
      status: row.status,
      notes: row.notes ?? undefined,
      offerLetter: offerLetter
        ? { status: offerLetter.status, filePath: offerLetter.file_path }
        : null,
    };
  });

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Application History</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track every role you&apos;ve applied for.{applications.length > 0 ? ` ${applications.length} application${applications.length === 1 ? "" : "s"}.` : ""}
        </p>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
