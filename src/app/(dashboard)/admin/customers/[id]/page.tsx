import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Briefcase, Star } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../../_components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { verifyCustomer, unverifyCustomer } from "./actions";

export const metadata = { title: "Customer detail · Admin" };

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time", part_time: "Part-time", contract: "Contract",
  freelance: "Freelance", internship: "Internship", temporary: "Temporary",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, display_name, phone, status, created_at, last_sign_in_at")
    .eq("id", id)
    .eq("role", "customer")
    .single();
  if (error || !profile) notFound();

  const { data: rp } = await supabase
    .from("customer_profiles")
    .select("company_name, title, linkedin_url, verified, verified_at")
    .eq("id", id)
    .single();

  const { data: jobs } = await supabase
    .from("job_posts")
    .select("id, title, location, employment_type, published, posted_at")
    .eq("recruiter_id", id)
    .order("posted_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-3.5" /> Back to customers
      </Link>

      <PageHeader
        eyebrow="Customers"
        title={profile.full_name ?? profile.email ?? "Customer"}
        description={profile.email ?? ""}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile</CardTitle>
                {rp?.verified
                  ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"><CheckCircle className="size-3" />Verified</span>
                  : <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500"><XCircle className="size-3" />Unverified</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row label="Company" value={rp?.company_name ?? "—"} />
              <Row label="Title" value={rp?.title ?? "—"} />
              <Row label="Phone" value={profile.phone ?? "—"} />
              <Row label="Status" value={profile.status} />
              <Row label="Joined" value={profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"} />
              <Row label="Last sign-in" value={profile.last_sign_in_at ? new Date(profile.last_sign_in_at).toLocaleDateString() : "Never"} />
              {rp?.linkedin_url && (
                <a href={rp.linkedin_url} target="_blank" rel="noreferrer" className="block text-xs text-brand-500 underline">LinkedIn profile</a>
              )}
            </CardContent>
          </Card>

          {/* Verify / manage actions */}
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <form action={rp?.verified ? unverifyCustomer.bind(null, id) : verifyCustomer.bind(null, id)}>
                <SubmitButton variant={rp?.verified ? "outline" : "default"} className="w-full" size="sm">
                  {rp?.verified ? "Remove verification" : "Verify customer"}
                </SubmitButton>
              </form>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href={`/admin/users/${id}`}>Edit account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Job listings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-zinc-400" />
                <CardTitle>Job listings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Posted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(jobs ?? []).map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="pl-6 py-3 font-medium text-zinc-800">{job.title}</TableCell>
                      <TableCell><Badge variant="outline">{TYPE_LABEL[job.employment_type] ?? job.employment_type}</Badge></TableCell>
                      <TableCell className="text-sm text-zinc-500">{job.location}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {job.published ? "Live" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-sm text-zinc-500">
                        {new Date(job.posted_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(jobs?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-400">No job listings yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Matches — scaffold */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="size-4 text-zinc-400" />
                <CardTitle>Candidate matches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-zinc-200 px-6 py-10 text-center">
                <p className="text-sm font-medium text-zinc-500">Matching engine not yet connected.</p>
                <p className="mt-1 text-xs text-zinc-400">Candidate matches will appear here once the matching system is live.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      <span className="text-sm text-zinc-700 capitalize">{value}</span>
    </div>
  );
}
