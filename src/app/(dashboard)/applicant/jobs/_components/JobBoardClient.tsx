"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Share2,
  Briefcase,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLOYMENT_LABELS, type JobPost } from "@/lib/content/jobs";
import { cn } from "@/lib/utils";
import { JobFilterDrawer, type FilterState, DEFAULT_FILTERS } from "./JobFilterDrawer";
import { saveJobAction, unsaveJobAction, applyAction } from "../actions";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const JOBS_PER_PAGE = 20;

function daysAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
}

function workStyleFromJob(job: JobPost): string {
  return job.remote ? "Remote" : "On-site";
}

function countActiveFilters(f: FilterState): number {
  return f.workStyles.length + f.skills.length + f.seniority.length + f.employmentTypes.length;
}

interface Props {
  jobs: JobPost[];
  initialSavedIds: string[];
  initialAppliedIds: string[];
  resumeUrl: string | null;
}

export function JobBoardClient({ jobs, initialSavedIds, initialAppliedIds, resumeUrl }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds));
  const [pendingSave, setPendingSave] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set(initialAppliedIds));
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterMode, setCoverLetterMode] = useState<"type" | "upload">("type");
  const [applying, setApplying] = useState(false);

  const availableSkills = (() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  })();

  const filteredJobs = jobs.filter((job) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hit =
          job.title.toLowerCase().includes(q) ||
          (job.team ?? "").toLowerCase().includes(q) ||
          (job.tags ?? []).some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (locationQuery) {
        if (!job.location.toLowerCase().includes(locationQuery.toLowerCase())) return false;
      }
      if (employmentTypeFilter !== "all" && job.employment_type !== employmentTypeFilter) return false;
      if (filters.workStyles.length > 0 && !filters.workStyles.includes(workStyleFromJob(job))) return false;
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employment_type)) return false;
      if (filters.seniority.length > 0) {
        const match = filters.seniority.some((s) =>
          job.seniority?.toLowerCase().includes(s.toLowerCase())
        );
        if (!match) return false;
      }
      if (filters.skills.length > 0) {
        const match = filters.skills.some((s) => (job.tags ?? []).includes(s));
        if (!match) return false;
      }
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const pageStart = (page - 1) * JOBS_PER_PAGE;
  const pageJobs = filteredJobs.slice(pageStart, pageStart + JOBS_PER_PAGE);

  const visibleSelectedId = pageJobs.find((j) => j.id === selectedId)
    ? selectedId
    : pageJobs[0]?.id ?? null;

  const selectedJob = jobs.find((j) => j.id === visibleSelectedId) ?? null;

  async function handleSave(jobId: string) {
    if (pendingSave) return;
    setPendingSave(jobId);
    if (savedIds.has(jobId)) {
      setSavedIds((prev) => { const s = new Set(prev); s.delete(jobId); return s; });
      await unsaveJobAction(jobId);
    } else {
      setSavedIds((prev) => new Set(prev).add(jobId));
      await saveJobAction(jobId);
    }
    setPendingSave(null);
  }

  async function handleApply() {
    if (!selectedJob || applying) return;
    setApplying(true);

    let coverLetterUrl: string | undefined;
    if (coverLetterMode === "upload" && coverLetterFile) {
      const supabase = createSupabaseBrowserClient();
      const ext = coverLetterFile.name.split(".").pop();
      const path = `cover-letters/${selectedJob.id}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, coverLetterFile, { upsert: true });
      if (uploadError) {
        toast.error("Failed to upload cover letter. Please try again.");
        setApplying(false);
        return;
      }
      coverLetterUrl = path;
    }

    const result = await applyAction({
      jobPostId: selectedJob.id,
      coverLetter: coverLetterMode === "type" ? coverLetter.trim() || undefined : undefined,
      coverLetterUrl,
    });
    setApplying(false);
    setApplyDialogOpen(false);
    setCoverLetter("");
    setCoverLetterFile(null);
    setCoverLetterMode("type");
    if (result.ok) {
      setAppliedIds((prev) => new Set(prev).add(selectedJob.id));
      toast.success("Application submitted!");
    } else if (result.alreadyApplied) {
      setAppliedIds((prev) => new Set(prev).add(selectedJob.id));
      toast.info("You've already applied for this role.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function handleShare(job: JobPost) {
    const url = `${window.location.origin}/careers`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[180px] flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search jobs…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="relative min-w-[140px] flex-1 max-w-[200px]">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Location…"
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={employmentTypeFilter}
          onValueChange={(v) => {
            setEmploymentTypeFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EMPLOYMENT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className={cn(
            "relative gap-2",
            activeFilterCount > 0 && "border-brand-500 text-brand-500"
          )}
        >
          <SlidersHorizontal className="h-4 w-4 -rotate-90" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Two-column board */}
      <div className="flex gap-6">
        {/* Left: job list */}
        <div className="flex w-[340px] shrink-0 flex-col gap-3">
          <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-16 text-center">
                <Briefcase className="h-10 w-10 text-zinc-300" />
                <p className="text-sm text-zinc-500">No jobs match your filters.</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); setSearchQuery(""); setLocationQuery(""); setEmploymentTypeFilter("all"); setPage(1); }}
                  className="text-xs text-brand-500 underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              pageJobs.map((job) => {
                const active = job.id === visibleSelectedId;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedId(job.id)}
                    className={cn(
                      "rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md",
                      active ? "border-brand-500" : "border-zinc-200"
                    )}
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 leading-snug">{job.title}</h3>
                      {job.seniority && (
                        <Badge variant="outline" className="shrink-0 text-[11px]">{job.seniority}</Badge>
                      )}
                    </div>
                    {job.team && <p className="mb-2 text-xs text-zinc-500">{job.team}</p>}
                    {job.salary_range && (
                      <p className="mb-2 text-sm font-semibold text-brand-500">{job.salary_range}</p>
                    )}
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <Badge variant="secondary" className="text-[11px]">
                        {EMPLOYMENT_LABELS[job.employment_type]}
                      </Badge>
                      {job.remote && (
                        <Badge variant="secondary" className="text-[11px]">Remote</Badge>
                      )}
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {job.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mb-3 text-xs text-zinc-500 line-clamp-2">{job.short_description}</p>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-zinc-400">
                      <Clock className="h-3 w-3" />
                      {daysAgo(job.posted_at)}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex shrink-0 items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Right: detail panel */}
        {selectedJob && (
          <div
            className="flex-1 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{selectedJob.title}</h2>
                {selectedJob.team && <p className="mt-0.5 text-sm text-zinc-500">{selectedJob.team}</p>}
              </div>
              <div className="flex items-center gap-2">
                {appliedIds.has(selectedJob.id) ? (
                  <Button size="sm" disabled className="gap-1.5 bg-green-600 opacity-100">
                    <CheckCircle className="h-4 w-4" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-brand-500 hover:bg-brand-600"
                    onClick={() => setApplyDialogOpen(true)}
                  >
                    Apply
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pendingSave === selectedJob.id}
                  onClick={() => handleSave(selectedJob.id)}
                  className={cn(savedIds.has(selectedJob.id) && "border-brand-500 text-brand-500")}
                >
                  {savedIds.has(selectedJob.id)
                    ? <BookmarkCheck className="h-4 w-4" />
                    : <Bookmark className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare(selectedJob)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Meta row */}
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <MapPin className="h-4 w-4" />
                {selectedJob.location}
              </span>
              {selectedJob.remote && <Badge variant="secondary">Remote</Badge>}
              <Badge variant="outline">{EMPLOYMENT_LABELS[selectedJob.employment_type]}</Badge>
              {selectedJob.seniority && <Badge variant="outline">{selectedJob.seniority}</Badge>}
              {selectedJob.salary_range && (
                <span className="text-sm font-semibold text-brand-500">{selectedJob.salary_range}</span>
              )}
              <span className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                {daysAgo(selectedJob.posted_at)}
              </span>
            </div>

            {/* Description */}
            {selectedJob.description && (
              <Section title="Description">
                <p className="text-sm text-zinc-600 leading-relaxed">{selectedJob.description}</p>
              </Section>
            )}

            {/* Requirements */}
            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <Section title="Requirements">
                <BulletList items={selectedJob.requirements} />
              </Section>
            )}

            {/* Responsibilities */}
            {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
              <Section title="Responsibilities">
                <BulletList items={selectedJob.responsibilities} />
              </Section>
            )}

            {/* Nice to have */}
            {selectedJob.nice_to_have && selectedJob.nice_to_have.length > 0 && (
              <Section title="Nice to Have">
                <BulletList items={selectedJob.nice_to_have} />
              </Section>
            )}

            {/* Tags */}
            {selectedJob.tags && selectedJob.tags.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>

      <JobFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => { setFilters(newFilters); setFilterOpen(false); setPage(1); }}
        availableSkills={availableSkills}
      />

      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            {selectedJob?.team && (
              <DialogDescription>{selectedJob.team}</DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-5">
            {/* Resume section */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Resume</p>
              {resumeUrl ? (
                <div className="flex items-center gap-3 rounded-lg border border-brand-500 bg-brand-50 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                    <FileText className="size-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {resumeUrl.split("/").pop()}
                    </p>
                    <p className="text-xs text-zinc-500">Will be attached to your application</p>
                  </div>
                  <CheckCircle className="size-4 shrink-0 text-brand-500" />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
                  No resume on file.{" "}
                  <a href="/applicant/resumes" className="font-medium underline">
                    Upload one
                  </a>{" "}
                  before applying — strongly recommended.
                </div>
              )}
            </div>

            {/* Cover letter section */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Cover Letter <span className="normal-case font-normal text-zinc-400">(optional)</span>
                </p>
                <div className="flex rounded-md border border-zinc-200 text-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode("type")}
                    className={cn("px-3 py-1 transition-colors", coverLetterMode === "type" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50")}
                  >
                    Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode("upload")}
                    className={cn("px-3 py-1 transition-colors border-l border-zinc-200", coverLetterMode === "upload" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50")}
                  >
                    Upload
                  </button>
                </div>
              </div>
              {coverLetterMode === "type" ? (
                <Textarea
                  placeholder="Write your cover letter here…"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              ) : coverLetterFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <FileText className="size-4 shrink-0 text-zinc-400" />
                  <p className="flex-1 truncate text-sm text-zinc-700">{coverLetterFile.name}</p>
                  <button
                    type="button"
                    onClick={() => setCoverLetterFile(null)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-6 text-center hover:border-zinc-400 transition-colors">
                  <Upload className="size-5 text-zinc-400" />
                  <span className="text-sm text-zinc-500">
                    Click to upload a PDF or Word document
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setCoverLetterFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={applying}
              onClick={handleApply}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {applying ? "Submitting…" : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 border-b border-zinc-100 pb-2 text-sm font-semibold text-zinc-800">{title}</h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}
