import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { insertWhitepaperLead } from "@/lib/db/whitepaperLeads";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";
import { clean, EMAIL_RE } from "@/lib/validation";
import { checkRateLimit, getClientKeyFromRequest } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!(await checkRateLimit("whitepaperLead", getClientKeyFromRequest(request)))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = clean(body.email, 254)?.toLowerCase() ?? null;
  const intent = clean(body.intent, 1000);
  const slug = clean(body.slug, 200);
  const title = clean(body.title, 500);

  if (!email || !slug) {
    return NextResponse.json({ error: "Email and slug are required." }, { status: 422 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }
  if (body.consent !== true || body.consent_version !== PRIVACY_POLICY_VERSION) {
    return NextResponse.json(
      { error: "Please agree to the current privacy policy to continue." },
      { status: 422 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("[whitepaper-lead] supabase not configured — logging:", { email, slug });
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await insertWhitepaperLead(supabase, {
      email,
      intent,
      news_item_slug: slug,
      news_item_title: title,
      consent_given: true,
      consent_version: body.consent_version as string,
      consent_given_at: new Date().toISOString(),
    } satisfies TablesInsert<"whitepaper_leads">);

    if (error) {
      console.error("[whitepaper-lead] insert failed:", error.message);
      return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
    }
  } catch (err) {
    console.error("[whitepaper-lead] unexpected:", err);
    return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true }, { status: 201 });
}
