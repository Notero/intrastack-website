import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session on every request and returns a
 * NextResponse with the propagated `requestHeaders` (so the proxy can
 * forward its `x-nonce` etc.) plus any refreshed auth cookies.
 *
 * Called from `src/proxy.ts`. Pattern follows the official @supabase/ssr
 * Next.js guide, adapted to also forward custom request headers.
 *
 * If Supabase env vars are missing (e.g. local dev without credentials),
 * this is a no-op pass-through so the rest of the site still works.
 */
export async function updateSupabaseSession(
  request: NextRequest,
  requestHeaders: Headers,
): Promise<NextResponse> {
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        // Rebuild the response so refreshed cookies flow to the browser,
        // while preserving the custom request headers (x-nonce, …).
        response = NextResponse.next({ request: { headers: requestHeaders } });
        toSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Touching getUser() is what triggers the refresh-and-set-cookie cycle.
  await supabase.auth.getUser();

  return response;
}
