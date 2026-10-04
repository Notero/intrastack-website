import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { deleteJob, toggleJobPublished } from "./actions";
import { ReviewJobModal } from "./ReviewJobModal";

export const metadata = { title: "Jobs · Admin" };

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  temporary: "Temporary",
};

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: all = [] } = await supabase
    .from("job_posts")
    .select(`
      id, slug, title, team, location, remote, employment_type,
      seniority, salary_range, short_description, description,
      responsibilities, requirements, nice_to_have, tags,
      published, posted_at, created_at, recruiter_id,
      recruiter:profiles!job_posts_recruiter_id_fkey(full_name)
    `)
    .order("created_at", { ascending: true });

  const pending   = (all ?? []).filter((j) => !j.published && j.recruiter_id != null);
  const published = (all ?? []).filter((j) =>  j.published);

  return (
    <div className="w-full space-y-10">
      <PageHeader
        eyebrow="Talent"
        title="Job board"
        description="Review customer submissions and manage live listings."
        actions={
          <Button asChild>
            <Link href="/admin/jobs/new"><Plus className="mr-1.5 h-4 w-4" />New job</Link>
          </Button>
        }
      />

      {/* ── Pending review ─────────────────────────────────────────────────── */}
      <section>
        <Card>
          <CardHeader className="border-b border-brand-500 bg-brand-500/5">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base text-brand-500">Pending review</CardTitle>
              <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-brand-500">
                {pending.length}
              </span>
            </div>
            <p className="text-xs text-brand-500/70 mt-0.5">
              Customer submissions awaiting approval — oldest first.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Role</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((job) => {
                  const rec = Array.isArray(job.recruiter) ? job.recruiter[0] : job.recruiter;
                  const customerName = (rec as { full_name?: string | null } | null)?.full_name ?? "Unknown";
                  return (
                    <TableRow key={job.id} className="bg-brand-500/5">
                      <TableCell className="pl-6 py-4">
                        <div className="font-semibold text-zinc-900">{job.title}</div>
                        {job.seniority && <div className="text-xs text-zinc-400">{job.seniority}</div>}
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600">{customerName}</TableCell>
                      <TableCell className="text-sm text-zinc-600">
                        {job.location}{job.remote ? <Badge variant="secondary" className="ml-2">Remote</Badge> : null}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{TYPE_LABEL[job.employment_type] ?? job.employment_type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <ReviewJobModal job={{
                          id: job.id,
                          title: job.title,
                          team: job.team,
                          location: job.location,
                          remote: job.remote,
                          employment_type: job.employment_type,
                          seniority: job.seniority,
                          salary_range: job.salary_range,
                          short_description: job.short_description,
                          description: job.description,
                          responsibilities: job.responsibilities,
                          requirements: job.requirements,
                          nice_to_have: job.nice_to_have,
                          tags: job.tags,
                          created_at: job.created_at,
                          customer_name: customerName,
                        }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pending.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                      No pending submissions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* ── Published listings ──────────────────────────────────────────────── */}
      <section>
        <Card>
          <CardHeader className="border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Published listings</CardTitle>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                {published.length}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Live on the public careers board.</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Role</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {published.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="pl-6 py-4">
                      <div className="font-semibold text-zinc-900">{job.title}</div>
                      <div className="text-xs text-zinc-500">
                        {job.slug}{job.seniority ? ` · ${job.seniority}` : ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600">{job.team ?? "—"}</TableCell>
                    <TableCell className="text-sm text-zinc-600">
                      {job.location}{job.remote ? <Badge variant="secondary" className="ml-2">Remote</Badge> : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{TYPE_LABEL[job.employment_type] ?? job.employment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <form
                        action={async () => {
                          "use server";
                          await toggleJobPublished(job.id, !job.published);
                        }}
                      >
                        <Switch defaultChecked={job.published} type="submit" />
                      </form>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/jobs/${job.id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <form
                          action={async () => {
                            "use server";
                            await deleteJob(job.id);
                          }}
                        >
                          <SubmitButton variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </SubmitButton>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {published.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-zinc-500">
                      No published jobs yet.{" "}
                      <Link href="/admin/jobs/new" className="text-brand-500 underline">Create one</Link>.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
