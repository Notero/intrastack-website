import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Share2, Bookmark, Printer } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import type { NewsItem } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";
import { NewsByline } from "@/components/public/news/NewsByline";
import { WhitepaperGateModal } from "./WhitepaperGateModal";

export type NewsDetailConfig = {
  basePath: string;
  crumb: string;
  backLabel: string;
  relatedItems?: NewsItem[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsDetailPage({
  item,
  config,
}: {
  item: NewsItem;
  config: NewsDetailConfig;
}) {
  const isWhitepaper = item.kind === "whitepaper";
  const isStory = item.kind === "client_story";
  const isPress = item.kind === "press";

  const cover = newsImageUrl(item.cover_image_path);
  const image2 = newsImageUrl(item.image_2_path);
  const image3 = newsImageUrl(item.image_3_path);

  const related = config.relatedItems ?? [];

  return (
    <>
      <SchemaScript
        data={[
          articleSchema({
            headline: item.title,
            description: item.excerpt,
            url: `${config.basePath}/${item.slug}`,
            images: cover ? [cover] : [],
            datePublished: item.published_at,
            dateModified: item.published_at,
            authorName: item.author ?? item.client ?? "Intrastack",
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "News", url: "/news" },
            { name: config.crumb, url: config.basePath },
            { name: item.title, url: `${config.basePath}/${item.slug}` },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <div className="border-b border-ink-200">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3 font-sans text-[12px] text-ink-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span className="text-ink-300">/</span>
          <Link href="/news" className="hover:text-brand-600">News</Link>
          <span className="text-ink-300">/</span>
          <Link href={config.basePath} className="hover:text-brand-600">{config.crumb}</Link>
          <span className="text-ink-300">/</span>
          <span className="text-brand-600 font-semibold truncate max-w-[200px]">
            {item.tags?.[0] ?? item.kind}
          </span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8 grid grid-cols-12 gap-10">
        {/* Article body */}
        <article className="col-span-12 lg:col-span-8">
          <NewsTag color="brand">{item.tags?.[0] ?? item.kind}</NewsTag>

          <h1 className="font-serif font-black text-[36px] md:text-[42px] leading-[1.06] text-ink-900 mt-4">
            {item.title}
          </h1>

          <p className="font-serif text-[19px] italic leading-relaxed text-ink-600 mt-4">
            {item.excerpt}
          </p>

          {/* Byline + actions */}
          <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pb-5 border-b border-ink-200">
            <div className="flex items-center gap-4 flex-wrap font-sans text-[13px] text-ink-500">
              <NewsByline
                author={item.author ? `By ${item.author}` : item.client ?? "Intrastack Staff"}
                meta={`${formatDate(item.published_at)}${item.read_time ? ` · ${item.read_time} min read` : ""}${item.pages ? ` · ${item.pages} pages` : ""}`}
                size="lg"
              />
            </div>
            <div className="flex items-center gap-2">
              {[
                { Icon: Share2, label: "Share" },
                { Icon: Bookmark, label: "Save" },
                { Icon: Printer, label: "Print" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="font-sans text-[12px] font-bold uppercase tracking-wide border border-ink-300 text-ink-600 px-3 py-1.5 hover:border-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client story metric bar */}
          {isStory && item.metric_value && (
            <div className="my-6 bg-brand-600 text-white p-6 flex items-center gap-8 flex-wrap">
              <div>
                <div className="font-serif font-black text-4xl leading-none">{item.metric_value}</div>
                <div className="font-sans text-[13px] text-brand-400 mt-1 uppercase tracking-wide">
                  {item.metric_label}
                </div>
              </div>
              {item.client && (
                <div className="font-sans text-[15px] font-semibold text-brand-400">{item.client}</div>
              )}
            </div>
          )}

          {/* Press release header */}
          {isPress && (
            <div className="my-6 border border-ink-200">
              <div className="bg-ink-900 text-white px-6 py-3 flex items-center justify-between">
                <span className="font-sans font-bold uppercase tracking-wider text-[11px]">
                  For immediate release
                </span>
                <span className="font-sans text-[12px] text-ink-400">
                  {formatDate(item.published_at)}
                </span>
              </div>
            </div>
          )}

          {/* Hero image */}
          {cover && (
            <figure className="mt-6">
              <div className="relative overflow-hidden aspect-[760/430]">
                <Image
                  src={cover}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {/* Body copy */}
          <div className="mt-8 space-y-5 max-w-[680px]">
            {item.body ? (
              <div className="font-serif text-[18px] leading-[1.75] text-ink-800 whitespace-pre-line first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-black first-letter:text-[52px] first-letter:leading-[0.85] first-letter:text-brand-600">
                {item.body}
              </div>
            ) : (
              <p className="font-serif text-[18px] leading-[1.75] text-ink-800 italic">
                Full content coming soon.
              </p>
            )}

            {/* Inline images */}
            {(image2 || image3) && (
              <div className="my-8 grid gap-4 sm:grid-cols-2">
                {image2 && (
                  <figure>
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <Image src={image2} alt={`${item.title} — image 2`} fill sizes="(min-width: 640px) 50vw, 100vw" loading="lazy" className="object-cover" />
                    </div>
                  </figure>
                )}
                {image3 && (
                  <figure>
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <Image src={image3} alt={`${item.title} — image 3`} fill sizes="(min-width: 640px) 50vw, 100vw" loading="lazy" className="object-cover" />
                    </div>
                  </figure>
                )}
              </div>
            )}
          </div>

          {/* Whitepaper download block */}
          {isWhitepaper && (
            <div className="mt-10">
              <WhitepaperGateModal
                slug={item.slug}
                title={item.title}
                fileUrl={item.file_url}
              />
            </div>
          )}

          {/* Article tags */}
          <div className="mt-8 pt-6 border-t border-ink-200 flex flex-wrap items-center gap-2">
            <span className="font-sans text-[12px] font-bold uppercase tracking-wide text-ink-500 mr-1">
              Filed under:
            </span>
            {(item.tags ?? []).map((t) => (
              <NewsTag key={t} color="outline">{t}</NewsTag>
            ))}
          </div>

          {/* Author card */}
          {item.author && (
            <div className="mt-8 border border-ink-200 p-5 flex gap-4">
              <div className="w-16 h-16 rounded-full bg-ink-100 border border-dashed border-ink-300 shrink-0 flex items-center justify-center text-ink-400">
                <svg viewBox="0 0 24 24" className="w-7 h-7 opacity-60" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <div>
                <div className="font-serif font-bold text-[17px] text-ink-900">{item.author}</div>
                <div className="font-sans text-[12px] font-bold uppercase tracking-wide text-brand-600">
                  {item.industry ?? "Contributor"}
                </div>
                <p className="font-sans text-[14px] text-ink-600 mt-2 leading-relaxed">
                  Contributing author to Intrastack News.
                </p>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-ink-200">
            <Link
              href={config.basePath}
              className="inline-flex items-center gap-2 font-sans text-[13px] font-bold text-brand-600 hover:text-brand-600 uppercase tracking-wide transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {config.backLabel}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-10">
          {/* Related news */}
          {related.length > 0 && (
            <section>
              <div className="bg-brand-600 text-white px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-accent-400" />
                <h2 className="font-sans font-bold uppercase tracking-[0.16em] text-[13px]">
                  Related
                </h2>
              </div>
              <div className="border border-t-0 border-ink-200">
                {related.map((r, i) => (
                  <Link
                    key={r.slug}
                    href={`${config.basePath}/${r.slug}`}
                    className={`flex gap-3 p-4 hover:bg-ink-50 transition-colors group ${i > 0 ? "border-t border-ink-200" : ""}`}
                  >
                    <div className="relative w-20 h-16 shrink-0 overflow-hidden bg-ink-100">
                      {newsImageUrl(r.cover_image_path) && (
                        <Image
                          src={newsImageUrl(r.cover_image_path)!}
                          alt={r.title}
                          fill
                          sizes="80px"
                          loading="lazy"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-[14px] leading-snug text-ink-900 group-hover:text-brand-600 transition-colors">
                        {r.title}
                      </h3>
                      <div className="font-sans text-[11px] text-ink-500 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelative(r.published_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter */}
          <section className="bg-ink-50 border border-ink-200 p-5">
            <h2 className="font-serif font-bold text-[18px] text-ink-900 leading-snug">
              Keep reading the story
            </h2>
            <p className="font-sans text-[13px] text-ink-600 mt-2 leading-relaxed">
              Get follow-up coverage delivered to your inbox.
            </p>
            <div className="mt-3 space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-ink-300 h-10 px-3 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <button className="w-full bg-brand-600 text-white font-bold uppercase tracking-wide text-[13px] py-2.5 hover:bg-brand-600 transition-colors">
                Follow this story
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
