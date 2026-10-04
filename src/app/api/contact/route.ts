import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { insertContactFormLead } from "@/lib/db/contactFormLeads";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";
import { clean, EMAIL_RE } from "@/lib/validation";
import { checkRateLimit, getClientKeyFromRequest } from "@/lib/rateLimit";

/**
 * POST /api/contact
 *
 * Persists submissions from the public "Reach Us" form into the Supabase
 * table `public.contact_form_leads`. The anon role's RLS policy permits
 * insert-only with `status = 'new'`; workflow fields are server-managed.
 *
 * If Supabase env vars are not configured, the route logs the payload and
 * returns success — useful for local development without secrets.
 */

const INTEREST_OPTIONS = new Set([
  "Cloud Transformation",
  "Cloud Migration",
  "AI & Machine Learning",
  "DevOps & Automation",
  "Data Analytics",
  "Security & Compliance",
  "Software Development",
  "Staff Augmentation",
  "IT Consulting",
  "Not sure yet",
]);

const BUDGET_OPTIONS = new Set([
  "<$25k",
  "$25-100k",
  "$100-250k",
  "$250k+",
  "Not sure",
]);

const TIMELINE_OPTIONS = new Set(["asap", "1-3m", "3-6m", "6m+", "exploring"]);

const COMPANY_SIZE_OPTIONS = new Set([
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
]);

const CONTACT_PREF_OPTIONS = new Set(["email", "phone"]);

type ContactPayload = {
  full_name: string;
  work_email: string;
  phone?: string | null;
  company?: string | null;
  job_title?: string | null;
  company_size?: string | null;
  interests?: string[];
  budget_range?: string | null;
  timeline?: string | null;
  message: string;
  preferred_contact?: string | null;
  nda_required?: boolean;
  newsletter_opt_in?: boolean;
  consent_to_contact?: boolean;
  consent_version?: string;
  source_path?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  // honeypot — should never be filled by a human
  website?: string;
};

function cleanList(v: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((s) => s && allowed.has(s))
    .slice(0, 20);
}

function constrain(v: unknown, allowed: Set<string>): string | null {
  const c = clean(v, 64);
  return c && allowed.has(c) ? c : null;
}

export async function POST(request: Request) {
  if (!(await checkRateLimit("contact", getClientKeyFromRequest(request)))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot: silently accept to keep bots happy.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const full_name = clean(body.full_name, 200);
  const work_email = clean(body.work_email, 254)?.toLowerCase() ?? null;
  const message = clean(body.message, 5000);

  if (!full_name || !work_email || !message) {
    return NextResponse.json(
      { error: "Name, work email, and message are required." },
      { status: 422 }
    );
  }
  if (!EMAIL_RE.test(work_email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please include at least a sentence about your project." },
      { status: 422 }
    );
  }
  if (body.consent_to_contact !== true || body.consent_version !== PRIVACY_POLICY_VERSION) {
    return NextResponse.json(
      { error: "Please agree to the current privacy policy to continue." },
      { status: 422 }
    );
  }

  const row = {
    full_name: full_name!,
    work_email: work_email!,
    phone: clean(body.phone, 64),
    company: clean(body.company, 200),
    job_title: clean(body.job_title, 200),
    company_size: constrain(body.company_size, COMPANY_SIZE_OPTIONS),
    interests: cleanList(body.interests, INTEREST_OPTIONS),
    budget_range: constrain(body.budget_range, BUDGET_OPTIONS),
    timeline: constrain(body.timeline, TIMELINE_OPTIONS),
    message: message!,
    preferred_contact: constrain(body.preferred_contact, CONTACT_PREF_OPTIONS),
    nda_required: body.nda_required === true,
    newsletter_opt_in: body.newsletter_opt_in === true,
    consent_to_contact: true,
    consent_version: body.consent_version,
    consent_given_at: new Date().toISOString(),
    source_path: clean(body.source_path, 500),
    utm_source: clean(body.utm_source, 128),
    utm_medium: clean(body.utm_medium, 128),
    utm_campaign: clean(body.utm_campaign, 128),
    user_agent: clean(request.headers.get("user-agent"), 500),
  } satisfies TablesInsert<"contact_form_leads">;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("[contact] supabase not configured — logging only:", row);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await insertContactFormLead(supabase, row);
    if (error) {
      console.error("[contact] insert failed:", error.message);
      return NextResponse.json(
        { error: "We couldn't save your message. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[contact] unexpected:", err);
    return NextResponse.json(
      { error: "We couldn't save your message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
