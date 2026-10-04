"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Cookie-aware Supabase client for use in Client Components. Reads/writes
 * the same auth cookies that the server client and the proxy session
 * refresh use, so the auth state stays in sync across boundaries.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
