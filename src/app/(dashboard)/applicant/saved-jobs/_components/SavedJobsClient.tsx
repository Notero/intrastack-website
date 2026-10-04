"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Bookmark, BookmarkX, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EMPLOYMENT_LABELS, type JobPost } from "@/lib/content/jobs";
import { unsaveJobAction } from "../actions";

function daysAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
}

export function SavedJobsClient({ initialJobs }: { initialJobs: JobPost[] }) {
  const [saved, setSaved] = useState(initialJobs);
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleUnsave(jobId: string) {
    setRemoving(jobId);
    setSaved((prev) => prev.filter((j) => j.id !== jobId));
    await unsaveJobAction(jobId);
    setRemoving(null);
  }

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-300 py-20 text-center">
        <Bookmark className="size-10 text-zinc-300" />
        <p className="text-sm text-zinc-500">No saved jobs yet.</p>
        <Button asChild variant="outline">
          <Link href="/careers">Browse Open Roles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {saved.map((job) => (
        <div key={job.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-zinc-900">{job.title}</h3>
                {job.seniority && (
                  <Badge variant="outline" className="text-xs">{job.seniority}</Badge>
                )}
              </div>
              {job.team && <p className="mt-0.5 text-sm text-zinc-600">{job.team}</p>}
              <p className="mt-2 text-sm text-zinc-500">{job.short_description}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><MapPin className="size-3" />{job.location}{job.remote && " · Remote"}</span>
                <span className="flex items-center gap-1"><Clock className="size-3" />{EMPLOYMENT_LABELS[job.employment_type]}</span>
                {job.salary_range && <span>{job.salary_range}</span>}
                <span className="ml-auto">{daysAgo(job.posted_at)}</span>
              </div>
              {job.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => <Badge key={tag} className="text-xs font-normal">{tag}</Badge>)}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="gap-1">
                <Link href="/careers">Apply <ExternalLink className="size-3" /></Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                disabled={removing === job.id}
                onClick={() => handleUnsave(job.id)}
              >
                <BookmarkX className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
