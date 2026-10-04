import { type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxySession";

/**
 * Refreshes the Supabase auth session for protected routes so server
 * components see a fresh session cookie. The matcher below restricts
 * the proxy to the routes that actually need this — public marketing
 * pages don't run through here, which lets them be statically rendered.
 *
 * CSP lives in `next.config.ts` as a static response header.
 */
export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Used by the (dashboard) layouts that need to know the current path.
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return updateSupabaseSession(request, requestHeaders);
}

export const config = {
  matcher: [
    // Only run on protected app routes — not on marketing pages.
    "/admin/:path*",
    "/customer/:path*",
    "/applicant/:path*",
    "/unauthorized",
    "/login",
  ],
};
