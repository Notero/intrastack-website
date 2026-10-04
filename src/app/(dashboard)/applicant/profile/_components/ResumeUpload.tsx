"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { upsertApplicantProfile } from "@/lib/db/applicantProfiles";

type UploadStatus = "idle" | "uploading" | "success" | "error";

function getExtension(file: File): string {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/msword") return "doc";
  return "docx";
}

export function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [status, setStatus]     = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
  const [dragging, setDragging] = useState(false);

  function pickFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    const picked = files[0];
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(picked.type)) {
      setErrorMsg("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      setStatus("error");
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum size is 5 MB.");
      setStatus("error");
      return;
    }
    setFile(picked);
    setStatus("idle");
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");

    const supabase = createSupabaseBrowserClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setErrorMsg("Could not verify your session. Please refresh and try again.");
      setStatus("error");
      return;
    }

    const ext = getExtension(file);
    const path = `${user.id}/resume.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setErrorMsg(uploadError.message);
      setStatus("error");
      return;
    }

    // Save the storage path back to applicant_profiles so other parts of the
    // app can generate a signed URL from it.
    await upsertApplicantProfile(supabase, { id: user.id, resume_url: path });

    setStatus("success");
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragging ? "border-zinc-900 bg-zinc-50" : "border-zinc-300 hover:border-zinc-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => pickFile(e.target.files)}
        />
        <UploadCloud className={`size-10 ${dragging ? "text-zinc-900" : "text-zinc-400"}`} />
        <div className="text-center">
          <p className="font-medium text-zinc-900">Drag & drop your resume here</p>
          <p className="mt-1 text-sm text-zinc-500">or click to browse files</p>
        </div>
        <p className="text-xs text-zinc-400">PDF, DOC, DOCX · max 5 MB</p>
      </div>

      {file && (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <FileText className="size-8 shrink-0 text-zinc-700" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium text-zinc-900">{file.name}</p>
            <p className="text-xs text-zinc-500">
              {(file.size / 1024).toFixed(0)} KB · {file.type.includes("pdf") ? "PDF" : "Word"}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); setStatus("idle"); }}
            className="text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="size-4" />
          {errorMsg}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="size-4" />
          Resume uploaded successfully.
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || status === "uploading" || status === "success"}
        className="w-fit"
      >
        {status === "uploading" ? "Uploading…" : "Upload Resume"}
      </Button>
    </div>
  );
}
