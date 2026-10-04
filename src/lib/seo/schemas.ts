/**
 * Type-safe JSON-LD builders. We hand-type the subset of schema.org we use
 * rather than pulling in `schema-dts` — keeps zero runtime deps and the
 * inferred output is exactly what Google's Rich Results test expects.
 */
import { SITE, absoluteUrl } from "./site";

type WithContext<T> = T & { "@context": "https://schema.org" };
const ctx = <T extends { "@type": string }>(o: T): WithContext<T> => ({
  "@context": "https://schema.org",
  ...o,
});

/* ---------------- WebSite (site-wide) ---------------- */

export interface WebSiteSchema {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  description?: string;
  publisher: { "@id": string };
  inLanguage?: string;
}

export const webSiteSchema = (): WithContext<WebSiteSchema> =>
  ctx<WebSiteSchema>({
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
  });

/* ---------------- CollectionPage + ItemList (hub pages) ---------------- */

export interface ListItemRef {
  name: string;
  url: string;
  description?: string;
  image?: string;
}
export interface CollectionPageSchema {
  "@type": "CollectionPage";
  "@id": string;
  url: string;
  name: string;
  description?: string;
  isPartOf: { "@id": string };
  inLanguage?: string;
  mainEntity: {
    "@type": "ItemList";
    itemListOrder: "https://schema.org/ItemListOrderAscending";
    numberOfItems: number;
    itemListElement: {
      "@type": "ListItem";
      position: number;
      url: string;
      name: string;
      description?: string;
      image?: string;
    }[];
  };
}

export const collectionPageSchema = (input: {
  path: string;
  name: string;
  description?: string;
  items: ListItemRef[];
}): WithContext<CollectionPageSchema> =>
  ctx<CollectionPageSchema>({
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(input.path)}#collection`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: it.url.startsWith("http") ? it.url : absoluteUrl(it.url),
        name: it.name,
        description: it.description,
        image: it.image
          ? it.image.startsWith("http")
            ? it.image
            : absoluteUrl(it.image)
          : undefined,
      })),
    },
  });

/* ---------------- Organization (homepage) ---------------- */

export interface OrganizationSchema {
  "@type": "Organization";
  "@id": string;
  name: string;
  legalName?: string;
  url: string;
  logo: string;
  description?: string;
  sameAs?: readonly string[];
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
    telephone?: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
}

export const organizationSchema = (): WithContext<OrganizationSchema> =>
  ctx<OrganizationSchema>({
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logoPath),
    description: SITE.description,
    sameAs: SITE.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.contact.email,
      telephone: SITE.contact.telephone,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
  });

/* ---------------- LocalBusiness (contact page) ---------------- */

export interface LocalBusinessSchema {
  "@type": "LocalBusiness";
  "@id": string;
  name: string;
  url: string;
  image: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  openingHoursSpecification?: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
}

export const localBusinessSchema = (): WithContext<LocalBusinessSchema> =>
  ctx<LocalBusinessSchema>({
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/contact#localbusiness"),
    name: SITE.name,
    url: absoluteUrl("/contact"),
    image: absoluteUrl(SITE.logoPath),
    telephone: SITE.contact.telephone,
    email: SITE.contact.email,
    address: { "@type": "PostalAddress", ...SITE.contact.address },
    geo: { "@type": "GeoCoordinates", ...SITE.contact.geo },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  });

/* ---------------- BreadcrumbList (deep pages) ---------------- */

export interface BreadcrumbItem {
  name: string;
  url: string;
}
export interface BreadcrumbListSchema {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export const breadcrumbSchema = (
  items: BreadcrumbItem[]
): WithContext<BreadcrumbListSchema> =>
  ctx<BreadcrumbListSchema>({
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : absoluteUrl(it.url),
    })),
  });

/* ---------------- Service (service / solution / industry detail) ---------------- */

export interface ServiceSchemaInput {
  name: string;
  path: string;
  description: string;
  image?: string;
  serviceType?: string;
  areaServed?: string;
}
export interface ServiceSchema {
  "@type": "Service";
  "@id": string;
  name: string;
  url: string;
  description: string;
  image?: string;
  serviceType?: string;
  areaServed?: string;
  provider: { "@id": string };
}

export const serviceSchema = (
  s: ServiceSchemaInput
): WithContext<ServiceSchema> =>
  ctx<ServiceSchema>({
    "@type": "Service",
    "@id": `${absoluteUrl(s.path)}#service`,
    name: s.name,
    url: absoluteUrl(s.path),
    description: s.description,
    image: s.image
      ? s.image.startsWith("http")
        ? s.image
        : absoluteUrl(s.image)
      : undefined,
    serviceType: s.serviceType,
    areaServed: s.areaServed ?? "Worldwide",
    provider: { "@id": absoluteUrl("/#organization") },
  });

/* ---------------- Person (leadership) ---------------- */

export interface PersonSchemaInput {
  name: string;
  jobTitle: string;
  image?: string;
  email?: string;
  sameAs?: string[];
}
export interface PersonSchema {
  "@type": "Person";
  name: string;
  jobTitle: string;
  image?: string;
  email?: string;
  sameAs?: string[];
  worksFor: { "@id": string };
}

export const personSchema = (
  p: PersonSchemaInput
): WithContext<PersonSchema> =>
  ctx<PersonSchema>({
    "@type": "Person",
    name: p.name,
    jobTitle: p.jobTitle,
    image: p.image
      ? p.image.startsWith("http")
        ? p.image
        : absoluteUrl(p.image)
      : undefined,
    email: p.email,
    sameAs: p.sameAs && p.sameAs.length > 0 ? p.sameAs : undefined,
    worksFor: { "@id": absoluteUrl("/#organization") },
  });

/* ---------------- Article (blog post) ---------------- */

export interface ArticleSchemaInput {
  headline: string;
  description?: string;
  url: string;
  images: string[];
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
}
export interface ArticleSchema {
  "@type": "Article";
  headline: string;
  description?: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: { "@type": "Person"; name: string; url?: string };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: { "@type": "ImageObject"; url: string };
  };
  mainEntityOfPage: { "@type": "WebPage"; "@id": string };
}

export const articleSchema = (
  a: ArticleSchemaInput
): WithContext<ArticleSchema> =>
  ctx<ArticleSchema>({
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    image: a.images.map((i) => (i.startsWith("http") ? i : absoluteUrl(i))),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: { "@type": "Person", name: a.authorName, url: a.authorUrl },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logoPath) },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": a.url.startsWith("http") ? a.url : absoluteUrl(a.url),
    },
  });
