import type { Metadata } from "next";
import { Geist_Mono, Raleway, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo/site";
import SchemaScript from "@/components/seo/SchemaScript";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schemas";
import { MarketingChrome } from "@/components/public/MarketingChrome";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", site: "@intrastack" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", raleway.variable, interHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-white">
        <SchemaScript data={[organizationSchema(), webSiteSchema()]} />
        <MarketingChrome>{children}</MarketingChrome>
      </body>
    </html>
  );
}
