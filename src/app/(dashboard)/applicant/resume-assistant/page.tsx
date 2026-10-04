import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { ParsedResume } from "@/lib/resume/schema";
import type { RoleMatch } from "@/lib/resume/match-schema";
import { ResumeAssistant, type InitialAnalysis } from "./_components/ResumeAssistant";

export const metadata = { title: "Resume Assistant · Applicant" };

export default async function ResumeAssistantPage() {
  await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  // Most recent parse for this applicant (RLS scopes it to them).
  const { data: latest } = await supabase
    .from("resume_parses")
    .select("id, parsed, stub, source_filename, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let initial: InitialAnalysis | null = null;
  if (latest) {
    const { data: rows } = await supabase
      .from("resume_matches")
      .select(
        "job_post_id, job_title, score, matched_skills, gaps, reasoning, rank",
      )
      .eq("resume_parse_id", latest.id)
      .order("rank", { ascending: true });

    const matches: RoleMatch[] = (rows ?? []).map((r) => ({
      jobId: r.job_post_id ?? "",
      jobTitle: r.job_title,
      score: r.score,
      matchedSkills: r.matched_skills ?? [],
      gaps: r.gaps ?? [],
      reasoning: r.reasoning ?? "",
    }));

    initial = {
      resume: latest.parsed as ParsedResume,
      parseId: latest.id,
      stub: latest.stub,
      filename: latest.source_filename ?? null,
      analyzedAt: latest.created_at,
      matches: matches.length > 0 ? matches : null,
    };
  }

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Resume Assistant</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Upload a resume to extract a structured profile and see the open roles
          it best fits.
        </p>
      </div>

      <ResumeAssistant initial={initial} />
    </div>
  );
}
