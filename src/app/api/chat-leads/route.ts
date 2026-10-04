import { NextResponse } from "next/server";
import { saveChatLead, type ChatLeadInput } from "@/lib/leads/saveChatLead";

/**
 * POST /api/chat-leads
 *
 * Directly-callable endpoint for persisting a chatbot lead into
 * `public.chat_leads`. In normal operation, /api/chat/chat auto-saves the
 * lead server-side the moment the model has collected enough info — this route
 * exists for any client-triggered save (e.g. a future "email me this"
 * button) and shares the same validation/insert path via saveChatLead().
 */

type Payload = ChatLeadInput & {
  // honeypot — should never be filled by a human
  website?: string;
};

export async function POST(request: Request) {
  let body: Partial<Payload>;
  try {
    body = (await request.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot: silently accept to keep bots happy.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const result = await saveChatLead({
    ...body,
    user_agent: request.headers.get("user-agent"),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, persisted: result.persisted });
}
