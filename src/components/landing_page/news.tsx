"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsItem, NewsKind } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import Shape from "@/components/public/shape";

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

export default function News() {
  const [items, setItems] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/news/latest?limit=3", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items: NewsItem[] }) => {
        if (!cancelled) setItems(data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative w-full bg-paper-2 py-28 md:py-32 px-6 overflow-hidden" id="news">
      <Shape kind="square" size={100} position="top-16 right-20" color="var(--color-brand-600)" outline opacity={0.25} rotate={-12} />
      <Shape kind="triangle" size={75} position="bottom-24 left-12" color="#0F1622" opacity={0.08} rotate={28} />
      <Shape kind="circle" size={55} position="top-1/3 left-1/4" color="var(--color-brand-600)" opacity={0.14} />
      <Shape kind="square" size={40} position="bottom-32 right-1/3" color="#0F1622" opacity={0.1} rotate={15} />
      <Shape kind="triangle" size={50} position="top-40 right-1/2" color="var(--color-brand-600)" outline opacity={0.2} rotate={-8} />
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 items-end">
          <Reveal direction="right">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              News &amp; <span className="italic font-serif text-secondary">updates.</span>
            </h2>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              What we&apos;re shipping, who&apos;s joining, and where we&apos;re opening next.
            </p>
          </Reveal>
        </div>

        {items === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
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
        ) : items.length === 0 ? (
          <Reveal direction="scale">
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/40 p-12 text-center">
              <p className="text-base font-semibold text-foreground">
                Fresh updates are on the way.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check back soon — or subscribe via our newsletter.
              </p>
            </div>
          </Reveal>
        ) : (
          <RevealGroup direction="up" stagger={120} className="grid grid-cols-1 md:grid-cols-3 gap-6" itemClassName="h-full">
            {items.map((n) => {
              const cover = newsImageUrl(n.cover_image_path);
              return (
              <Link
                key={`${n.kind}-${n.slug}`}
                href={detailHref(n)}
                className="group hover-lift h-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-card">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={n.title}
                      width={800}
                      height={600}
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
                </div>
              </Link>
              );
            })}
          </RevealGroup>
        )}

        <Reveal direction="up" delay={300}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/news/blogs"
              className="inline-flex items-center gap-2 rounded-lg border border-base-300 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Read all updates <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
