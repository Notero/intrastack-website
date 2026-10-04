import type { NextConfig } from "next";

// Content-Security-Policy as a static header. Moving CSP out of the
// per-request proxy lets Next statically pre-render pages — which was
// previously impossible because the proxy set a unique nonce per request.
//
// The CSP intentionally allows 'unsafe-inline' for scripts and styles
// (Next emits inline runtime + Tailwind component styles); since we are
// not using nonces, this is the same posture as before. Whitelisted
// external origins:
//   - *.supabase.co     data layer + auth
//   - cdn.simpleicons.org   tech-stack logos on the landing page
//   - https://www.google.com   Maps iframe on contact page
const CSP = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://cdn.simpleicons.org https://*.supabase.co`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
  `frame-src https://www.google.com blob:`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1600, 1920],
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75],
    minimumCacheTTL: 31536000,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
    ];
  },
};

export default nextConfig;
