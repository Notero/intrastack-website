import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchNewsItem, fetchNewsList } from "@/lib/content/news";
import NewsDetailPage from "@/components/public/templates/newsDetailPage";

interface PageProps {
  params: Promise<{ pressId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pressId } = await params;
  const item = await fetchNewsItem("press", pressId);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/news/intrastack/${pressId}` },
  };
}

export default async function PressDetailPage({ params }: PageProps) {
  const { pressId } = await params;
  const [item, related] = await Promise.all([
    fetchNewsItem("press", pressId),
    fetchNewsList("press"),
  ]);
  if (!item) notFound();

  return (
    <NewsDetailPage
      item={item}
      config={{
        basePath: "/news/intrastack",
        crumb: "Intrastack News",
        backLabel: "All press releases",
        relatedItems: related.filter((r) => r.slug !== pressId).slice(0, 4),
      }}
    />
  );
}
