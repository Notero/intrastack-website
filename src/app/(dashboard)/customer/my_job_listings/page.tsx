import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePlus, MapPin, Clock, CheckCircle, XCircle, Undo2, Radio, Users } from "lucide-react";
import { withdrawJobListing } from "./actions";
import { LiveJobModal } from "./LiveJobModal";

export const metadata = { title: "My Job Listings · Customer" };

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  temporary: "Temporary",
};

const OUTCOME_LABEL: Record<string, string> = {
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export default async function MyJobListingsPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const [{ data: active = [] }, { data: history = [] }] = await Promise.all([
    supabase
      .from("job_posts")
      .select("id,title,team,location,remote,employment_type,seniority,salary_range,short_description,description,responsibilities,requirements,nice_to_have,tags,published,created_at")
      .eq("recruiter_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_post_history")
      .select("id,title,location,remote,employment_type,seniority,outcome,outcome_at,reason,salary_range")
      .eq("recruiter_id", user.id)
      .order("outcome_at", { ascending: false }),
  ]);

  const pending  = (active  ?? []).filter((j) => !j.published);
  const live     = (active  ?? []).filter((j) =>  j.published);
  const approved = (history ?? []).filter((h) => h.outcome === "approved");
  const rejected = (history ?? []).filter((h) => h.outcome === "rejected" || h.outcome === "withdrawn");

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Jobs"
        title="My job listings"
        description="Track your submissions — pending review, live on the board, and past outcomes."
        actions={
          <Button asChild>
            <Link href="/customer/list_job">
              <FilePlus className="mr-1.5 h-4 w-4" />List a job
            </Link>
          </Button>
        }
      />

      {/* ── Full-width live listings banner ───────────────────────────────── */}
      {live.length > 0 && (
        <div className="w-full rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/40 px-6 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="size-4 text-green-600 animate-pulse" />
            <span className="text-sm font-bold text-green-800">Live on careers board</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
              {live.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {live.map((job) => (
              <div key={job.id} className="flex items-stretch gap-1.5">
                <LiveJobModal job={job} />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-auto self-stretch border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <Link href={`/customer/my_job_listings/${job.id}/talent`}>
                    <Users className="size-3.5" />Talent
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3-column history boxes ────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Under Review */}
        <div className="flex flex-col rounded-xl border border-brand-500 bg-brand-500/5">
          <div className="flex items-center gap-2 border-b border-brand-500 px-5 py-4">
            <Clock className="size-4 text-brand-500" />
            <h2 className="text-sm font-bold text-brand-500">Under Review</h2>
            <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-brand-500">
              {pending.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-amber-100/60">
            {pending.map((job) => (
              <div key={job.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-800">{job.title}</div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                      <MapPin className="size-3" />{job.location}
                      {job.remote && <Badge variant="secondary" className="ml-1 text-[10px]">Remote</Badge>}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400">
                      {TYPE_LABEL[job.employment_type] ?? job.employment_type}
                      {job.seniority ? ` · ${job.seniority}` : ""}
                    </div>
                  </div>
                  <form action={withdrawJobListing.bind(null, job.id)} className="shrink-0">
                    <button
                      type="submit"
                      title="Withdraw"
                      className="mt-0.5 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Undo2 className="size-3.5" />
                    </button>
                  </form>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400">
                  Submitted {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="px-5 py-8 text-center text-xs text-zinc-400">
                No pending submissions.
              </div>
            )}
          </div>
        </div>

        {/* Accepted — history only */}
        <div className="flex flex-col rounded-xl border border-green-200 bg-green-50/30">
          <div className="flex items-center gap-2 border-b border-green-100 px-5 py-4">
            <CheckCircle className="size-4 text-green-600" />
            <h2 className="text-sm font-bold text-green-800">Accepted</h2>
            <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
              {approved.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-green-100/60">
            {approved.map((h) => (
              <div key={h.id} className="px-5 py-3">
                <div className="truncate text-sm font-semibold text-zinc-800">{h.title}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                  <MapPin className="size-3" />{h.location}
                  {h.remote && <Badge variant="secondary" className="ml-1 text-[10px]">Remote</Badge>}
                </div>
                <div className="mt-1 text-[11px] text-zinc-400">
                  {TYPE_LABEL[h.employment_type] ?? h.employment_type}
                  {h.seniority ? ` · ${h.seniority}` : ""}
                </div>
                <div className="mt-1 text-[10px] text-zinc-400">
                  Approved {new Date(h.outcome_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {approved.length === 0 && (
              <div className="px-5 py-8 text-center text-xs text-zinc-400">
                No accepted listings yet.
              </div>
            )}
          </div>
        </div>

        {/* Rejected / Withdrawn — history only */}
        <div className="flex flex-col rounded-xl border border-red-200 bg-red-50/20">
          <div className="flex items-center gap-2 border-b border-red-100 px-5 py-4">
            <XCircle className="size-4 text-red-500" />
            <h2 className="text-sm font-bold text-red-700">Rejected</h2>
            <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              {rejected.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-red-100/60">
            {rejected.map((h) => (
              <div key={h.id} className="px-5 py-3">
                <div className="mb-0.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${h.outcome === "withdrawn" ? "text-zinc-500" : "text-red-500"}`}>
                    {OUTCOME_LABEL[h.outcome]}
                  </span>
                </div>
                <div className="truncate text-sm font-semibold text-zinc-700">{h.title}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                  <MapPin className="size-3" />{h.location}
                </div>
                {h.reason && (
                  <div className="mt-1.5 rounded bg-red-50 px-2 py-1 text-[11px] text-red-600 leading-snug">
                    {h.reason}
                  </div>
                )}
                <div className="mt-1 text-[10px] text-zinc-400">
                  {new Date(h.outcome_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {rejected.length === 0 && (
              <div className="px-5 py-8 text-center text-xs text-zinc-400">
                No rejections.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
