import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// ponytail: fails open (null) instead of throwing when Upstash isn't
// configured, so dev without the env vars still boots — mirrors the
// stub/mock fallback pattern used for Supabase and Anthropic elsewhere.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

if (!redis) {
  console.warn("[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled.");
}

function makeLimiter(tokens: number, window: `${number} ${"s" | "m" | "h"}`, prefix: string) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
    prefix: `intrastack:${prefix}`,
  });
}

const limiters = {
  chat: makeLimiter(10, "60 s", "chat"),
  login: makeLimiter(5, "5 m", "login"),
  register: makeLimiter(5, "60 m", "register"),
  resumeParse: makeLimiter(10, "60 m", "resume-parse"),
  resumeMatch: makeLimiter(20, "60 m", "resume-match"),
  contact: makeLimiter(5, "60 m", "contact"),
  whitepaperLead: makeLimiter(10, "60 m", "whitepaper-lead"),
} as const;

type Surface = keyof typeof limiters;

/**
 * true = allowed, false = reject. Fails open on missing config or Upstash
 * runtime errors.
 *
 * ponytail: an Upstash outage means zero rate limiting until it recovers,
 * not a broken app — accepted risk, consistent with how this repo treats
 * every other optional external dependency.
 */
export async function checkRateLimit(surface: Surface, identifier: string): Promise<boolean> {
  const limiter = limiters[surface];
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit(identifier);
    return success;
  } catch (err) {
    console.error(`[rateLimit] Upstash error on "${surface}", failing open:`, err);
    return true;
  }
}

/** For route handlers. Request covers both NextRequest and plain Request. */
export function getClientKeyFromRequest(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** For server actions, which get no Request object. Same logic as logAuthEvent.ts. */
export async function getClientKeyFromHeaders(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
