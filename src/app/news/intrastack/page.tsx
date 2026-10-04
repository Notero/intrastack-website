import type { Metadata } from "next";
import Link from "next/link";
import { fetchNewsList } from "@/lib/content/news";
import { NewsSectionHeader } from "@/components/public/news/NewsSectionHeader";
import { NewsTag } from "@/components/public/news/NewsTag";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Intrastack News & Press · Intrastack",
  description: "Official announcements, company milestones, and media resources from Intrastack.",
  alternates: { canonical: "/news/intrastack" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function IntrastackNewsPage() {
  const releases = await fetchNewsList("press");

  const [featured, ...rest] = releases;

  return (
    <>
      {/* Newsroom header */}
      <section className="bg-brand-600 text-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="font-serif font-black text-brand-600 text-2xl">I</span>
            </div>
            <span className="font-sans font-bold uppercase tracking-[0.28em] text-[13px] text-brand-400">
              Newsroom
            </span>
          </div>
          <h1 className="font-serif font-black text-[40px] leading-tight">
            Intrastack News &amp; Press Releases
          </h1>
          <p className="font-sans text-[17px] text-brand-400 mt-3 max-w-2xl leading-relaxed">
            Official announcements, company milestones, and media resources from Intrastack
            Media Group.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/contact"
              className="bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[12px] px-5 py-2.5 hover:bg-yellow-400 transition-colors"
            >
              Press contact
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12 grid grid-cols-12 gap-12">
        {/* Main */}
        <div className="col-span-12 lg:col-span-8">
          {/* Featured press release */}
          {featured && (
            <article className="border border-ink-200 mb-12">
              <div className="bg-ink-900 text-white px-6 py-3 flex items-center justify-between">
                <span className="font-sans font-bold uppercase tracking-wider text-[11px]">
                  For immediate release
                </span>
                <span className="font-sans text-[12px] text-ink-400">
                  {formatDate(featured.published_at)}
                </span>
              </div>
              <div className="p-8">
                <NewsTag color="brand">{featured.tags?.[0] ?? "Corporate"}</NewsTag>
                <h2 className="font-serif font-black text-[28px] leading-tight text-ink-900 mt-3">
                  {featured.title}
                </h2>
                <p className="font-sans text-[14px] text-ink-500 mt-3 font-semibold">
                  CHICAGO — {formatDate(featured.published_at)}
                </p>
                <p className="font-serif text-[17px] leading-[1.7] text-ink-800 mt-5">
                  {featured.excerpt}
                </p>
                {featured.body && (
                  <div className="mt-4 font-serif text-[17px] leading-[1.7] text-ink-800 whitespace-pre-line line-clamp-6">
                    {featured.body}
                  </div>
                )}
                <Link
                  href={`/news/intrastack/${featured.slug}`}
                  className="inline-block mt-6 font-sans font-bold uppercase tracking-wide text-[13px] text-brand-600 hover:text-brand-600"
                >
                  Read full release →
                </Link>
              </div>
            </article>
          )}

          {/* Release list */}
          {rest.length > 0 && (
            <div>
              <NewsSectionHeader title="Latest releases" kicker="Press Archive" />
              <div className="divide-y divide-ink-200 border-t border-ink-200">
                {rest.map((r) => (
                  <article key={r.slug} className="py-5 flex items-start gap-5">
                    <div className="w-28 shrink-0">
                      <div className="font-sans text-[13px] font-bold text-ink-900">
                        {formatDate(r.published_at)}
                      </div>
                      <div className="font-sans text-[11px] font-bold uppercase tracking-wide text-brand-600 mt-1">
                        {r.tags?.[0] ?? "Press"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/news/intrastack/${r.slug}`}
                        className="font-serif font-bold text-[19px] leading-snug text-ink-900 hover:text-brand-600 transition-colors"
                      >
                        {r.title}
                      </Link>
                      <div className="font-sans text-[12px] text-ink-500 mt-1.5">
                        Read release →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {releases.length === 0 && (
            <div className="py-24 text-center text-ink-400 font-sans">
              No press releases yet.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Company facts */}
          <section className="border-2 border-ink-900">
            <div className="bg-ink-900 text-white px-5 py-3 font-sans font-bold uppercase tracking-wider text-[12px]">
              Company at a glance
            </div>
            <dl className="p-5 space-y-3 font-sans text-[14px]">
              {[
                ["Founded", "2009"],
                ["Headquarters", "Las Vegas, NV"],
                ["Employees", "Growing"],
                ["Markets", "Enterprise Tech"],
                ["Contact", "888-959-7868"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-ink-100 pb-2 last:border-b-0 last:pb-0"
                >
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-bold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Press subscribe */}
          <section className="bg-brand-600 text-white p-6">
            <h2 className="font-serif font-extrabold text-[19px] leading-tight">
              Press distribution list
            </h2>
            <p className="font-sans text-[13.5px] text-brand-400mt-2 leading-relaxed">
              Journalists: get our releases the moment they go live.
            </p>
            <div className="mt-4 space-y-2">
              <input
                type="email"
                placeholder="work@outlet.com"
                className="w-full bg-white/90 h-10 px-3 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none"
              />
              <button className="w-full bg-accent-400 text-ink-900 font-bold uppercase tracking-wide text-[13px] py-2.5 hover:bg-yellow-400 transition-colors">
                Join press list
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
