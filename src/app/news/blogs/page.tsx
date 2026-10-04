import type { Metadata } from "next";
import NewsBlogsPage from "@/components/public/templates/newsBlogsPage";
import { fetchNewsList } from "@/lib/content/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs · Intrastack",
  description:
    "Field notes from the Intrastack engineering and platform teams — what's shipping, what's working, and what isn't.",
  alternates: { canonical: "/news/blogs" },
};

export default async function Page() {
  const items = await fetchNewsList("blog");
  return <NewsBlogsPage items={items} />;
}
