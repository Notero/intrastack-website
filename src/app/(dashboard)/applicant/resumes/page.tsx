import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ResumeUpload } from "../profile/_components/ResumeUpload";
import { ResumeCard } from "./_components/ResumeCard";
import { FileText } from "lucide-react";

export const metadata = { title: "Resumes · Applicant" };

function parseResumeUrl(resumeUrl: string): {
  filename: string;
  fileType: "pdf" | "doc" | "docx";
} {
  const parts = resumeUrl.split("/");
  const rawName = parts[parts.length - 1];           // e.g. "resume.pdf"
  const ext = rawName.split(".").pop()?.toLowerCase() ?? "pdf";
  const fileType = (ext === "pdf" ? "pdf" : ext === "doc" ? "doc" : "docx") as "pdf" | "doc" | "docx";
  return { filename: rawName, fileType };
}

export default async function ResumesPage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { data: ap } = await supabase
    .from("applicant_profiles")
    .select("resume_url")
    .eq("id", user.id)
    .single();

  // Generate a 1-hour signed URL so the private bucket file can be previewed/downloaded
  let signedUrl: string | null = null;
  if (ap?.resume_url) {
    const { data: signed } = await supabase.storage
      .from("resumes")
      .createSignedUrl(ap.resume_url, 3600);
    signedUrl = signed?.signedUrl ?? null;
  }

  const resumeMeta = ap?.resume_url ? parseResumeUrl(ap.resume_url) : null;

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Resumes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage and preview your uploaded resume.
        </p>
      </div>

      {/* Current resume listing */}
      {resumeMeta && signedUrl ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Current Resume</h2>
          <ResumeCard
            filename={resumeMeta.filename}
            fileType={resumeMeta.fileType}
            signedUrl={signedUrl}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 py-14 text-center">
          <FileText className="size-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">No resume uploaded yet.</p>
        </div>
      )}

      {/* Upload section */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">
          {resumeMeta ? "Replace Resume" : "Upload Resume"}
        </h2>
        <p className="mb-6 text-xs text-zinc-500">
          PDF, DOC, DOCX · max 5 MB. Uploading a new file replaces your current resume.
        </p>
        <ResumeUpload />
      </div>
    </div>
  );
}
