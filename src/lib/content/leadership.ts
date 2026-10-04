import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Leadership + Board of Advisors content lives in the Supabase table
 * `leadership_people`, discriminated by the `group_name` enum
 * (`'founder' | 'executive' | 'vp' | 'director' | 'advisor'`) — same "one table, one
 * discriminator" shape as `news_items`/`news_kind`.
 *
 * Public pages call `fetchLeadershipMembers()` / `fetchAdvisors()` for the
 * list pages and `fetchLeadershipPerson(slug)` for both detail routes.
 * Returns empty array / null when Supabase isn't configured; never throws.
 */

export type LeadershipGroup = "founder" | "executive" | "vp" | "director" | "advisor";

export type Highlight = { title: string; body: string };

export type LeadershipPerson = {
  slug: string;
  name: string;
  title: string;
  group_name: LeadershipGroup;
  region?: string | null;
  photo_path?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  intro: string[];
  highlights: Highlight[];
  closing?: string | null;
  certifications: string[];
  display_order: number;
};

const COLUMNS =
  "slug,name,title,group_name,region,photo_path,email,phone,linkedin_url,instagram_url,twitter_url,intro,highlights,closing,certifications,display_order";

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function fetchLeadershipMembers(): Promise<LeadershipPerson[]> {
  if (!supabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leadership_people")
    .select(COLUMNS)
    .in("group_name", ["executive", "vp", "director"])
    .eq("published", true)
    .order("group_name", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[leadership] fetchLeadershipMembers failed:", error.message);
    return [];
  }
  return (data ?? []) as LeadershipPerson[];
}

export async function fetchFounder(): Promise<LeadershipPerson | null> {
  if (!supabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leadership_people")
    .select(COLUMNS)
    .eq("group_name", "founder")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[leadership] fetchFounder failed:", error.message);
    return null;
  }
  return (data as LeadershipPerson) ?? null;
}

export async function fetchAdvisors(): Promise<LeadershipPerson[]> {
  if (!supabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leadership_people")
    .select(COLUMNS)
    .eq("group_name", "advisor")
    .eq("published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[leadership] fetchAdvisors failed:", error.message);
    return [];
  }
  return (data ?? []) as LeadershipPerson[];
}

export async function fetchLeadershipPerson(slug: string): Promise<LeadershipPerson | null> {
  if (!supabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leadership_people")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`[leadership] fetchLeadershipPerson(${slug}) failed:`, error.message);
    return null;
  }
  return (data as LeadershipPerson) ?? null;
}
