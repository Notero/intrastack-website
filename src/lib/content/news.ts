import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * News content lives in the Supabase table `news_items`, discriminated by
 * the `news_kind` enum (`'blog' | 'trend' | 'whitepaper' | 'client_story'`).
 *
 * Public list/detail pages call `fetchNewsList(kind)` and
 * `fetchNewsItem(kind, slug)`. Both are async and run on the server.
 * Returns an empty array / null when Supabase env vars are missing.
 */

export type NewsKind = "blog" | "trend" | "whitepaper" | "client_story" | "press";

export type NewsItem = {
  slug: string;
  kind: NewsKind;
  title: string;
  excerpt: string;
  body?: string | null;
  cover_image_path: string;
  image_2_path?: string | null;
  image_3_path?: string | null;
  published_at: string;
  tags: string[];
  author?: string | null;
  pages?: number | null;
  file_size?: string | null;
  file_url?: string | null;
  client?: string | null;
  industry?: string | null;
  metric_value?: string | null;
  metric_label?: string | null;
  read_time?: number | null;
};

const NEWS_COLUMNS =
  "slug,kind,title,excerpt,body,cover_image_path,image_2_path,image_3_path,published_at,tags,author,pages,file_size,file_url,client,industry,metric_value,metric_label,read_time";

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function fetchNewsList(kind: NewsKind): Promise<NewsItem[]> {
  if (!supabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_COLUMNS)
    .eq("kind", kind)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`[news] fetchNewsList(${kind}) failed:`, error.message);
    return [];
  }
  return (data ?? []) as NewsItem[];
}

export async function fetchNewsItem(
  kind: NewsKind,
  slug: string
): Promise<NewsItem | null> {
  if (!supabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_COLUMNS)
    .eq("kind", kind)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`[news] fetchNewsItem(${kind}, ${slug}) failed:`, error.message);
    return null;
  }
  return (data as NewsItem) ?? null;
}

/**
 * News items whose `tags` array overlaps with any of the given terms.
 * Used by industry / service / solution detail pages to surface related
 * coverage. Returns [] when Supabase is not configured or nothing matches.
 */
export async function fetchNewsByTags(
  terms: string[],
  limit = 3
): Promise<NewsItem[]> {
  if (!supabaseConfigured()) return [];
  const cleaned = terms.map((t) => t.trim()).filter(Boolean);
  if (cleaned.length === 0) return [];

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_COLUMNS)
    .eq("published", true)
    .overlaps("tags", cleaned)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[news] fetchNewsByTags failed:", error.message);
    return [];
  }
  return (data ?? []) as NewsItem[];
}

/**
 * Fetches latest items for each kind in parallel — used by the news hub page.
 */
export async function fetchNewsHub(): Promise<{
  blogs: NewsItem[];
  trends: NewsItem[];
  whitepapers: NewsItem[];
  stories: NewsItem[];
  press: NewsItem[];
}> {
  if (!supabaseConfigured()) {
    return { blogs: [], trends: [], whitepapers: [], stories: [], press: [] };
  }
  const [blogs, trends, whitepapers, stories, press] = await Promise.all([
    fetchNewsList("blog"),
    fetchNewsList("trend"),
    fetchNewsList("whitepaper"),
    fetchNewsList("client_story"),
    fetchNewsList("press"),
  ]);
  // Limit to reasonable counts for hub page
  return {
    blogs: blogs.slice(0, 3),
    trends: trends.slice(0, 8),
    whitepapers: whitepapers.slice(0, 2),
    stories: stories.slice(0, 3),
    press: press.slice(0, 5),
  };
}

/**
 * Latest published items across all kinds — used by the landing-page news
 * strip and any "recent updates" surface.
 */
export async function fetchLatestNews(limit = 3): Promise<NewsItem[]> {
  if (!supabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[news] fetchLatestNews failed:", error.message);
    return [];
  }
  return (data ?? []) as NewsItem[];
}
