import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";
import { NewsSectionHeader } from "@/components/public/news/NewsSectionHeader";
import { WhitepaperGateModal } from "./WhitepaperGateModal";

function cover(item: NewsItem) {
  return newsImageUrl(item.cover_image_path);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function NewsWhitepapersPage({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

  return (
    <>
      {/* Hero band */}
      <section className="bg-brand-600 text-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12">
          <NewsTag color="accent" className="mb-4">
            Research Library
          </NewsTag>
          <h1 className="font-serif font-black text-[40px] leading-[1.08]">
            Whitepapers &amp; Research
          </h1>
          <p className="font-sans text-[18px] text-brand-400 mt-3 max-w-2xl leading-relaxed">
            In-depth research, technical briefs, and implementation guides from the Intrastack
            research team. Download free with your email.
          </p>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="max-w-[1280px] mx-auto px-6 py-24 text-center text-ink-400 font-sans">
          No whitepapers yet — check back soon.
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12 space-y-16">
          {/* Featured whitepaper */}
          {featured && (
            <div className="grid grid-cols-12 gap-12 items-start">
              {/* Document detail */}
              <div className="col-span-12 lg:col-span-7">
                <NewsTag color="brand">{featured.tags?.[0] ?? "Research Report"}</NewsTag>
                <h2 className="font-serif font-black text-[36px] leading-[1.08] text-ink-900 mt-4">
                  {featured.title}
                </h2>
                <p className="font-sans text-[18px] text-ink-600 mt-4 leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-5 pb-6 border-b border-ink-200 font-sans text-[13px] text-ink-500">
                  <span>{formatDate(featured.published_at)}</span>
                  {featured.pages && (
                    <>
                      <span>·</span>
                      <span className="font-bold text-ink-700">{featured.pages} pages</span>
                    </>
                  )}
                  {featured.file_size && (
                    <>
                      <span>·</span>
                      <span className="font-bold text-ink-700">PDF</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-12 gap-6 mt-8 items-start">
                  <div className="col-span-5">
                    <div className="relative aspect-[3/4] overflow-hidden bg-ink-100 shadow-lg">
                      {cover(featured) ? (
                        <Image
                          src={cover(featured)!}
                          alt={featured.title}
                          fill
                          sizes="(min-width: 1024px) 30vw, 40vw"
                          priority
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-sans text-[11px] text-ink-400 uppercase tracking-wider">
                            Cover
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-7">
                    <h3 className="font-serif font-extrabold text-[20px] text-ink-900">
                      Executive summary
                    </h3>
                    <p className="font-sans text-[15px] text-ink-600 mt-3 leading-relaxed">
                      {featured.body
                        ? featured.body.slice(0, 280) + "…"
                        : "Adoption has crossed the chasm, but value capture has not. Our data shows a widening gap between organizations operationalizing AI and those still trapped in pilots."}
                    </p>
                  </div>
                </div>

                {/* Key stats */}
                {(featured.metric_value || featured.pages) && (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {[
                      featured.metric_value
                        ? [featured.metric_value, featured.metric_label ?? "Key metric"]
                        : null,
                      featured.pages ? [`${featured.pages}`, "Pages"] : null,
                      featured.industry ? [featured.industry, "Industry focus"] : null,
                    ]
                      .filter((x): x is [string, string] => x !== null)
                      .map(([n, l], i) => (
                        <div
                          key={i}
                          className="bg-ink-50 border-t-2 border-brand-600 p-4 text-center"
                        >
                          <div className="font-serif font-black text-2xl text-ink-900">{n}</div>
                          <div className="font-sans text-[11px] text-ink-500 mt-1 uppercase tracking-wide">
                            {l}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Gated download form */}
              <div className="col-span-12 lg:col-span-5">
                <WhitepaperGateModal
                  slug={featured.slug}
                  title={featured.title}
                  fileUrl={featured.file_url}
                />
              </div>
            </div>
          )}

          {/* More whitepapers */}
          {rest.length > 0 && (
            <section className="border-t border-ink-200 pt-12">
              <NewsSectionHeader
                title="More research to unlock"
                kicker="Whitepaper Library"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {rest.map((w) => (
                  <article
                    key={w.slug}
                    className="bg-white border border-ink-200 flex flex-col hover:border-brand-400 transition-colors"
                  >
                    <div className="p-5 flex gap-4 flex-1">
                      <div className="relative w-20 shrink-0 aspect-[3/4] overflow-hidden bg-ink-100">
                        {cover(w) ? (
                          <Image
                            src={cover(w)!}
                            alt={w.title}
                            fill
                            sizes="80px"
                            loading="lazy"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-300 font-sans text-[9px] uppercase">
                            Cover
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-sans text-[11px] font-bold uppercase tracking-wide text-brand-600">
                          {w.pages ? `${w.pages} pages · ` : ""}
                          {w.tags?.[0] ?? "Research"}
                        </div>
                        <h3 className="font-serif font-bold text-[16px] leading-snug text-ink-900 mt-1.5">
                          {w.title}
                        </h3>
                      </div>
                    </div>
                    <Link
                      href={`/news/whitepaper/${w.slug}`}
                      className="border-t border-ink-200 font-sans font-bold uppercase tracking-wide text-[12px] text-brand-600 py-3 text-center hover:bg-brand-400transition-colors"
                    >
                      Unlock ↓
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
