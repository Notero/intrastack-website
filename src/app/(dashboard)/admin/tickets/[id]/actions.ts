"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateTicket } from "@/lib/db/tickets";
import { insertTicketReply } from "@/lib/db/ticketReplies";
import { logTableEvent } from "@/lib/audit/logTableEvent";
import { insertNotification } from "@/lib/db/notifications";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

async function selectTicket(supabase: SupabaseClient<Database>, ticketId: string) {
  const { data } = await supabase.from("tickets").select("*").eq("id", ticketId).maybeSingle();
  return data;
}

export async function markInReview(ticketId: string): Promise<void> {
  const user = await requireRole("admin");
  const supabase = createAdminSupabaseClient();
  const before = await selectTicket(supabase, ticketId);
  await updateTicket(supabase, ticketId, { status: "in_progress" });
  await logTableEvent({
    actorId: user.id, actorRole: "admin", action: "ticket_marked_in_review",
    tableName: "tickets", rowId: ticketId, before, after: { status: "in_progress" },
  });
  if (before) {
    await insertNotification(supabase, {
      user_id: before.requester_id,
      kind: "info",
      title: `Your ticket '${before.subject}' is now in progress`,
      body: "An admin is reviewing your request.",
    });
  }
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}

export async function resolveTicket(ticketId: string): Promise<void> {
  const user = await requireRole("admin");
  const supabase = createAdminSupabaseClient();
  const before = await selectTicket(supabase, ticketId);
  const resolved_at = new Date().toISOString();
  await updateTicket(supabase, ticketId, { status: "resolved", resolved_at });
  await logTableEvent({
    actorId: user.id, actorRole: "admin", action: "ticket_resolved",
    tableName: "tickets", rowId: ticketId, before, after: { status: "resolved", resolved_at },
  });
  if (before) {
    await insertNotification(supabase, {
      user_id: before.requester_id,
      kind: "info",
      title: `Your ticket '${before.subject}' has been resolved`,
      body: "Reply to reopen it if you still need help.",
    });
  }
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}

export async function closeTicket(ticketId: string): Promise<void> {
  const user = await requireRole("admin");
  const supabase = createAdminSupabaseClient();
  const before = await selectTicket(supabase, ticketId);
  const closed_at = new Date().toISOString();
  await updateTicket(supabase, ticketId, { status: "closed", closed_at });
  await logTableEvent({
    actorId: user.id, actorRole: "admin", action: "ticket_closed",
    tableName: "tickets", rowId: ticketId, before, after: { status: "closed", closed_at },
  });
  if (before) {
    await insertNotification(supabase, {
      user_id: before.requester_id,
      kind: "info",
      title: `Your ticket '${before.subject}' has been closed`,
      body: "Open a new ticket if you need further assistance.",
    });
  }
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin/tickets");
}

export async function replyToTicket(ticketId: string, formData: FormData): Promise<void> {
  const user = await requireRole("admin");
  const body = (formData.get("body") as string | null)?.trim();
  if (!body) return;
  const supabase = createAdminSupabaseClient();
  await insertTicketReply(supabase, ticketId, user.id, body, true);
  await logTableEvent({
    actorId: user.id, actorRole: "admin", action: "ticket_reply_admin",
    tableName: "ticket_replies", rowId: ticketId, before: null, after: { body },
  });
  const ticket = await selectTicket(supabase, ticketId);
  if (ticket) {
    await insertNotification(supabase, {
      user_id: ticket.requester_id,
      kind: "info",
      title: `You have a new reply on your ticket '${ticket.subject}'`,
      body: "View the reply from your tickets page.",
    });
  }
  revalidatePath(`/admin/tickets/${ticketId}`);
}
