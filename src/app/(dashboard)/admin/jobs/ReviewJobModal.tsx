"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { approveJob, rejectJob } from "./actions";

export interface PendingJob {
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
  customer_name: string;
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

export function ReviewJobModal({ job }: { job: PendingJob }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Review
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{job.title}</DialogTitle>
            <p className="text-xs text-zinc-400">
              Submitted by <span className="font-semibold text-zinc-600">{job.customer_name}</span>
              {" · "}{new Date(job.created_at).toLocaleDateString()}
            </p>
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
              <Badge variant="secondary">{job.team}</Badge>
            )}
          </div>

          {/* Content */}
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
          </div>

          <DialogFooter className="gap-2 border-t border-zinc-100 pt-4">
            <form action={rejectJob.bind(null, job.id)}>
              <SubmitButton
                variant="destructive"
                className="gap-1.5"
              >
                <XCircle className="size-4" /> Reject
              </SubmitButton>
            </form>
            <form action={approveJob.bind(null, job.id)}>
              <SubmitButton
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="size-4" /> Approve
              </SubmitButton>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
