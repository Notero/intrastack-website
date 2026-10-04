import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Award,
  Plus,
} from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, personSchema } from "@/lib/seo/schemas";
import SectionSeam from "@/components/public/sectionSeam";
import { fetchFounder, fetchLeadershipMembers, type LeadershipPerson } from "@/lib/content/leadership";
import { leaderPhotoUrl } from "@/lib/supabase/storage";
import { PersonCard, hasBio } from "@/components/public/leadershipCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leadership · Intrastack",
  description:
    "The leadership team behind Intrastack Solutions — founder Stefan Nguyen, the Chief Executive Leadership team, and the VPs and directors steering each function of the company.",
  alternates: { canonical: "/about/leadership" },
};

const PILLARS = [
  {
    icon: Award,
    title: "Trusted services",
    body: "Over 25 years of combined experience in data center and cloud transformation — helping clients reach their digital goals.",
  },
  {
    icon: Sparkles,
    title: "Innovation & excellence",
    body: "Focus on cutting-edge technologies like machine learning and AI — driving innovation and impactful outcomes in the digital age.",
  },
  {
    icon: ShieldCheck,
    title: "Expert & professional",
    body: "Seasoned professionals providing strategic guidance and technical oversight across cloud strategy, security, and compliance.",
  },
];

// Shown until an admin uploads a photo for the founder row.
const FOUNDER_PHOTO_FALLBACK = "/images/team/stefan.webp";

const OPEN_ROLES = [
  { team: "Commercial Accounts — West", role: "Account Executive" },
  { team: "Commercial Accounts — East", role: "Account Executive" },
  { team: "Government Accounts — West", role: "Account Executive" },
  { team: "Government Accounts — East", role: "Account Executive" },
];

function FounderAvatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative size-40 sm:size-48 shrink-0 overflow-hidden rounded-3xl shadow-lg shadow-primary/20">
      <Image src={src} alt={name} fill sizes="192px" className="object-cover" />
    </div>
  );
}

function PersonGrid({ people, cols }: { people: LeadershipPerson[]; cols: string }) {
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {people.map((p, i) => (
        <PersonCard
          key={p.slug}
          person={p}
          photoUrl={leaderPhotoUrl(p.photo_path)}
          href={hasBio(p) ? `/about/leadership/${p.slug}` : null}
          accent={i % 2 === 0 ? "primary" : "secondary"}
        />
      ))}
    </div>
  );
}

export default async function LeadershipPage() {
  const [founder, members] = await Promise.all([fetchFounder(), fetchLeadershipMembers()]);
  const executives = members.filter((m) => m.group_name === "executive");
  const vps = members.filter((m) => m.group_name === "vp");
  const directors = members.filter((m) => m.group_name === "director");
  const founderPhoto = leaderPhotoUrl(founder?.photo_path) ?? FOUNDER_PHOTO_FALLBACK;

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          ...(founder
            ? [personSchema({ name: founder.name, jobTitle: founder.title, image: founderPhoto })]
            : []),
          ...members.map((p) =>
            personSchema({
              name: p.name,
              jobTitle: p.title,
              image: leaderPhotoUrl(p.photo_path) ?? undefined,
              email: p.email ?? undefined,
              sameAs: [p.linkedin_url, p.instagram_url, p.twitter_url].filter(Boolean) as string[],
            })
          ),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
            { name: "Leadership", url: "/about/leadership" },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="relative w-full bg-background overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <Link href="/about" className="hover:text-primary">About</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Leadership</span>
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
            People who&apos;ve <span className="italic font-serif text-secondary">done the work.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Intrastack Solutions delivers trusted services with over 25 years of combined experience in data
            center and cloud transformation. Our leadership team blends senior operators steering the company
            toward its strategic goals.
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="w-full bg-accent py-20 px-6 border-b border-base-300" aria-labelledby="leadership-pillars">
        <h2 id="leadership-pillars" className="sr-only">How we lead</h2>
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-base-300 bg-base-100 p-7 hover:border-primary/60 transition-colors"
            >
              <div className="grid place-items-center size-12 rounded-lg bg-primary/15 text-primary">
                <Icon className="size-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />

      {/* FOUNDER */}
      {founder && (
        <section className="w-full bg-paper-3 py-28 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {founder.title}
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
                Where the company <span className="italic font-serif text-brand-600">begins.</span>
              </h2>
            </div>

            <div className="mx-auto max-w-3xl rounded-3xl border border-[#E2E6EE] bg-white p-8 md:p-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <FounderAvatar src={founderPhoto} name={founder.name} />
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0F1622]">{founder.name}</h3>
                  <p className="mt-1 text-base text-[#5C6473] font-semibold">{founder.title}</p>
                  {founder.intro.map((para) => (
                    <p key={para} className="mt-3 text-sm text-[#5C6473] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHIEF EXECUTIVE LEADERSHIP */}
      {executives.length > 0 && (
        <section className="w-full bg-accent py-28 px-6 border-y border-base-300">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Chief Executive Leadership
                </span>
                <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  The executives <span className="italic font-serif text-secondary">running the company.</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our C-suite — accountable for the operating cadence, technology direction, and day-to-day
                execution that turns strategy into delivery.
              </p>
            </div>

            <PersonGrid people={executives} cols="md:grid-cols-3" />
          </div>
        </section>
      )}

      {/* VICE PRESIDENTS */}
      {vps.length > 0 && (
        <>
          <SectionSeam variant="slant" topColor="var(--paper)" bottomColor="var(--paper-3)" flip />
          <section className="w-full bg-paper-3 py-28 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                    Vice president team
                  </span>
                  <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
                    Our executive <span className="italic font-serif text-brand-600">vice presidents.</span>
                  </h2>
                </div>
                <p className="text-lg text-[#5C6473] leading-relaxed">
                  The VPs who own the day-to-day across sales, cloud delivery, and the people that make both
                  possible.
                </p>
              </div>

              <PersonGrid people={vps} cols="md:grid-cols-3" />
            </div>
          </section>
        </>
      )}

      {/* DIRECTORS */}
      {directors.length > 0 && (
        <section className="w-full bg-background py-28 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Directors team
                </span>
                <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Our executive <span className="italic font-serif text-secondary">directors.</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Directors leading the practice — operations, DevOps, support, and engineering — turning
                strategy into shipped work.
              </p>
            </div>

            <PersonGrid people={directors} cols="sm:grid-cols-2 lg:grid-cols-4" />
          </div>
        </section>
      )}

      {/* HIRING NOW */}
      <section className="w-full bg-accent py-28 px-6 border-y border-base-300">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Hiring now
              </span>
              <h2 className="mt-5 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Account sales — <span className="italic font-serif text-secondary">open seats.</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Four Account Executive roles open across commercial and government, east and west. Senior
              operators welcome.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OPEN_ROLES.map((r) => (
              <Link
                key={r.team}
                href="/careers"
                className="group rounded-2xl border-2 border-dashed border-base-300 bg-base-100/40 p-6 hover:border-primary hover:bg-base-100 transition-all"
              >
                <div className="grid place-items-center size-16 rounded-2xl border-2 border-dashed border-base-300 text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                  <Plus className="size-6" strokeWidth={2} />
                </div>
                <div className="mt-5 inline-flex rounded-full bg-secondary/15 border border-secondary/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Open role
                </div>
                <h3 className="mt-3 text-base font-bold text-foreground leading-snug">{r.team}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.role}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Apply <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              See all open roles <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Want to meet the <span className="italic font-serif text-secondary">team behind it?</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              30 minutes with a senior engineer or operator — no SDRs, no decks.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 shrink-0"
          >
            Get in touch <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
