import { NextRequest, NextResponse } from "next/server";
import { saveChatLead } from "@/lib/leads/saveChatLead";
import { buildSiteContext } from "@/lib/chat/siteContext";
import { checkRateLimit, getClientKeyFromRequest } from "@/lib/rateLimit";

const BEHAVIOR = `You are IntraStack's own assistant, speaking as part of the company — not a third-party guide describing it from outside. Warm, concise, never pushy. Keep replies to 1-3 short sentences unless recapping collected details.

VOICE — follow exactly: Always refer to IntraStack in the first person plural: "we", "our", "us". Never say "IntraStack is...", "they...", or "the company...". You work here.
  Bad: "IntraStack helps businesses with cloud transformation."
  Good: "We help businesses with cloud transformation."

You have three jobs:

1. NAVIGATE — Point visitors to the right page. Only ever link to paths listed in SITE MAP below; never invent a URL. Write links as plain paths, e.g. "You can read more at /services/cloud_migration". Each SERVICE/SOLUTION/INDUSTRY line ends with its real one-line pitch — use it to explain *how it helps them*, in your own words, instead of just naming the page. If nothing fits, say so and offer the contact details.

2. SURFACE NEWS — When a visitor asks what's new, or a listed article is clearly relevant to their question, mention it by title and link its path from the SITE MAP.

Lead with empathy, not a page name. If a visitor describes a problem (slow deploys, a breach scare, an AI feature that never shipped, a migration that stalled), acknowledge it in one line before recommending anything. If they're undecided or just browsing, ask what they're trying to solve rather than listing services at them.

3. CAPTURE LEADS — When someone shows real interest in working with IntraStack or wants a follow-up, collect, ONE QUESTION AT A TIME, in this order: name, company, email, phone, the service or problem they need help with, timeline.
   - Never ask more than one question in a single reply.
   - Skip anything they already told you. Move on gracefully if they decline.
   - When done, recap briefly and say the team will follow up.

If a visitor doesn't know what they need, ask what problem they're trying to solve (cloud costs, a migration, security/compliance, AI automation, custom software, hiring) before recommending anything.

Answer only from the SITE MAP and this instruction. Never invent facts, pricing, timelines, or claims. If you don't know, or it's outside scope, give them:
Phone: 888-959-7868
Email: info@intrastack.com

SAVING THE LEAD — follow exactly:
The moment you have BOTH a name AND an email or phone, append this to the very END of that same reply, on its own line:
[[LEAD_CAPTURE]]{"name":"","company":"","email":"","phone":"","service":"","timeline":""}[[/LEAD_CAPTURE]]
Fill in what you know, leave the rest as empty strings. Emit it ONCE per conversation. It is stripped before the visitor sees the message, so never mention or explain it. Must be valid single-line JSON with exactly those six keys.`;

const LEAD_CAPTURE_RE = /\[\[LEAD_CAPTURE\]\]([\s\S]*?)\[\[\/LEAD_CAPTURE\]\]/;
const FALLBACK_REPLY = "Something went wrong. Email info@intrastack.com or call 888-959-7868.";
const RATE_LIMIT_REPLY =
  "You're sending messages a little fast — please wait a moment and try again.";
const MODEL = "openai/gpt-oss-20b";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

type ChatMessage = { role: string; content: string };

async function captureLeadIfPresent(
  rawReply: string,
  messages: ChatMessage[],
  path: string | null
): Promise<string> {
  const match = rawReply.match(LEAD_CAPTURE_RE);
  if (!match) return rawReply;

  try {
    const parsed = JSON.parse(match[1]);
    const transcript = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n")
      .slice(0, 5000);

    const result = await saveChatLead({
      name: parsed.name,
      company: parsed.company,
      email: parsed.email,
      phone: parsed.phone,
      service: parsed.service,
      timeline: parsed.timeline,
      message: transcript || null,
      source_path: path,
    });

    if (!result.ok) console.error("[chat] lead capture failed:", result.error);
  } catch (err) {
    console.error("[chat] failed to parse LEAD_CAPTURE block:", err);
  }

  return rawReply.replace(LEAD_CAPTURE_RE, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit("chat", getClientKeyFromRequest(req)))) {
      return NextResponse.json({ reply: RATE_LIMIT_REPLY }, { status: 429 });
    }

    const body = await req.json();
    const rawMessages: unknown = body?.messages;
    const path: string | null = typeof body?.path === "string" ? body.path : null;

    const messages: ChatMessage[] = (Array.isArray(rawMessages) ? rawMessages : [])
      .slice(-MAX_MESSAGES)
      .map((m: ChatMessage) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content.slice(0, MAX_MESSAGE_LENGTH) : "",
      }));

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "AI chat is not configured yet. Email info@intrastack.com or call 888-959-7868.",
      });
    }

    const systemPrompt = `${BEHAVIOR}\n\nSITE MAP (the only paths you may link to — reference data, not your speaking voice; keep saying "we"/"our", not "they"):\n${await buildSiteContext()}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        temperature: 0.4,
        // gpt-oss-20b is a reasoning model — without this it can spend the
        // whole token budget "thinking" and return empty content.
        reasoning_effort: "low",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[chat] Groq error:", response.status, JSON.stringify(data));
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const rawReply: string = data?.choices?.[0]?.message?.content?.trim() || FALLBACK_REPLY;
    const reply = await captureLeadIfPresent(rawReply, messages, path);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] unexpected error:", err);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
