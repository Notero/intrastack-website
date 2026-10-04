import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { insertChatLead } from "@/lib/db/chatLeads";
import { clean, EMAIL_RE } from "@/lib/validation";

/**
 * Shared save path for chatbot leads, used by both:
 *  - /api/chat/chat (auto-saves the moment the model has collected enough info)
 *  - /api/chat-leads (a directly callable endpoint, e.g. for a future
 *    "email me this conversation" button or manual retry)
 *
 * Validates, cleans, and inserts into `public.chat_leads`. Never throws —
 * returns a result object so callers can decide how to respond.
 */

export type ChatLeadInput = {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  service?: string | null;
  timeline?: string | null;
  message?: string | null;
  source_path?: string | null;
  user_agent?: string | null;
};

export type SaveChatLeadResult =
  | { ok: true; persisted: boolean }
  | { ok: false; error: string; status: number };

export async function saveChatLead(input: ChatLeadInput): Promise<SaveChatLeadResult> {
  const name = clean(input.name, 200);
  const email = clean(input.email, 254)?.toLowerCase() ?? null;
  const phone = clean(input.phone, 64);

  if (!name) {
    return { ok: false, error: "Name is required.", status: 422 };
  }
  if (!email && !phone) {
    return { ok: false, error: "An email or phone number is required.", status: 422 };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email address.", status: 422 };
  }

  const row = {
    name,
    email,
    phone,
    company: clean(input.company, 200),
    service: clean(input.service, 500),
    timeline: clean(input.timeline, 200),
    message: clean(input.message, 5000),
    source_path: clean(input.source_path, 500),
    user_agent: clean(input.user_agent, 500),
  } satisfies TablesInsert<"chat_leads">;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("[chat-leads] supabase not configured — logging only:", row);
    return { ok: true, persisted: false };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await insertChatLead(supabase, row);
    if (error) {
      console.error("[chat-leads] insert failed:", error.message);
      return { ok: false, error: "We couldn't save your info. Please try again.", status: 500 };
    }
  } catch (err) {
    console.error("[chat-leads] unexpected:", err);
    return { ok: false, error: "We couldn't save your info. Please try again.", status: 500 };
  }

  return { ok: true, persisted: true };
}
