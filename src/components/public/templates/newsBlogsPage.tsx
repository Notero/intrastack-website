import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { NewsItem } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";
import { NewsTag } from "@/components/public/news/NewsTag";
import { NewsByline } from "@/components/public/news/NewsByline";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cover(item: NewsItem) {
  return newsImageUrl(item.cover_image_path);
}

export default function NewsBlogsPage({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

  return (
    <>
      {/* Editorial header */}
      <section className="border-b border-ink-200">
        <div className="max-w-[860px] mx-auto px-6 py-12 text-center">
          <div className="font-sans text-[12px] font-bold uppercase tracking-[0.28em] text-brand-600">
            The Intrastack Blog
          </div>
          <h1 className="font-serif font-black text-[40px] leading-tight text-ink-900 mt-3">
            Long-form perspectives from people building the stack
          </h1>
          <p className="font-sans text-[17px] text-ink-600 mt-4 max-w-xl mx-auto leading-relaxed">
            Essays, field notes, and arguments from our contributors. Slower, more personal,
            occasionally contrarian.
          </p>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="max-w-[1280px] mx-auto px-6 py-24 text-center text-ink-400 font-sans">
          No blog posts yet — check back soon.
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-12 gap-12">
          {/* Main reading column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Featured post */}
            {featured && (
              <Link
                href={`/news/blogs/${featured.slug}`}
                className="block pb-12 mb-12 border-b border-ink-200 group"
              >
                {cover(featured) && (
                  <div className="relative overflow-hidden aspect-[720/400]">
                    <Image
                      src={cover(featured)!}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 1024px) 860px, 100vw"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="mt-6 max-w-[640px]">
                  <NewsTag color="brandSoft">{featured.tags?.[0] ?? "Blog"}</NewsTag>
                  <h2 className="font-serif font-black text-[32px] leading-[1.12] text-ink-900 mt-3 group-hover:text-brand-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="font-sans text-[17px] leading-relaxed text-ink-600 mt-4">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6">
                    <NewsByline
                      author={featured.author ? `By ${featured.author}` : "By Staff Writer"}
                      meta={`${formatDate(featured.published_at)}${featured.read_time ? ` · ${featured.read_time} min read` : ""}`}
                      size="lg"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* Post list */}
            <div className="space-y-12">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/blogs/${post.slug}`}
                  className="grid grid-cols-12 gap-6 items-start group"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <div className="relative overflow-hidden aspect-[16/10] bg-ink-100">
                      {cover(post) ? (
                        <Image
                          src={cover(post)!}
                          alt={post.title}
                          fill
                          sizes="(min-width: 640px) 40vw, 100vw"
                          loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-300 font-sans text-[11px] uppercase tracking-wider">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-7">
                    <NewsTag color="brandSoft">{post.tags?.[0] ?? "Blog"}</NewsTag>
                    <h3 className="font-serif font-bold text-[22px] leading-snug text-ink-900 mt-2.5 group-hover:text-brand-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-[15px] leading-relaxed text-ink-600 mt-2.5">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-4 font-sans text-[13px] text-ink-500">
                      {post.author && (
                        <span className="font-bold text-ink-700">{post.author}</span>
                      )}
                      <span>·</span>
                      <span>{formatDate(post.published_at)}</span>
                      {post.read_time && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.read_time} min
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-10">
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
                  className="w-full bg-white/90 h-10 px-3 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button className="w-full bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[13px] py-2.5 hover:bg-yellow-400 transition-colors">
                  Subscribe free
                </button>
              </div>
            </section>

            {/* Popular tags */}
            <section>
              <h2 className="font-sans font-bold uppercase tracking-wider text-[12px] text-ink-700 mb-3 border-b border-ink-200 pb-2">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {["#Leadership", "#DevEx", "#Migrations", "#Research", "#Culture", "#Analytics"].map(
                  (t) => (
                    <NewsTag key={t} color="outline">
                      {t}
                    </NewsTag>
                  ),
                )}
              </div>
            </section>

            {/* Write for us */}
            <section className="bg-ink-50 border border-ink-200 p-6">
              <h2 className="font-serif font-bold text-[19px] text-ink-900 leading-snug">
                Write for Intrastack
              </h2>
              <p className="font-sans text-[14px] text-ink-600 mt-2 leading-relaxed">
                We publish practitioners with a point of view. Pitch us your essay.
              </p>
              <Link
                href="/contact"
                className="mt-4 block w-full bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[13px] py-2.5 text-center hover:bg-yellow-400 transition-colors"
              >
                Submit a pitch
              </Link>
            </section>
          </aside>
        </div>
      )}
    </>
  );
}
