import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import type { LeadershipPerson } from "@/lib/content/leadership";

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function hasBio(person: Pick<LeadershipPerson, "intro" | "highlights" | "closing">): boolean {
  return person.intro.length > 0 || person.highlights.length > 0 || Boolean(person.closing);
}

type CardPerson = {
  name: string;
  title: string;
  region?: string | null;
};

// ─── List-page card ─────────────────────────────────────────────────────────

function PhotoBanner({ name, photoUrl, accent }: { name: string; photoUrl: string | null; accent: "primary" | "secondary" }) {
  if (photoUrl) {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-base-200">
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div
      className={`grid place-items-center w-full aspect-[4/3] rounded-xl font-bold text-4xl ${
        accent === "primary" ? "bg-primary/15 text-primary" : "bg-secondary/20 text-secondary"
      }`}
    >
      {initialsOf(name)}
    </div>
  );
}

export function PersonCard({
  person,
  photoUrl,
  href,
  accent,
}: {
  person: CardPerson;
  photoUrl: string | null;
  href: string | null;
  accent: "primary" | "secondary";
}) {
  const inner = (
    <>
      <PhotoBanner name={person.name} photoUrl={photoUrl} accent={accent} />
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{person.title}</p>
        </div>
        {href && (
          <ArrowRight
            className="size-4 mt-1.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
            strokeWidth={2}
          />
        )}
      </div>
      {person.region && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-base-200 border border-base-300 px-2.5 py-1 text-xs font-medium text-foreground">
          <MapPin className="size-3 text-secondary" strokeWidth={2} />
          {person.region}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-primary hover:shadow-md transition-all block"
        aria-label={`Read more about ${person.name}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-primary hover:shadow-md transition-all">
      {inner}
    </div>
  );
}

// ─── Detail-page hero portrait ──────────────────────────────────────────────

export function PortraitBlock({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl shadow-lg shadow-primary/10">
        <Image
          src={photoUrl}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 90vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="grid place-items-center w-full aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content font-bold text-6xl shadow-lg shadow-primary/20">
      {initialsOf(name)}
    </div>
  );
}

// ─── Contact / socials row (detail page only, each link optional) ─────────

type SocialLink = { href: string; label: string; Icon?: typeof Mail; iconSlug?: string };

export function ContactSocialsRow({
  email,
  phone,
  linkedin_url,
  instagram_url,
  twitter_url,
}: Pick<LeadershipPerson, "email" | "phone" | "linkedin_url" | "instagram_url" | "twitter_url">) {
  const links = [
    email && { href: `mailto:${email}`, label: "Email", text: email, Icon: Mail },
    phone && { href: `tel:${phone}`, label: "Phone", text: phone, Icon: Phone },
    linkedin_url && { href: linkedin_url, label: "LinkedIn", text: "LinkedIn", iconSlug: "linkedin" },
    instagram_url && { href: instagram_url, label: "Instagram", text: "Instagram", iconSlug: "instagram" },
    twitter_url && { href: twitter_url, label: "Twitter / X", text: "Twitter / X", iconSlug: "x" },
  ].filter(Boolean) as (SocialLink & { text: string })[];

  if (links.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {links.map(({ href, label, text, Icon, iconSlug }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-base-300 bg-base-100">
            {Icon ? (
              <Icon className="size-3.5" strokeWidth={2} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://cdn.simpleicons.org/${iconSlug}`} alt="" className="size-3.5 opacity-70" />
            )}
          </span>
          <span className="font-medium">{text}</span>
        </a>
      ))}
    </div>
  );
}
