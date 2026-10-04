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
  params: Promise<{ storyId: string }>;
}): Promise<Metadata> {
  const { storyId } = await params;
  const item = await fetchNewsItem("client_story", storyId);
  if (!item) return { title: "Not found · Intrastack" };
  return {
    title: `${item.title} · Intrastack`,
    description: item.excerpt,
    alternates: { canonical: `/news/client_stories/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      url: absoluteUrl(`/news/client_stories/${item.slug}`),
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
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  const [item, allStories] = await Promise.all([
    fetchNewsItem("client_story", storyId),
    fetchNewsList("client_story"),
  ]);
  if (!item) notFound();
  return (
    <NewsDetailPage
      item={item}
      config={{
        basePath: "/news/client_stories",
        crumb: "Client Stories",
        backLabel: "All client stories",
        relatedItems: allStories.filter((s) => s.slug !== storyId).slice(0, 4),
      }}
    />
  );
}
