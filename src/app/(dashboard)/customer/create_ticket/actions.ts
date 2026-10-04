"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { insertTicket } from "@/lib/db/tickets";

const CATEGORIES = ["billing", "technical", "job_listing", "account", "other"] as const;
const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export async function createTicket(formData: FormData): Promise<never> {
  const user = await requireRole(["customer", "admin"]);

  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const categoryRaw = (formData.get("category") as string | null) ?? "other";
  const priorityRaw = (formData.get("priority") as string | null) ?? "normal";
  const category = CATEGORIES.includes(categoryRaw as typeof CATEGORIES[number]) ? (categoryRaw as typeof CATEGORIES[number]) : "other";
  const priority = PRIORITIES.includes(priorityRaw as typeof PRIORITIES[number]) ? (priorityRaw as typeof PRIORITIES[number]) : "normal";

  if (!subject || !description) redirect("/customer/create_ticket");

  const supabase = await createSupabaseServerClient();
  const { error } = await insertTicket(supabase, {
    requester_id: user.id,
    subject,
    description,
    category,
    priority,
  });

  if (error) {
    console.error("[createTicket]", error.message);
    redirect(`/customer/create_ticket?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/customer/tickets");
}
