import { NextResponse } from "next/server";
import { parseResume, isPdf, isDocx, type ResumeFile } from "@/lib/resume/parse";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { insertResumeParse } from "@/lib/db/resumeParses";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * POST /api/resume/parse
 *
 * Accepts a multipart/form-data upload with a `file` field (PDF or DOCX, max
 * 5MB) and returns the structured `ParsedResume`, persisting it for the signed-
 * in applicant (RLS scopes the row to them).
 *
 * Auth-gated: parsing triggers a paid LLM call when ANTHROPIC_API_KEY is set,
 * so it must run as an authenticated user. Without a key it returns a
 * deterministic stub (`stub: true`).
 */

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB per the spec

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!(await checkRateLimit("resumeParse", user.id))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'file' field." }, { status: 422 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Uploaded file is empty." }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 5MB limit." },
      { status: 413 },
    );
  }

  const candidate = { mimeType: file.type, filename: file.name };
  if (!isPdf(candidate) && !isDocx(candidate)) {
    return NextResponse.json(
      { error: "Only PDF and DOCX resumes are supported." },
      { status: 415 },
    );
  }

  const resumeFile: ResumeFile = {
    buffer: Buffer.from(await file.arrayBuffer()),
    mimeType: file.type,
    filename: file.name,
  };

  try {
    const { resume, stub } = await parseResume(resumeFile);

    // Persist for the signed-in applicant (RLS scopes the row to them).
    let parseId: string | null = null;
    try {
      const { data, error } = await insertResumeParse(supabase, {
        applicant_id: user.id,
        source_filename: file.name,
        model: stub ? "stub" : "claude-opus-4-8",
        stub,
        parsed: resume,
      });
      if (error) console.error("[resume/parse] persist failed:", error.message);
      else parseId = data?.id ?? null;
    } catch (persistErr) {
      console.error("[resume/parse] persist error:", persistErr);
    }

    return NextResponse.json({ ok: true, stub, resume, parseId });
  } catch (err) {
    console.error("[resume/parse] failed:", err);
    return NextResponse.json(
      { error: "We couldn't parse that resume. Please try a different file." },
      { status: 500 },
    );
  }
}
