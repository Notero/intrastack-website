import type { Metadata } from "next";
import NewsTrendsPage from "@/components/public/templates/newsTrendsPage";
import { fetchNewsList } from "@/lib/content/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tech News & Trends · Intrastack",
  description:
    "What's shifting across cloud, AI, security, and data — read in the time it takes to finish your coffee.",
  alternates: { canonical: "/news/trends" },
};

export default async function Page() {
  const items = await fetchNewsList("trend");
  return <NewsTrendsPage items={items} />;
}
