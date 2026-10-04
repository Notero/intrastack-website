import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { submitJobListing } from "./actions";
import { SalaryRangeSlider } from "./SalaryRangeSlider";

export const metadata = { title: "List a Job · Customer" };

export default async function ListJobPage() {
  await requireRole(["customer", "admin"]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Jobs"
        title="List a job"
        description="Submit a new job post for review. Once approved it will appear on the public careers board."
      />

      <form action={submitJobListing} className="space-y-6">
        {/* Position details */}
        <Card>
          <CardHeader><CardTitle>Position details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Job title <span className="text-red-500">*</span>
              </Label>
              <Input name="title" placeholder="e.g. Senior Cloud Engineer" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Team / Department</Label>
                <Input name="team" placeholder="e.g. Cloud Engineering" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Seniority</Label>
                <Input name="seniority" placeholder="e.g. Senior, Staff, Lead" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input name="location" placeholder="e.g. Las Vegas, NV" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Employment type <span className="text-red-500">*</span>
                </Label>
                <Select name="employment_type" defaultValue="full_time">
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Salary range (USD / year)</Label>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-3">
                <SalaryRangeSlider />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Remote</div>
                <div className="text-xs text-zinc-500">Position allows remote work</div>
              </div>
              <Switch name="remote" />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Short description <span className="text-red-500">*</span>
              </Label>
              <Textarea name="short_description" rows={2} placeholder="1–2 sentences shown on the job card." required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Full description</Label>
              <Textarea name="description" rows={6} placeholder="Full job description in the detail view." />
            </div>
          </CardContent>
        </Card>

        {/* Role details */}
        <Card>
          <CardHeader><CardTitle>Role details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Responsibilities
              </Label>
              <Textarea name="responsibilities" rows={4} placeholder="One item per line." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Requirements
              </Label>
              <Textarea name="requirements" rows={4} placeholder="One item per line." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Nice to have</Label>
              <Textarea name="nice_to_have" rows={3} placeholder="One item per line." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Tags
              </Label>
              <Input name="tags" placeholder="e.g. AWS, Kubernetes, Terraform (comma-separated)" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <a href="/customer/my_job_listings">Cancel</a>
          </Button>
          <SubmitButton>Submit for review</SubmitButton>
        </div>
      </form>
    </div>
  );
}
