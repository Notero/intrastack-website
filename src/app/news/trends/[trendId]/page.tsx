import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetailPage from "@/components/public/templates/newsDetailPage";
import { fetchNewsItem, fetchNewsList } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { absoluteUrl } from "@/lib/seo/site";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trendId: string }>;
}): Promise<Metadata> {
  const { trendId } = await params;
  const item = await fetchNewsItem("trend", trendId);
  if (!item) return { title: "Not found · Intrastack" };
  return {
    title: `${item.title} · Intrastack`,
    description: item.excerpt,
    alternates: { canonical: `/news/trends/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      url: absoluteUrl(`/news/trends/${item.slug}`),
      images: newsImageUrl(item.cover_image_path) ? [{ url: newsImageUrl(item.cover_image_path)! }] : [],
      publishedTime: item.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      images: newsImageUrl(item.cover_image_path) ? [newsImageUrl(item.cover_image_path)!] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ trendId: string }>;
}) {
  const { trendId } = await params;
  const [item, allTrends] = await Promise.all([
    fetchNewsItem("trend", trendId),
    fetchNewsList("trend"),
  ]);
  if (!item) notFound();
  return (
    <NewsDetailPage
      item={item}
      config={{
        basePath: "/news/trends",
        crumb: "Tech News & Trends",
        backLabel: "All trends",
        relatedItems: allTrends.filter((t) => t.slug !== trendId).slice(0, 4),
      }}
    />
  );
}
