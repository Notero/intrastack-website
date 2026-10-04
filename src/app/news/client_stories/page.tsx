import type { Metadata } from "next";
import NewsClientStoriesPage from "@/components/public/templates/newsClientStoriesPage";
import { fetchNewsList } from "@/lib/content/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client Stories · Intrastack",
  description:
    "How Intrastack's partners ship — from regulated industries to retail peak season. Outcomes, not adjectives.",
  alternates: { canonical: "/news/client_stories" },
};

export default async function Page() {
  const items = await fetchNewsList("client_story");
  return <NewsClientStoriesPage items={items} />;
}
