import Link from "next/link";
import { ArrowRight, ChevronRight, Download, FileText, Clock } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schemas";
import { Badge } from "@/components/ui/badge";
import type { NewsItem, NewsKind } from "@/lib/content/news";
import { newsImageUrl } from "@/lib/supabase/storage";

function resolveCover(item: NewsItem): string | null {
  return newsImageUrl(item.cover_image_path);
}

export type NewsListConfig = {
  kind: NewsKind;
  basePath: string; // e.g. "/news/blogs"
  crumb: string; // e.g. "Blogs"
  eyebrow: string; // e.g. "News · Blogs"
  headline: { lead: string; emph: string; tail: string };
  lede: string;
  heroImage: string;
  emptyLabel: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function NewsListPage({
  config,
  items,
}: {
  config: NewsListConfig;
  items: NewsItem[];
}) {
  const [featured, ...rest] = items;
  const isWhitepaper = config.kind === "whitepaper";
  const isStory = config.kind === "client_story";
  const isTrend = config.kind === "trend";

  return (
    <main className="flex flex-col flex-1 pt-30">
      <SchemaScript
        data={[
          collectionPageSchema({
            path: config.basePath,
            name: config.crumb,
            description: config.lede,
            items: items.map((it) => ({
              name: it.title,
              url: `${config.basePath}/${it.slug}`,
              description: it.excerpt,
              image: resolveCover(it) ?? undefined,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "News", url: "/news/blogs" },
            { name: config.crumb, url: config.basePath },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="w-full bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[480px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.heroImage}
              alt={config.crumb}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background lg:to-background/0" />
            <div className="absolute top-6 left-6 text-xs font-semibold uppercase tracking-widest text-white/80">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-white/80">News</span>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-primary">{config.crumb}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 lg:px-14 py-16 lg:py-20">
            <span className="anim-rise text-xs font-semibold uppercase tracking-widest text-primary">
              {config.eyebrow}
            </span>
            <h1 className="anim-rise anim-rise-delay-1 mt-4 text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
              {config.headline.lead}{" "}
              <span className="italic font-serif text-secondary">{config.headline.emph}</span>{" "}
              {config.headline.tail}
            </h1>
            <p className="anim-rise anim-rise-delay-2 mt-6 text-lg text-muted-foreground leading-relaxed">{config.lede}</p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="w-full bg-accent py-20 md:py-24 px-6" aria-labelledby="news-list-heading">
        <h2 id="news-list-heading" className="sr-only">Latest {config.crumb.toLowerCase()}</h2>
        <div className="mx-auto max-w-7xl">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">{config.emptyLabel}</p>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  href={`${config.basePath}/${featured.slug}`}
                  className="group hover-lift grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary mb-12"
                >
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-card">
                    {resolveCover(featured) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveCover(featured)!}
                        alt={featured.title}
                        className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <Badge className="absolute top-4 left-4">{featured.tags?.[0]}</Badge>
                    <Badge variant="secondary" className="absolute top-4 right-4">
                      Featured
                    </Badge>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                      <span>{formatDate(featured.published_at)}</span>
                      {featured.author && <><span>·</span><span>{featured.author}</span></>}
                      {featured.read_time && <><span>·</span><span className="inline-flex items-center gap-1"><Clock className="size-3" />{featured.read_time} min</span></>}
                      {featured.pages && <><span>·</span><span>{featured.pages} pages</span></>}
                      {featured.client && <><span>·</span><span>{featured.client}</span></>}
                    </div>
                    <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                      {featured.excerpt}
                    </p>

                    {isStory && featured.metric_value && (
                      <div className="mt-6 inline-flex items-baseline gap-3 rounded-lg border border-base-300 bg-base-200/60 px-4 py-3 self-start">
                        <span className="text-3xl font-bold text-primary">{featured.metric_value}</span>
                        <span className="text-sm text-muted-foreground">{featured.metric_label}</span>
                      </div>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {isWhitepaper ? (<><Download className="size-4" /> Download whitepaper</>) : (<>Read more <ArrowRight className="size-4" /></>)}
                    </span>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((n) => (
                  <Link
                    key={n.slug}
                    href={`${config.basePath}/${n.slug}`}
                    className="group hover-lift rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-card">
                      {resolveCover(n) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveCover(n)!}
                          alt={n.title}
                          loading="lazy"
                          className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <Badge className="absolute top-3 left-3">{n.tags?.[0]}</Badge>
                      {isWhitepaper && (
                        <Badge variant="secondary" className="absolute top-3 right-3 gap-1">
                          <FileText className="size-3" /> PDF
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <span>{formatDate(n.published_at)}</span>
                        {n.author && <><span>·</span><span>{n.author}</span></>}
                        {isTrend && n.read_time && <><span>·</span><span className="inline-flex items-center gap-1"><Clock className="size-3" />{n.read_time} min</span></>}
                        {isWhitepaper && n.pages && <><span>·</span><span>{n.pages}p · {n.file_size}</span></>}
                        {isStory && n.client && <><span>·</span><span>{n.client}</span></>}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-foreground leading-snug">{n.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{n.excerpt}</p>

                      {isStory && n.metric_value && (
                        <div className="mt-5 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">{n.metric_value}</span>
                          <span className="text-xs text-muted-foreground">{n.metric_label}</span>
                        </div>
                      )}

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {isWhitepaper ? (<><Download className="size-4" /> Download</>) : (<>Read more <ArrowRight className="size-4" /></>)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
