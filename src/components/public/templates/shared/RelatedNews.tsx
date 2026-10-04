"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import { renderAccent } from "@/lib/text/accent";
import type { NewsItem, NewsKind } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";

const KIND_HREF: Record<NewsKind, string> = {
  blog: "/news/blogs",
  trend: "/news/trends",
  whitepaper: "/news/whitepaper",
  client_story: "/news/client_stories",
  press: "/news/intrastack",
};

const KIND_LABEL: Record<NewsKind, string> = {
  blog: "Blog",
  trend: "Trend",
  whitepaper: "Whitepaper",
  client_story: "Client story",
  press: "Press",
};

function detailHref(item: NewsItem): string {
  return `${KIND_HREF[item.kind]}/${item.slug}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export type RelatedNewsProps = {
  /** Tags to match against `news_items.tags` array (overlap match). */
  terms: string[];
  /** Heading with optional [[accent]] marker. */
  heading: string;
  /** Short sub-line under the heading. */
  kicker?: string;
  /** Accent class for the marker inside the heading. */
  accentClass?: string;
  /** Section background utility — defaults to bg-paper. */
  bg?: string;
  /** Max cards to fetch and render. */
  limit?: number;
  /** If no tag matches, fall back to the latest news items instead of hiding. */
  fallbackToLatest?: boolean;
};

export default function RelatedNews({
  terms,
  heading,
  kicker = "What we are shipping, who is joining, where we are opening next.",
  accentClass = "italic font-serif text-secondary",
  bg = "bg-paper",
  limit = 3,
  fallbackToLatest = true,
}: RelatedNewsProps) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const queryParams = new URLSearchParams();
  for (const t of terms) {
    const trimmed = t.trim();
    if (trimmed) queryParams.append("term", trimmed);
  }
  queryParams.set("limit", String(limit));
  if (!fallbackToLatest) queryParams.set("fallback", "0");
  const query = queryParams.toString();

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news/by-tags?${query}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [], isFallback: false }))
      .then((data: { items: NewsItem[]; isFallback: boolean }) => {
        if (cancelled) return;
        setItems(data.items ?? []);
        setIsFallback(Boolean(data.isFallback));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className={`w-full ${bg} py-24 px-6`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 items-end">
          <Reveal direction="right">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {isFallback ? "Recent updates" : "Related news"}
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {renderAccent(heading, accentClass)}
            </h2>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {renderAccent(kicker, accentClass)}
            </p>
          </Reveal>
        </div>

        {items === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="h-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 flex flex-col animate-pulse"
              >
                <div className="aspect-[4/3] bg-base-200" />
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <div className="h-3 w-1/3 bg-base-200 rounded" />
                  <div className="h-5 w-3/4 bg-base-200 rounded" />
                  <div className="h-3 w-full bg-base-200 rounded" />
                  <div className="h-3 w-5/6 bg-base-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RevealGroup
            direction="up"
            stagger={120}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            itemClassName="h-full"
          >
            {items.map((n) => {
              const cover = newsImageUrl(n.cover_image_path);
              return (
                <Link
                  key={`${n.kind}-${n.slug}`}
                  href={detailHref(n)}
                  className="group h-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary transition-colors flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-card">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={n.title}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary text-primary-content px-3 py-1 text-xs font-semibold">
                      {KIND_LABEL[n.kind]}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {formatDate(n.published_at)} · {n.tags?.[0]}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-foreground leading-snug">
                      {n.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                      {n.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Read more <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
