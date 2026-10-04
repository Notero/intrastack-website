import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicket } from "./actions";

export const metadata = { title: "Create Ticket · Customer" };

export default async function CreateTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(["customer", "admin"]);
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error === "missing_fields" ? "Please fill in all required fields." : `Error: ${error}`}
        </div>
      )}
      <PageHeader
        eyebrow="Support"
        title="Create a ticket"
        description="Submit a support request and our team will get back to you."
      />

      <form action={createTicket} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Ticket details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Subject <span className="text-red-500">*</span></Label>
              <Input name="subject" placeholder="Brief description of your issue" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Category</Label>
                <Select name="category" defaultValue="other">
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical issue</SelectItem>
                    <SelectItem value="job_listing">Job listing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Priority</Label>
                <Select name="priority" defaultValue="normal">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Description <span className="text-red-500">*</span></Label>
              <Textarea name="description" rows={6} placeholder="Describe your issue in detail…" required />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <a href="/customer/tickets">Cancel</a>
          </Button>
          <SubmitButton>Submit ticket</SubmitButton>
        </div>
      </form>
    </div>
  );
}
