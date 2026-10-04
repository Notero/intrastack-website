import { NextResponse } from "next/server";
import { ParsedResumeSchema } from "@/lib/resume/schema";
import { matchResume } from "@/lib/resume/match";
import { fetchJobs } from "@/lib/content/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { deleteResumeMatchesForParse, insertResumeMatches } from "@/lib/db/resumeMatches";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * POST /api/resume/match
 *
 * Body: { resume: ParsedResume, parseId?: string }.
 * Loads the open job_posts and returns the top-3 ranked matches, persisting them
 * against the parse when `parseId` belongs to the caller.
 *
 * Auth-gated (triggers a paid LLM call when live). Falls back to a deterministic
 * heuristic when there's no ANTHROPIC_API_KEY, and to mock jobs when Supabase
 * isn't configured.
 */

export const runtime = "nodejs";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!(await checkRateLimit("resumeMatch", user.id))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = ParsedResumeSchema.safeParse((body as { resume?: unknown })?.resume);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid or missing 'resume' payload." },
      { status: 422 },
    );
  }
  const parseId =
    typeof (body as { parseId?: unknown })?.parseId === "string"
      ? (body as { parseId: string }).parseId
      : null;

  try {
    const jobs = await fetchJobs();
    const { matches, stub } = await matchResume(parsed.data, jobs);

    // Persist matches — but only against a parse the caller actually owns.
    if (parseId) {
      try {
        const { data: owned } = await supabase
          .from("resume_parses")
          .select("id")
          .eq("id", parseId)
          .eq("applicant_id", user.id)
          .maybeSingle();

        if (owned) {
          await deleteResumeMatchesForParse(supabase, parseId);

          if (matches.length > 0) {
            const rows = matches.map((m, i) => ({
              applicant_id: user.id,
              resume_parse_id: parseId,
              job_post_id: UUID_RE.test(m.jobId) ? m.jobId : null,
              job_title: m.jobTitle,
              rank: i + 1,
              score: m.score,
              matched_skills: m.matchedSkills,
              gaps: m.gaps,
              reasoning: m.reasoning,
              stub,
            }));
            const { error } = await insertResumeMatches(supabase, rows);
            if (error)
              console.error("[resume/match] persist failed:", error.message);
          }
        }
      } catch (persistErr) {
        console.error("[resume/match] persist error:", persistErr);
      }
    }

    return NextResponse.json({ ok: true, stub, matches, jobCount: jobs.length });
  } catch (err) {
    console.error("[resume/match] failed:", err);
    return NextResponse.json(
      { error: "We couldn't match that resume. Please try again." },
      { status: 500 },
    );
  }
}
