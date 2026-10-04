import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";
import { NewsSectionHeader } from "@/components/public/news/NewsSectionHeader";

function cover(item: NewsItem) {
  return newsImageUrl(item.cover_image_path);
}

export default function NewsClientStoriesPage({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

  return (
    <>
      {/* Hero */}
      {featured ? (
        <section className="relative">
          <div className="relative overflow-hidden h-[420px] md:h-[500px] w-full">
            {cover(featured) ? (
              <Image
                src={cover(featured)!}
                alt={featured.title}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-ink-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/55 to-ink-900/10" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6 w-full">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <NewsTag color="accent">Case Study</NewsTag>
                  {featured.industry && (
                    <span className="font-sans text-[13px] font-semibold text-brand-400 uppercase tracking-wide">
                      {featured.industry}
                    </span>
                  )}
                </div>
                <h1 className="font-serif font-black text-[38px] leading-[1.08] text-white">
                  {featured.title}
                </h1>
                {featured.client && (
                  <div className="font-sans text-[14px] text-brand-400 mt-3 font-semibold uppercase tracking-wide">
                    {featured.client}
                  </div>
                )}
                <Link
                  href={`/news/client_stories/${featured.slug}`}
                  className="inline-block mt-6 bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[13px] px-6 py-3 hover:bg-yellow-400 transition-colors"
                >
                  Read the story →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-brand-600 text-white py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <h1 className="font-serif font-black text-[40px]">Client Stories</h1>
            <p className="font-sans text-[17px] text-brand-400 mt-3">
              Real results from real partnerships.
            </p>
          </div>
        </section>
      )}

      {/* Metric bar for featured */}
      {featured?.metric_value && (
        <section className="bg-brand-600 text-white">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-600">
            {[
              [featured.metric_value, featured.metric_label ?? "Key result"],
              ["18mo", "Typical engagement"],
              ["3.2×", "Average ROI"],
              ["99.9%", "Platform uptime"],
            ].map(([n, l], i) => (
              <div key={i} className="py-6 px-4 text-center">
                <div className="font-serif font-black text-3xl leading-none">{n}</div>
                <div className="font-sans text-[12px] text-brand-400 mt-2 uppercase tracking-wide">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Story grid */}
      {items.length === 0 ? (
        <div className="max-w-[1280px] mx-auto px-6 py-24 text-center text-ink-400 font-sans">
          No client stories yet — check back soon.
        </div>
      ) : (
        <section className="bg-ink-50 border-t border-ink-200">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12">
            <NewsSectionHeader
              title="More client stories"
              kicker="Case Studies"
              accent
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(rest.length > 0 ? rest : items).map((s) => (
                <Link
                  key={s.slug}
                  href={`/news/client_stories/${s.slug}`}
                  className="bg-white border border-ink-200 group hover:border-brand-400 transition-colors"
                >
                  <div className="relative overflow-hidden aspect-[16/9]">
                    {cover(s) ? (
                      <Image
                        src={cover(s)!}
                        alt={s.title}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-ink-100" />
                    )}
                  </div>
                  <div className="p-5">
                    <NewsTag color="brandSoft">{s.industry ?? "Case Study"}</NewsTag>
                    <h3 className="font-serif font-bold text-[18px] leading-snug text-ink-900 mt-2 group-hover:text-brand-600 transition-colors">
                      {s.title}
                    </h3>
                    {s.client && (
                      <div className="font-sans text-[13px] font-bold text-ink-500 mt-3">
                        {s.client}
                      </div>
                    )}
                    {s.metric_value && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-serif font-black text-2xl text-brand-600">
                          {s.metric_value}
                        </span>
                        <span className="font-sans text-[12px] text-ink-500">
                          {s.metric_label}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
