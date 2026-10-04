import { SERVICES } from "@/lib/content/services";
import { SOLUTIONS } from "@/lib/content/solutions";
import { INDUSTRIES } from "@/lib/content/industries";
import { fetchLatestNews } from "@/lib/content/news";
import type { NewsKind } from "@/lib/content/news";

/**
 * Builds the chatbot's knowledge of the site from the same data the pages
 * render from, so it can never drift out of sync with the real site.
 *
 * Adding a new service/solution/industry page automatically teaches the bot
 * about it — no prompt editing required.
 */

const NEWS_ROUTES: Record<NewsKind, string> = {
  blog: "/news/blogs",
  trend: "/news/trends",
  whitepaper: "/news/whitepaper",
  client_story: "/news/client_stories",
  press: "/news/intrastack",
};

const STATIC_ROUTES = [
  "/ — Home",
  "/about — About Us",
  "/about/leadership — Leadership team",
  "/about/mission_vision — Mission & vision",
  "/about/certifications — Certifications",
  "/about/partners — Partners",
  "/about/delivery_centers — Delivery centers",
  "/about/life_intrastack — Life at IntraStack",
  "/careers — Open roles",
  "/contact — Contact form",
  "/news — News hub",
].join("\n");

/** Page copy uses [[...]] to mark emphasized spans for styling — strip it for plain-text prompt use. */
function plain(text: string): string {
  return text.replace(/\[\[|\]\]/g, "");
}

function catalog(entries: { slug: string; name: string; lede?: string }[], base: string): string {
  return entries
    .map((e) => `${base}/${e.slug} — ${e.name}${e.lede ? `: ${plain(e.lede)}` : ""}`)
    .join("\n");
}

// Every chat turn calls buildSiteContext(); cache the result briefly so a
// back-and-forth conversation doesn't re-hit Supabase for news on each message.
let cache: { value: string; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60_000;

export async function buildSiteContext(): Promise<string> {
  if (cache && cache.expiresAt > Date.now()) return cache.value;

  const services = catalog(Object.values(SERVICES), "/services");
  const solutions = catalog(Object.values(SOLUTIONS), "/solutions");
  const industries = catalog(Object.values(INDUSTRIES), "/industries");

  const latest = await fetchLatestNews(6);
  const news = latest.length
    ? latest
        .map((n) => `${NEWS_ROUTES[n.kind]}/${n.slug} — "${n.title}" (${n.kind})`)
        .join("\n")
    : "(No published articles available right now.)";

  const value = `SERVICE PAGES:
${services}

SOLUTION PAGES:
${solutions}

INDUSTRY PAGES:
${industries}

OTHER PAGES:
${STATIC_ROUTES}

LATEST PUBLISHED ARTICLES:
${news}`;

  cache = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}
