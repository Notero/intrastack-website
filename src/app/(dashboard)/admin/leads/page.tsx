import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../_components/PageHeader";
import { LeadsTable } from "./LeadsTable";
import { DeleteLeadsByEmailForm } from "./DeleteLeadsByEmailForm";

export const metadata = { title: "Leads · Admin" };

export type LeadRow = {
  id: string;
  created_at: string;
  source: "contact_form" | "whitepaper_download" | "newsletter_signup" | "chatbot";
  email: string;
  name: string | null;
  intent: string | null;
  resource_slug: string | null;
  resource_title: string | null;
  notes: string | null;
  status: string | null;
};

export default async function LeadsPage() {
  await requireRole("admin");
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("leads_pool")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) console.error("[leads] fetch failed:", error.message);

  const leads = (data ?? []) as LeadRow[];

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Platform"
        title="Leads"
        description="All inbound leads across contact forms, whitepaper downloads, and the chat widget."
        actions={<DeleteLeadsByEmailForm />}
      />
      <LeadsTable leads={leads} />
    </div>
  );
}
