import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FF6200",
    icons: [
      {
        src: "/images/intrastack-logo-assets/website/pwa-browser/pwa-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/intrastack-logo-assets/website/pwa-browser/pwa-icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/images/intrastack-logo-assets/website/pwa-browser/pwa-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/intrastack-logo-assets/website/pwa-browser/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
