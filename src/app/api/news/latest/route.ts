import { NextResponse } from "next/server";
import { fetchLatestNews } from "@/lib/content/news";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 12) : 3;
  const items = await fetchLatestNews(limit);
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
