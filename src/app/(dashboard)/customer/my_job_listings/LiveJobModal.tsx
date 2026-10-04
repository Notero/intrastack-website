"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Users } from "lucide-react";

export interface LiveJob {
  id: string;
  title: string;
  team: string | null;
  location: string;
  remote: boolean;
  employment_type: string;
  seniority: string | null;
  salary_range: string | null;
  short_description: string;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  nice_to_have: string[] | null;
  tags: string[] | null;
  created_at: string;
}

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  temporary: "Temporary",
};

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-400">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-700">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LiveJobModal({ job }: { job: LiveJob }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-w-0 items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-2.5 shadow-sm hover:border-green-400 hover:shadow-md transition-all text-left"
      >
        <span className="inline-block size-2 shrink-0 rounded-full bg-green-500" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-800">{job.title}</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-0.5"><MapPin className="size-3" />{job.location}</span>
            <span>·</span>
            <span>{TYPE_LABEL[job.employment_type] ?? job.employment_type}</span>
            {job.salary_range && <><span>·</span><span>{job.salary_range}</span></>}
            {job.remote && <Badge variant="secondary" className="text-[10px]">Remote</Badge>}
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{job.title}</DialogTitle>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <span className="inline-block size-1.5 rounded-full bg-green-500" />
              Live on careers board
            </div>
          </DialogHeader>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-2 border-y border-zinc-100 py-3">
            <Badge variant="outline" className="gap-1">
              <MapPin className="size-3" />
              {job.location}{job.remote && " · Remote"}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Briefcase className="size-3" />
              {TYPE_LABEL[job.employment_type] ?? job.employment_type}
              {job.seniority && ` · ${job.seniority}`}
            </Badge>
            {job.salary_range && (
              <Badge variant="outline" className="gap-1">
                <DollarSign className="size-3" />
                {job.salary_range}
              </Badge>
            )}
            {job.team && (
              <Badge variant="secondary" className="gap-1">
                <Users className="size-3" />
                {job.team}
              </Badge>
            )}
          </div>

          <div className="space-y-5 py-1">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-1">Summary</h4>
              <p className="text-sm text-zinc-700 leading-relaxed">{job.short_description}</p>
            </div>

            {job.description && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-1">Full description</h4>
                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            <Section title="Responsibilities" items={job.responsibilities ?? []} />
            <Section title="Requirements"     items={job.requirements ?? []} />
            <Section title="Nice to have"     items={job.nice_to_have ?? []} />

            {(job.tags ?? []).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-400">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags!.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-zinc-400 pt-2 border-t border-zinc-100">
              Listed {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
