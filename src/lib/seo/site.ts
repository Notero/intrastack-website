/**
 * Central site config. Everything SEO-related (sitemap, schemas, metadata)
 * reads from here so a domain or social-handle change is a one-file edit.
 */
export const SITE = {
  name: "Intrastack",
  legalName: "Intrastack, Inc.",
  description:
    "Intrastack ships cloud transformation, DevOps automation, AI engineering, and managed platform services for regulated and high-velocity industries.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.intrastack.com",
  logoPath: "/images/intrastack-logo-assets/website/og-social-share/og-square-1200x1200.jpg",
  contact: {
    email: "info@intrastack.com",
    telephone: "+1-888-959-7868",
    address: {
      streetAddress: "304 S. Jones Blvd #5755",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89107",
      addressCountry: "US",
    },
    geo: { latitude: 36.1716, longitude: -115.2192 },
    hours: ["Mo-Fr 09:00-18:00"],
  },
  sameAs: [
    "https://www.linkedin.com/company/intrastack",
    "https://github.com/intrastack",
    "https://x.com/intrastack",
  ],
} as const;

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
