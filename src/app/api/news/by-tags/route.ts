import { NextResponse } from "next/server";
import { fetchNewsByTags, fetchLatestNews } from "@/lib/content/news";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const terms = searchParams.getAll("term").map((t) => t.trim()).filter(Boolean);
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 12) : 3;
  const fallback = searchParams.get("fallback") !== "0";

  const tagged = terms.length > 0 ? await fetchNewsByTags(terms, limit) : [];
  const items = tagged.length > 0 ? tagged : fallback ? await fetchLatestNews(limit) : [];
  const isFallback = tagged.length === 0 && items.length > 0;

  return NextResponse.json(
    { items, isFallback },
    { headers: { "Cache-Control": "no-store" } },
  );
}
