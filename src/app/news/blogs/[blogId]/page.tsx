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
  params: Promise<{ blogId: string }>;
}): Promise<Metadata> {
  const { blogId } = await params;
  const item = await fetchNewsItem("blog", blogId);
  if (!item) return { title: "Not found · Intrastack" };
  return {
    title: `${item.title} · Intrastack`,
    description: item.excerpt,
    alternates: { canonical: `/news/blogs/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      url: absoluteUrl(`/news/blogs/${item.slug}`),
      images: newsImageUrl(item.cover_image_path) ? [{ url: newsImageUrl(item.cover_image_path)! }] : [],
      publishedTime: item.published_at,
      authors: item.author ? [item.author] : undefined,
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
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const [item, allBlogs] = await Promise.all([
    fetchNewsItem("blog", blogId),
    fetchNewsList("blog"),
  ]);
  if (!item) notFound();
  return (
    <NewsDetailPage
      item={item}
      config={{
        basePath: "/news/blogs",
        crumb: "Blogs",
        backLabel: "All blog posts",
        relatedItems: allBlogs.filter((b) => b.slug !== blogId).slice(0, 4),
      }}
    />
  );
}
