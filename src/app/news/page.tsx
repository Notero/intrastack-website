import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchNewsHub } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";
import { NewsByline } from "@/components/public/news/NewsByline";
import { NewsSectionHeader } from "@/components/public/news/NewsSectionHeader";
import Divider from "@/components/public/divider";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News · Intrastack",
  description:
    "Authoritative reporting and research on enterprise technology — blogs, trends, whitepapers, and client stories from Intrastack.",
  alternates: { canonical: "/news" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsHomePage() {
  const { blogs, trends, whitepapers, stories, press } = await fetchNewsHub();

  const heroStory = blogs[0] ?? trends[0] ?? null;
  const secondaryStories = [...blogs.slice(1), ...trends.slice(0, 3)].slice(0, 3);

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
        {/* ===== HERO GRID ===== */}
        {heroStory && (
          <section className="grid grid-cols-12 gap-6 mb-12">
            {/* Lead story */}
            <article className="col-span-12 lg:col-span-8">
              <Link href={`/news/${heroStory.kind === "blog" ? "blogs" : "trends"}/${heroStory.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-[760/440]">
                  {newsImageUrl(heroStory.cover_image_path) ? (
                    <Image
                      src={newsImageUrl(heroStory.cover_image_path)!}
                      alt={heroStory.title}
                      fill
                      sizes="(min-width: 1024px) 860px, 100vw"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-ink-800" />
                  )}
                  <div className="absolute top-4 left-4">
                    <NewsTag color="accent">Top Story</NewsTag>
                  </div>
                </div>
                <div className="mt-4">
                  <NewsTag color="brand">{heroStory.tags?.[0] ?? "Featured"}</NewsTag>
                  <h1 className="font-serif font-black text-[32px] leading-[1.08] text-ink-900 mt-3 group-hover:text-brand-600 transition-colors">
                    {heroStory.title}
                  </h1>
                  <p className="font-sans text-[16px] leading-relaxed text-ink-600 mt-3 max-w-2xl">
                    {heroStory.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                    <NewsByline
                      author={heroStory.author ? `By ${heroStory.author}` : "Intrastack Staff"}
                      meta={formatDate(heroStory.published_at)}
                    />
                  </div>
                </div>
              </Link>
            </article>


              {/*               <div className="bg-ink-900 text-white px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-accent-400" />
                <h2 className="font-sans font-bold uppercase tracking-[0.16em] text-[13px]">
                  Most Popular
                </h2>
              </div> */}

            {/* Secondary stack */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-min border-2 rounded-l shadow-2xl" style={{ backgroundColor: "var(--dark-warm)" }} >
              <div className="bg-paper-5 pl-2 border-b-2 p-1 border-brand-600 text-black flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-600" />
                <h2 className="font-serif font-black text-xl ">
                  Blogs
                </h2>
              </div>
              <div className="p-3 flex flex-col gap-2 overflow-hidden">
              {secondaryStories.map((s, i) => {
                const path = s.kind === "blog" ? "blogs" : "trends";
                return (
                  <Link
                    key={s.slug}
                    href={`/news/${path}/${s.slug}`}
                    className={`flex gap-4 group ${i > 0 ? "pt-5 border-t border-orange-200" : ""}`}
                  >
                    <div className="flex-1">
                      <NewsTag color="accent">{s.tags?.[0] ?? s.kind}</NewsTag>
                      <h3 className="font-serif font-bold text-[17px] leading-snug text-paper mt-2 group-hover:text-brand-600 transition-colors">
                        {s.title}
                      </h3>
                      <div className="font-sans text-[12px] text-paper-2 mt-2">
                        {formatDate(s.published_at)}
                      </div>
                    </div>
                    {newsImageUrl(s.cover_image_path) && (
                      <div className="relative w-24 h-[84px] shrink-0 overflow-hidden">
                        <Image
                          src={newsImageUrl(s.cover_image_path)!}
                          alt={s.title}
                          fill
                          sizes="96px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
              </div>
            </div>
          </section>
        )}

        {/* ===== TECH STRIP ===== */}
        {trends.length > 0 && (
          <section className="mt-10 text-white mb-12" style={{ backgroundColor: "var(--dark-warm)" }}>
            <div className="px-6 py-3 flex items-center gap-3 border-b border-brand-600">
              <span className="w-1.5 h-5 bg-accent-400" />
              <h2 className="font-sans font-bold uppercase tracking-[0.16em] text-[13px]">
                Trends &amp; Tech — Live
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-600">
              {trends.slice(0, 4).map((t) => (
                <Link
                  key={t.slug}
                  href={`/news/trends/${t.slug}`}
                  className="block p-5 hover:bg-brand-600 transition-colors"
                >
                  <span className="font-sans font-bold uppercase tracking-wider text-[10.5px] text-accent-400">
                    {t.tags?.[0] ?? "Tech"}
                  </span>
                  <h3 className="font-serif font-semibold text-[15px] leading-snug mt-2 text-white">
                    {t.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== MAIN + SIDEBAR ===== */}
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-14">
            {/* Blogs block */}
            {blogs.length > 0 && (
              <section>
                <NewsSectionHeader
                  title="From the Blogs"
                  kicker="Voices & Analysis"
                  moreHref="/news/blogs"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {blogs.slice(0, 2).map((b) => (
                    <Link
                      key={b.slug}
                      href={`/news/blogs/${b.slug}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden aspect-[360/210]">
                        {newsImageUrl(b.cover_image_path) ? (
                          <Image
                            src={newsImageUrl(b.cover_image_path)!}
                            alt={b.title}
                            fill
                            sizes="(min-width: 640px) 40vw, 100vw"
                            loading="lazy"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-ink-100" />
                        )}
                      </div>
                      {b.author && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-7 h-7 rounded-full bg-ink-100 border border-dashed border-ink-300 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 opacity-60" fill="currentColor">
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                            </svg>
                          </div>
                          <span className="font-sans text-[12px] font-bold text-ink-700">{b.author}</span>
                        </div>
                      )}
                      <h3 className="font-serif font-bold text-[18px] leading-snug text-ink-900 mt-2 group-hover:text-brand-600 transition-colors">
                        {b.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Client stories block */}
            {stories.length > 0 && (
              <section>
                <NewsSectionHeader
                  title="Client Stories"
                  kicker="Case Studies"
                  moreHref="/news/client_stories"
                  accent
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {stories.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/news/client_stories/${s.slug}`}
                      className="border border-ink-200 group hover:border-brand-400 transition-colors"
                    >
                      <div className="relative overflow-hidden aspect-[16/9]">
                        {newsImageUrl(s.cover_image_path) ? (
                          <Image
                            src={newsImageUrl(s.cover_image_path)!}
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
                      <div className="p-4">
                        <NewsTag color="brandSoft">Case Study</NewsTag>
                        <h3 className="font-serif font-bold text-[15px] leading-snug text-ink-900 mt-2 group-hover:text-brand-600 transition-colors">
                          {s.title}
                        </h3>
                        {s.client && (
                          <div className="font-sans text-[12px] text-ink-500 mt-2">{s.client}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Whitepapers block */}
            {whitepapers.length > 0 && (
              <section>
                <NewsSectionHeader
                  title="Whitepapers & Research"
                  kicker="Download"
                  moreHref="/news/whitepaper"
                />
                <div className="space-y-4">
                  {whitepapers.map((w) => (
                    <Link
                      key={w.slug}
                      href={`/news/whitepaper/${w.slug}`}
                      className="flex items-center gap-5 border border-ink-200 p-4 hover:border-brand-400 transition-colors group"
                    >
                      <div className="relative w-20 h-[104px] shrink-0 overflow-hidden bg-ink-100">
                        {newsImageUrl(w.cover_image_path) && (
                          <Image
                            src={newsImageUrl(w.cover_image_path)!}
                            alt={w.title}
                            fill
                            sizes="80px"
                            loading="lazy"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-brand-600">
                          {w.pages ? `${w.pages} pages · ` : ""}{w.tags?.[0] ?? "Research"}
                        </div>
                        <h3 className="font-serif font-bold text-[18px] leading-snug text-ink-900 mt-1 group-hover:text-brand-600 transition-colors">
                          {w.title}
                        </h3>
                      </div>
                      <div className="font-sans font-bold text-[12px] uppercase tracking-wide bg-accent-400 text-ink-900 px-4 py-2.5 shrink-0 group-hover:bg-yellow-400 transition-colors">
                        Unlock ↓
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Press block */}
            {press.length > 0 && (
              <section>
                <NewsSectionHeader
                  title="Intrastack News"
                  kicker="Press Room"
                  moreHref="/news/intrastack"
                />
                <div className="border-l-4 border-brand-600 bg-ink-50 pl-5 py-1">
                  <ul className="divide-y divide-ink-200">
                    {press.map((p) => (
                      <li key={p.slug} className="py-3 flex items-start gap-3">
                        <span className="font-sans text-[11px] font-bold text-ink-400 mt-0.5 w-16 shrink-0 uppercase">
                          Press
                        </span>
                        <Link
                          href={`/news/intrastack/${p.slug}`}
                          className="font-serif font-semibold text-[16px] text-ink-900 leading-snug hover:text-brand-600 transition-colors"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="col-span-12 lg:col-span-4 space-y-10">
            {/* Most Popular — static editorial picks */}
            <section>
              <div className="bg-ink-900 text-white px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-accent-400" />
                <h2 className="font-sans font-bold uppercase tracking-[0.16em] text-[13px]">
                  Most Popular
                </h2>
              </div>
              <ol className="border border-t-0 border-ink-200">
                {[...blogs, ...trends].slice(0, 5).map((item, i) => {
                  const path = item.kind === "blog" ? "blogs" : "trends";
                  return (
                    <li key={item.slug} className="flex gap-3 p-4 border-b border-ink-200 last:border-b-0">
                      <span className="font-serif font-black text-3xl text-brand-400 leading-none w-8 shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <Link
                          href={`/news/${path}/${item.slug}`}
                          className="font-serif font-bold text-[14px] leading-snug text-ink-900 hover:text-brand-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="font-sans text-[11px] text-ink-500 mt-1">
                          {formatDate(item.published_at)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Newsletter */}
            <section className="bg-brand-600 text-white p-6">
              <h2 className="font-serif font-extrabold text-xl leading-tight">
                The Intrastack Brief
              </h2>
              <p className="font-sans text-[13.5px] text-brand-400mt-2 leading-relaxed">
                One email each morning. The five stories enterprise leaders are reading.
              </p>
              <div className="mt-4 space-y-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/90 h-10 px-3 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none"
                />
                <button className="w-full bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[13px] py-2.5 hover:bg-yellow-400 transition-colors">
                  Subscribe free
                </button>
              </div>
            </section>

            {/* Trending tags */}
            <section>
              <h2 className="font-sans font-bold uppercase tracking-wider text-[12px] text-ink-700 mb-3 border-b border-ink-200 pb-2">
                Trending Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {["#AIAdoption", "#ZeroTrust", "#FinOps", "#DataPlatforms", "#CloudCosts", "#PostQuantum", "#DevEx"].map(
                  (t) => <NewsTag key={t} color="outline">{t}</NewsTag>,
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
