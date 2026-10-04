/**
 * Single source of truth for app roles and the post-login routing map.
 * Mirror of the `user_role` enum in the database (see 0006_auth_enums.sql).
 */

export const ROLES = ["admin", "customer", "applicant"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Path each role lands on after login. */
export function roleToDashboard(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "customer":
      return "/customer";
    case "applicant":
      return "/applicant";
  }
}
