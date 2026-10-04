import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { isRole, type Role } from "./roles";

export interface SessionUser {
  id: string;
  email: string | null;
  role: Role;
}

/**
 * Returns the authenticated user + their role from `profiles`, or null
 * if there is no session. Use this in server components.
 *
 * `auth.getUser()` re-validates the JWT with Supabase (vs `getSession()`
 * which trusts the cookie blindly) — preferred for anything security-
 * sensitive like role gating.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !isRole(profile.role)) return null;

  return { id: user.id, email: user.email ?? null, role: profile.role };
}

/**
 * Server-component guard. Redirects to /login if unauthenticated, or to
 * /unauthorized if the user's role is not in `allowed`. Admin always
 * passes (admins can view every dashboard).
 */
export async function requireRole(
  allowed: Role | readonly Role[],
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const allowList = Array.isArray(allowed) ? allowed : [allowed];
  if (user.role === "admin") return user;
  if (!allowList.includes(user.role)) redirect("/unauthorized");

  return user;
}
