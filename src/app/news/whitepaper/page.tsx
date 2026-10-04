import type { Metadata } from "next";
import NewsWhitepapersPage from "@/components/public/templates/newsWhitepapersPage";
import { fetchNewsList } from "@/lib/content/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "White Papers · Intrastack",
  description:
    "In-depth playbooks, reference architectures, and frameworks from the Intrastack practice — distilled into something you can actually act on.",
  alternates: { canonical: "/news/whitepaper" },
};

export default async function Page() {
  const items = await fetchNewsList("whitepaper");
  return <NewsWhitepapersPage items={items} />;
}
