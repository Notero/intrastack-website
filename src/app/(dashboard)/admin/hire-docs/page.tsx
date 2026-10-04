import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { selectOnboardingDocumentsByApplicationIds } from "@/lib/db/onboardingDocuments";
import { PageHeader } from "../_components/PageHeader";
import { UploadForApplicantDialog } from "./UploadForApplicantDialog";

export const metadata = { title: "Hire Docs · Admin" };

export default async function AdminHireDocsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      id, status,
      job_posts(title),
      applicant_id
      `
    )
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const applicantIds = [...new Set((applications ?? []).map((a) => a.applicant_id))];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", applicantIds.length > 0 ? applicantIds : [""]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const applicationIds = (applications ?? []).map((a) => a.id);

  const { data: documents } = await selectOnboardingDocumentsByApplicationIds(supabase, applicationIds);

  type Doc = NonNullable<typeof documents>[number];
  const docsByApplication = new Map<string, Doc[]>();
  (documents ?? []).forEach((doc) => {
    const list = docsByApplication.get(doc.application_id) ?? [];
    list.push(doc);
    docsByApplication.set(doc.application_id, list);
  });

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Talent"
        title="Hire documents"
        description="Onboarding documents across all accepted applicants."
      />

      <Card>
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="text-base">All applicants</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(applications ?? []).map((app) => {
                const applicant = profileMap.get(app.applicant_id);
                const docs = docsByApplication.get(app.id) ?? [];
                const outstanding = docs.filter((d) => !d.downloaded_at).length;
                const downloaded = docs.filter((d) => d.downloaded_at).length;

                return (
                  <TableRow key={app.id}>
                    <TableCell className="pl-6 py-4">
                      <div className="font-semibold text-zinc-900">
                        {applicant?.full_name ?? applicant?.email ?? "Unknown"}
                      </div>
                      <div className="text-xs text-zinc-400">{applicant?.email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600">{app.job_posts?.title ?? "—"}</TableCell>
                    <TableCell>
                      {docs.length === 0 ? (
                        <span className="text-sm text-zinc-400">No documents</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {docs.map((d) => (
                            <div key={d.id} className="text-sm text-zinc-700">
                              {d.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {downloaded > 0 && (
                          <Badge variant="secondary" className="w-fit">
                            {downloaded} downloaded
                          </Badge>
                        )}
                        {outstanding > 0 && (
                          <Badge variant="outline" className="w-fit border-amber-300 text-amber-700">
                            {outstanding} outstanding
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <UploadForApplicantDialog applicationId={app.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {(applications ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-zinc-400">
                    No accepted applicants yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}