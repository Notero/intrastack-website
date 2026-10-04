import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { SOLUTIONS } from "@/lib/content/solutions";
import { INDUSTRIES } from "@/lib/content/industries";
import { fetchNewsList, type NewsKind } from "@/lib/content/news";
import { fetchLeadershipMembers, fetchAdvisors } from "@/lib/content/leadership";

/**
 * Native Next.js sitemap. Lives at `/sitemap.xml` at runtime (or as a static
 * file at build time, depending on `revalidate`). Combines:
 *   - hand-listed static routes
 *   - content-map-driven routes (services / solutions / industries)
 *   - async-fetched dynamic routes (blog posts) — fetch swapped for your CMS some some
 */

// Re-fetch dynamic content every hour. Set to `false` for fully static, or
// a smaller number if your CMS publishes frequently.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about/leadership", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about/advisors", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about/mission_vision", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about/certifications", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about/partners", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about/life_intrastack", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about/delivery_centers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "weekly" },
  { path: "/industries", priority: 0.9, changeFrequency: "weekly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news/blogs", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news/trends", priority: 0.6, changeFrequency: "weekly" },
  { path: "/news/whitepaper", priority: 0.6, changeFrequency: "monthly" },
  { path: "/news/client_stories", priority: 0.6, changeFrequency: "monthly" },
  { path: "/news/intrastack", priority: 0.6, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

const NEWS_KINDS: { kind: NewsKind; basePath: string; priority: number }[] = [
  { kind: "blog", basePath: "/news/blogs", priority: 0.6 },
  { kind: "trend", basePath: "/news/trends", priority: 0.6 },
  { kind: "whitepaper", basePath: "/news/whitepaper", priority: 0.6 },
  { kind: "client_story", basePath: "/news/client_stories", priority: 0.6 },
  { kind: "press", basePath: "/news/intrastack", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const serviceEntries: Entry[] = Object.values(SERVICES).map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const solutionEntries: Entry[] = Object.values(SOLUTIONS).map((s) => ({
    url: absoluteUrl(`/solutions/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryEntries: Entry[] = Object.values(INDUSTRIES).map((i) => ({
    url: absoluteUrl(`/industries/${i.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const newsBuckets = await Promise.all(
    NEWS_KINDS.map(async ({ kind, basePath, priority }) => {
      const items = await fetchNewsList(kind);
      return items.map<Entry>((it) => ({
        url: absoluteUrl(`${basePath}/${it.slug}`),
        lastModified: new Date(it.published_at),
        changeFrequency: "weekly",
        priority,
      }));
    })
  );
  const newsEntries: Entry[] = newsBuckets.flat();

  const [leadershipMembers, advisors] = await Promise.all([
    fetchLeadershipMembers(),
    fetchAdvisors(),
  ]);
  const leadershipEntries: Entry[] = leadershipMembers.map((p) => ({
    url: absoluteUrl(`/about/leadership/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  const advisorEntries: Entry[] = advisors.map((p) => ({
    url: absoluteUrl(`/about/advisors/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  void SITE;

  return [
    ...staticEntries,
    ...serviceEntries,
    ...solutionEntries,
    ...industryEntries,
    ...newsEntries,
    ...leadershipEntries,
    ...advisorEntries,
  ];
}
