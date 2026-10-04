import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertTicketReply(
  db: DB,
  ticketId: string,
  authorId: string,
  body: string,
  isAdmin: boolean,
) {
  return db.from("ticket_replies").insert({
    ticket_id: ticketId,
    author_id: authorId,
    body,
    is_admin: isAdmin,
  });
}
