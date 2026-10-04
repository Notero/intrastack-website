import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export type MeetingStatus = Enums<"meeting_status">;

export function insertMeeting(db: DB, row: TablesInsert<"meetings">) {
  return db.from("meetings").insert(row);
}

export function updateMeetingStatus(
  db: DB,
  id: string,
  status: MeetingStatus,
  scheduledAt?: string | null,
  meetingLink?: string | null,
) {
  const patch: TablesUpdate<"meetings"> = { status };
  if (scheduledAt !== undefined) patch.scheduled_at = scheduledAt;
  if (meetingLink !== undefined) patch.meeting_link = meetingLink;
  return db.from("meetings").update(patch).eq("id", id);
}
