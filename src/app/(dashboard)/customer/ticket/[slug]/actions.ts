"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { insertTicketReply } from "@/lib/db/ticketReplies";
import { notifyAllAdmins } from "@/lib/db/notifications";

export async function replyToTicketAsCustomer(ticketId: string, formData: FormData): Promise<void> {
  const user = await requireRole(["customer", "admin"]);
  const body = (formData.get("reply") as string | null)?.trim();
  if (!body) return;

  const supabase = await createSupabaseServerClient();

  // Verify the ticket belongs to this user before replying
  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, subject")
    .eq("id", ticketId)
    .eq("requester_id", user.id)
    .single();

  if (!ticket) return;

  await insertTicketReply(supabase, ticketId, user.id, body, false);

  await notifyAllAdmins(
    createAdminSupabaseClient(),
    "info",
    "New ticket reply",
    `New reply on ticket '${ticket.subject}'.`,
  );

  revalidatePath(`/customer/ticket/${ticketId}`);
}
