"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  Wand2,
  Loader2,
  RefreshCw,
  Search,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParsedResume } from "@/lib/resume/schema";
import type { RoleMatch } from "@/lib/resume/match-schema";
import { ParsedResumeView } from "./ParsedResumeView";
import { MatchResults } from "./MatchResults";

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_BYTES = 5 * 1024 * 1024;

type Parsed = { resume: ParsedResume; stub: boolean; parseId: string | null };
type Matched = { matches: RoleMatch[]; stub: boolean };

export type InitialAnalysis = {
  resume: ParsedResume;
  parseId: string;
  stub: boolean;
  filename: string | null;
  analyzedAt: string;
  matches: RoleMatch[] | null;
};

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      <FlaskConical className="size-3" />
      Demo data — set ANTHROPIC_API_KEY for live results
    </span>
  );
}

export function ResumeAssistant({
  initial,
}: {
  initial?: InitialAnalysis | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<Parsed | null>(
    initial
      ? { resume: initial.resume, stub: initial.stub, parseId: initial.parseId }
      : null,
  );
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState<Matched | null>(
    initial?.matches ? { matches: initial.matches, stub: initial.stub } : null,
  );
  const [savedFilename, setSavedFilename] = useState<string | null>(
    initial?.filename ?? null,
  );
  const [savedAt, setSavedAt] = useState<string | null>(
    initial?.analyzedAt ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  function pickFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    const picked = files[0];
    if (!ACCEPTED.includes(picked.type)) {
      setError("Unsupported file. Please upload a PDF or DOCX resume.");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setError(null);
    setFile(picked);
  }

  async function analyze() {
    if (!file) return;
    setParsing(true);
    setError(null);
    setParsed(null);
    setMatched(null);
    setSavedAt(null);
    setSavedFilename(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resume/parse", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not parse that resume.");
      setParsed({
        resume: json.resume,
        stub: Boolean(json.stub),
        parseId: typeof json.parseId === "string" ? json.parseId : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse that resume.");
    } finally {
      setParsing(false);
    }
  }

  async function findMatches() {
    if (!parsed) return;
    setMatching(true);
    setError(null);
    try {
      const res = await fetch("/api/resume/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resume: parsed.resume, parseId: parsed.parseId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not match that resume.");
      setMatched({ matches: json.matches, stub: Boolean(json.stub) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not match that resume.");
    } finally {
      setMatching(false);
    }
  }

  function reset() {
    setFile(null);
    setParsed(null);
    setMatched(null);
    setError(null);
    setParsing(false);
    setMatching(false);
    setSavedAt(null);
    setSavedFilename(null);
  }

  // ---- Upload state (nothing parsed yet) ----
  if (!parsed) {
    return (
      <div className="max-w-2xl space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors ${
            dragging
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-300 hover:border-zinc-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={(e) => pickFile(e.target.files)}
          />
          <UploadCloud
            className={`size-10 ${dragging ? "text-zinc-900" : "text-zinc-400"}`}
          />
          <div className="text-center">
            <p className="font-medium text-zinc-900">
              Drop a resume to analyze
            </p>
            <p className="mt-1 text-sm text-zinc-500">or click to browse files</p>
          </div>
          <p className="text-xs text-zinc-400">PDF or DOCX · max 5 MB</p>
        </div>

        {file && (
          <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <FileText className="size-8 shrink-0 text-zinc-700" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-zinc-900">{file.name}</p>
              <p className="text-xs text-zinc-500">
                {(file.size / 1024).toFixed(0)} KB ·{" "}
                {file.type.includes("pdf") ? "PDF" : "DOCX"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-zinc-400 transition-colors hover:text-red-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}

        {error && <ErrorNote message={error} />}

        <Button onClick={analyze} disabled={!file || parsing} className="w-fit">
          {parsing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              Analyze resume
            </>
          )}
        </Button>

        {parsing && <ParseSkeleton />}
      </div>
    );
  }

  // ---- Parsed state: profile + matching ----
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <FileText className="size-4 text-zinc-400" />
            {file?.name ?? savedFilename ?? "Resume"}
          </span>
          {!file && savedAt && (
            <span className="text-xs text-zinc-400">
              Last analyzed {new Date(savedAt).toLocaleDateString()}
            </span>
          )}
          {parsed.stub && <DemoBadge />}
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCw className="size-3.5" />
          Start over
        </Button>
      </div>

      {error && <ErrorNote message={error} />}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(340px,400px)]">
        {/* Extracted profile */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Extracted profile
          </h2>
          <ParsedResumeView resume={parsed.resume} />
        </section>

        {/* Matching */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Best-fit roles
          </h2>

          {!matched && !matching && (
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <Search className="mx-auto size-7 text-zinc-300" />
              <p className="text-sm text-zinc-500">
                Match this profile against our open roles and see the top 3 with
                reasoning.
              </p>
              <Button onClick={findMatches} className="w-full">
                <Search className="size-4" />
                Find matching roles
              </Button>
            </div>
          )}

          {matching && <MatchSkeleton />}

          {matched && (
            <div className="space-y-3">
              {matched.stub && <DemoBadge />}
              <MatchResults matches={matched.matches} />
              <Button
                variant="outline"
                size="sm"
                onClick={findMatches}
                disabled={matching}
              >
                <RefreshCw className="size-3.5" />
                Re-run matching
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      <AlertCircle className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function ParseSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}

function MatchSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-10" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-3 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
