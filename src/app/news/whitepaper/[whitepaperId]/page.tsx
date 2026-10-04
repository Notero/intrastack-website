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
  params: Promise<{ whitepaperId: string }>;
}): Promise<Metadata> {
  const { whitepaperId } = await params;
  const item = await fetchNewsItem("whitepaper", whitepaperId);
  if (!item) return { title: "Not found · Intrastack" };
  return {
    title: `${item.title} · Intrastack`,
    description: item.excerpt,
    alternates: { canonical: `/news/whitepaper/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      url: absoluteUrl(`/news/whitepaper/${item.slug}`),
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
  params: Promise<{ whitepaperId: string }>;
}) {
  const { whitepaperId } = await params;
  const [item, allWhitepapers] = await Promise.all([
    fetchNewsItem("whitepaper", whitepaperId),
    fetchNewsList("whitepaper"),
  ]);
  if (!item) notFound();
  return (
    <NewsDetailPage
      item={item}
      config={{
        basePath: "/news/whitepaper",
        crumb: "White Papers",
        backLabel: "All whitepapers",
        relatedItems: allWhitepapers.filter((w) => w.slug !== whitepaperId).slice(0, 4),
      }}
    />
  );
}
