import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Cookie-aware Supabase server client. Use this in Server Components,
 * Server Actions, and Route Handlers when the request is user-scoped
 * (login, dashboards, anything reading the current user's data).
 *
 * For unauthenticated reads of public tables (e.g. news_items), keep
 * using the anon-only `getSupabaseServerClient()` in ./server.ts —
 * it's cached and avoids the per-request cookie work.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          // In Server Components, cookies() is read-only and these
          // setters throw. That's fine — the proxy refreshes the
          // session cookies on the next request.
          try {
            toSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /* ignore — read-only context */
          }
        },
      },
    },
  );
}
