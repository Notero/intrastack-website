"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Building2,
  BadgeCheck,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  EMPLOYMENT_LABELS,
  type EmploymentType,
  type JobPost,
} from "@/lib/content/jobs";

const ALL_TYPES: EmploymentType[] = [
  "freelance",
  "full_time",
  "internship",
  "part_time",
  "temporary",
  "contract",
];

const JOBS_PER_PAGE = 10;

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return "Posted today";
  if (days < 7) return `Posted ${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `Posted ${w} week${w === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return `Posted ${m} month${m === 1 ? "" : "s"} ago`;
  }
  const y = Math.floor(days / 365);
  return `Posted ${y} year${y === 1 ? "" : "s"} ago`;
}

export default function CareersBoard({ jobs }: { jobs: JobPost[] }) {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [types, setTypes] = useState<Set<EmploymentType>>(new Set(ALL_TYPES));
  const [openJob, setOpenJob] = useState<JobPost | null>(null);
  const [page, setPage] = useState(1);

  const filtered = jobs.filter((j) => {
    const kw = keywords.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    if (!types.has(j.employment_type)) return false;
    if (remoteOnly && !j.remote) return false;
    if (loc && !j.location.toLowerCase().includes(loc)) return false;
    if (kw) {
      const hay = `${j.title} ${j.team ?? ""} ${j.short_description} ${(j.tags ?? []).join(" ")}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const pageStart = (page - 1) * JOBS_PER_PAGE;
  const pageJobs = filtered.slice(pageStart, pageStart + JOBS_PER_PAGE);

  function toggleType(t: EmploymentType) {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
    setPage(1);
  }

  const filtersActive =
    keywords.trim() !== "" ||
    location.trim() !== "" ||
    remoteOnly ||
    types.size !== ALL_TYPES.length;

  function clearFilters() {
    setKeywords("");
    setLocation("");
    setRemoteOnly(false);
    setTypes(new Set(ALL_TYPES));
    setPage(1);
  }

  return (
    <>
      {/* Search bar */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <div>
            <Label htmlFor="kw" className="text-xs uppercase tracking-widest text-muted-foreground">
              Keywords
            </Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="kw"
                value={keywords}
                onChange={(e) => {
                  setKeywords(e.target.value);
                  setPage(1);
                }}
                placeholder="Role, skill, team…"
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="loc" className="text-xs uppercase tracking-widest text-muted-foreground">
              Location
            </Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="loc"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="City, region…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2 h-10">
              <Checkbox
                id="remote"
                checked={remoteOnly}
                onCheckedChange={(v) => {
                  setRemoteOnly(v === true);
                  setPage(1);
                }}
              />
              <Label htmlFor="remote" className="text-sm cursor-pointer">
                Remote only
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 pt-5 border-t border-base-300">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">
            Type
          </span>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto order-last text-xs font-medium text-muted-foreground hover:text-primary underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
          {ALL_TYPES.map((t) => {
            const active = types.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-base-300 bg-transparent text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span
                  className={`size-3 rounded-sm border ${
                    active ? "border-primary bg-primary" : "border-muted-foreground/40"
                  }`}
                  aria-hidden
                />
                {EMPLOYMENT_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-baseline justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filtered.length} open role{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-12 text-center">
          <p className="text-base font-semibold text-foreground">No matching roles right now.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try clearing filters — or{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              reach out anyway
            </Link>
            . We&apos;re always looking for talented people.
          </p>
          {filtersActive && (
            <Button variant="outline" size="sm" className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5">
          {pageJobs.map((j) => (
            <li key={j.id}>
              <JobCard job={j} onOpen={() => setOpenJob(j)} />
            </li>
          ))}
        </ul>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
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

      {/* Detail modal */}
      <Dialog open={openJob !== null} onOpenChange={(o) => !o && setOpenJob(null)}>
        <DialogContent className="!max-w-4xl w-[calc(100%-2rem)] sm:w-[min(64rem,calc(100%-2rem))] sm:!max-w-5xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-sm">
          {openJob && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {openJob.team && <span className="text-primary">{openJob.team}</span>}
                  {openJob.team && <span>·</span>}
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="size-3" />
                    {EMPLOYMENT_LABELS[openJob.employment_type]}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {openJob.remote ? "Remote" : openJob.location}
                  </span>
                  {openJob.seniority && (
                    <>
                      <span>·</span>
                      <span>{openJob.seniority}</span>
                    </>
                  )}
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight mt-2">
                  {openJob.title}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground leading-relaxed pt-1">
                  {openJob.short_description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-2">
                {(openJob.tags?.length || openJob.salary_range) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {(openJob.tags ?? []).map((t) => (
                      <Badge key={t} variant="secondary" className="font-normal">
                        {t}
                      </Badge>
                    ))}
                    {openJob.salary_range && (
                      <span className="text-sm text-muted-foreground ml-1 inline-flex items-center gap-1">
                        <Building2 className="size-3.5" />
                        {openJob.salary_range}
                      </span>
                    )}
                  </div>
                )}

                {openJob.description && (
                  <Section title="About the role">
                    <p className="whitespace-pre-line">{openJob.description}</p>
                  </Section>
                )}

                {openJob.responsibilities?.length ? (
                  <Section title="What you'll do">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {openJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </Section>
                ) : null}

                {openJob.requirements?.length ? (
                  <Section title="What we're looking for">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {openJob.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </Section>
                ) : null}

                {openJob.nice_to_have?.length ? (
                  <Section title="Nice to have">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {openJob.nice_to_have.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </Section>
                ) : null}
              </div>

              <DialogFooter className="border-t border-base-300 pt-5">
                <span className="text-xs text-muted-foreground mr-auto inline-flex items-center gap-1.5">
                  <Clock className="size-3" />
                  {timeAgo(openJob.posted_at)}
                </span>
                <Button variant="ghost" onClick={() => setOpenJob(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/register?role=${encodeURIComponent(openJob.slug)}`}>
                    Apply now <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const AVATAR_GRADIENTS = [
  "from-[#00D1FF] to-[#0078A0] text-[#001116]",
  "from-[#8B5CF6] to-[#4C1D95] text-white",
  "from-[#FFC107] to-[#B07A00] text-[#1A1200]",
  "from-[#34D399] to-[#047857] text-white",
  "from-[#FB7185] to-[#9F1239] text-white",
];

function avatarFor(job: JobPost): { initials: string; gradient: string } {
  const source = job.team || job.title;
  const words = source.split(/[\s—–-]+/).filter(Boolean);
  const initials =
    (words[0]?.[0] ?? "I") + (words[1]?.[0] ?? words[0]?.[1] ?? "S");
  let hash = 0;
  for (let i = 0; i < job.id.length; i++) hash = (hash * 31 + job.id.charCodeAt(i)) | 0;
  const gradient = AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
  return { initials: initials.toUpperCase(), gradient };
}

function JobCard({ job, onOpen }: { job: JobPost; onOpen: () => void }) {
  const { initials, gradient } = avatarFor(job);
  const locationLabel = job.remote ? "Remote" : job.location;
  return (
    <article
      onClick={onOpen}
      className="group relative overflow-hidden rounded-[20px] border border-primary/70 bg-base-100 p-7 lg:p-8 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-16px_rgba(0,209,255,0.35)] hover:border-primary"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(0,209,255,0.10),transparent_70%)]"
      />

      <div className="relative flex items-start gap-5">
        <div
          aria-hidden
          className={`flex-shrink-0 size-14 rounded-2xl grid place-items-center font-sans font-bold text-[22px] tracking-tight bg-gradient-to-br ${gradient} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_18px_-10px_rgba(0,0,0,0.45)]`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-foreground">
              Intrastack
              <BadgeCheck className="size-3.5 text-primary" />
            </span>
            {job.team && (
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                {job.team}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center flex-wrap gap-x-3 gap-y-1 font-sans text-[12.5px] font-medium tracking-[0.04em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="size-3.5" />
              {EMPLOYMENT_LABELS[job.employment_type]}
            </span>
            <span className="size-[3px] rounded-full bg-base-300" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {locationLabel}
            </span>
            {job.seniority && (
              <>
                <span className="size-[3px] rounded-full bg-base-300" />
                <span>{job.seniority}</span>
              </>
            )}
          </div>

          <h3 className="mt-4 font-sans text-2xl md:text-[30px] font-bold leading-[1.15] tracking-tight text-foreground group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="mt-2.5 max-w-[68ch] text-[15px] leading-[1.55] text-muted-foreground">
            {job.short_description}
          </p>

          {job.tags?.length ? (
            <div className="mt-[18px] flex flex-wrap items-center gap-2">
              {job.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-secondary/35 bg-secondary/10 px-[11px] py-[5px] font-sans text-[13px] font-semibold text-secondary leading-tight"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {job.salary_range && (
          <div className="hidden md:block text-right flex-shrink-0">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
              Salary
            </div>
            <div className="mt-0.5 font-sans text-[22px] font-bold tracking-tight text-foreground">
              {job.salary_range}
            </div>
            <div className="mt-px text-xs text-muted-foreground">per year</div>
          </div>
        )}
      </div>

      <div className="relative my-5 h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,0.18)]" />
          {timeAgo(job.posted_at)}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Save job"
            onClick={(e) => e.stopPropagation()}
            className="size-[42px] rounded-[10px] border border-base-300 text-muted-foreground grid place-items-center transition hover:text-foreground hover:border-muted-foreground hover:bg-white/[0.03]"
          >
            <Bookmark className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={(e) => e.stopPropagation()}
            className="size-[42px] rounded-[10px] border border-base-300 text-muted-foreground grid place-items-center transition hover:text-foreground hover:border-muted-foreground hover:bg-white/[0.03]"
          >
            <Share2 className="size-[18px]" />
          </button>
          <Link
            href={`/register?role=${encodeURIComponent(job.slug)}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-[11px] font-sans text-[14.5px] font-bold text-primary-foreground shadow-[0_6px_20px_-10px_rgba(0,209,255,0.7)] transition hover:-translate-y-px hover:shadow-[0_12px_28px_-10px_rgba(0,209,255,0.8)]"
          >
            Apply now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
        {title}
      </h4>
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}
