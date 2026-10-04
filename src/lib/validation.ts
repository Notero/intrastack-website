export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function clean(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}
