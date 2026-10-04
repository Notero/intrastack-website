import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";

const FILTERS = ["All", "AI & ML", "Security", "Cloud", "Data", "DevOps", "Hardware", "Policy"];

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function cover(item: NewsItem) {
  return newsImageUrl(item.cover_image_path);
}

export default function NewsTrendsPage({ items }: { items: NewsItem[] }) {
  const [hero, ...grid] = items;

  return (
    <>
      {/* Tech masthead band */}
      <section className="bg-ink-900 text-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-7 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-9 bg-brand-500" />
            <div>
              <div className="font-sans text-[12px] font-bold uppercase tracking-[0.28em] text-brand-400">
                Trends &amp; Tech
              </div>
              <h1 className="font-serif font-black text-[28px] leading-none mt-1">
                The Velocity Desk
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 font-sans text-[12px]">
            <span className="flex items-center gap-1.5 text-brand-400">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Live feed
            </span>
            <span className="text-ink-600">·</span>
            <span className="text-ink-400">Updated continuously</span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="border-t border-ink-800">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3 flex flex-wrap gap-2">
            {FILTERS.map((f, i) => (
              <span
                key={f}
                className={`font-sans font-bold uppercase tracking-wide text-[11px] px-3 py-1.5 ${
                  i === 0
                    ? "bg-brand-500 text-ink-900"
                    : "bg-ink-800 text-ink-300"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="max-w-[1280px] mx-auto px-6 py-24 text-center text-ink-400 font-sans">
          No trend pieces yet — check back soon.
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8 grid grid-cols-12 gap-8">
          {/* Main */}
          <div className="col-span-12 lg:col-span-8">
            {/* Hero feature */}
            {hero && (
              <Link href={`/news/trends/${hero.slug}`} className="block relative mb-8 group">
                <div className="relative overflow-hidden aspect-[2/1]">
                  {cover(hero) ? (
                    <Image
                      src={cover(hero)!}
                      alt={hero.title}
                      fill
                      sizes="(min-width: 1024px) 860px, 100vw"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-ink-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 max-w-2xl">
                  <NewsTag color="brand">Deep Dive</NewsTag>
                  <h2 className="font-serif font-black text-[26px] leading-tight text-white mt-3">
                    {hero.title}
                  </h2>
                  <div className="font-sans text-[12px] text-brand-400 mt-3 font-semibold uppercase tracking-wide">
                    {hero.tags?.[0] ?? "Analysis"}
                    {hero.read_time ? ` · ${hero.read_time} min read` : ""}
                  </div>
                </div>
              </Link>
            )}

            {/* Dense grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink-200 border border-ink-200">
              {grid.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/trends/${item.slug}`}
                  className="block bg-white p-4 hover:bg-brand-40050 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans font-bold uppercase tracking-wider text-[10.5px] text-brand-600">
                      {item.tags?.[0] ?? "Tech"}
                    </span>
                    <span className="font-sans text-[11px] text-ink-400">
                      {formatRelative(item.published_at)}
                    </span>
                  </div>
                  {cover(item) && (
                    <div className="relative overflow-hidden aspect-[16/9] mb-3">
                      <Image
                        src={cover(item)!}
                        alt={item.title}
                        fill
                        sizes="(min-width: 640px) 40vw, 100vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-[16px] leading-snug text-ink-900 group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            {/* By the numbers */}
            <section className="bg-ink-900 text-white p-6">
              <div className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-400">
                By the numbers
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ["$78B", "2026 enterprise AI spend"],
                  ["43%", "firms running agents in prod"],
                  ["2.4×", "inference cost YoY"],
                ].map(([n, l], i) => (
                  <div key={i} className="border-l-2 border-brand-500 pl-3">
                    <div className="font-serif font-black text-3xl text-white leading-none">{n}</div>
                    <div className="font-sans text-[12px] text-ink-400 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending topics */}
            <section className="border border-ink-200">
              <div className="bg-brand-600 text-white px-4 py-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <h2 className="font-sans font-bold uppercase tracking-[0.16em] text-[13px]">
                  Trending Topics
                </h2>
              </div>
              <ol>
                {[
                  "Edge AI",
                  "Confidential computing",
                  "WASM on the server",
                  "Vector DB consolidation",
                  "Green data centers",
                ].map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 border-b border-ink-100 last:border-b-0"
                  >
                    <span className="font-serif font-black text-xl text-brand-400 w-6 leading-none">
                      {i + 1}
                    </span>
                    <span className="font-sans font-semibold text-[14px] text-ink-900 flex-1">
                      {t}
                    </span>
                    <span className="font-sans text-[11px] font-bold text-brand-600">
                      ▲ {(9 - i) * 11}%
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      )}
    </>
  );
}
