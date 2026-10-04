import { z } from "zod";
import { ALL_CERT_NAMES } from "@/lib/content/certifications";

/**
 * Single source of truth for the leadership/advisor admin form — both the
 * client (PersonForm.tsx, per-step "Next" gating) and the server
 * (actions.ts, buildRow) validate against this same schema.
 */

export const GROUPS = ["founder", "executive", "vp", "director", "advisor"] as const;
export type LeadershipGroupValue = (typeof GROUPS)[number];

// Sourced from the delivery centers already listed on /about/delivery_centers —
// the `region` column's own migration comment describes it as exactly this
// kind of value ("Vietnam, Japan, ...").
export const REGIONS = [
  "Las Vegas, USA",
  "Ho Chi Minh City, Vietnam",
  "Tokyo, Japan",
  "Bengaluru, India",
] as const;
export type RegionValue = (typeof REGIONS)[number];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "Must be a full URL starting with http:// or https://")
  .optional();

export const basicInfoSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  title: z.string().trim().min(1, "Required"),
  group_name: z.enum(GROUPS, { message: "Invalid group" }),
  region: z.string().optional(),
  display_order: z.coerce.number().int().default(0),
});

export const contactSchema = z.object({
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || EMAIL_RE.test(v), "Invalid email")
    .optional(),
  phone: z.string().trim().optional(),
  linkedin_url: optionalUrl,
  instagram_url: optionalUrl,
  twitter_url: optionalUrl,
});

export const bioSchema = z.object({
  intro: z.string().optional(),
  highlights: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
  closing: z.string().optional(),
  certifications: z.array(z.string()).max(ALL_CERT_NAMES.length).optional(),
});

export const personSchema = basicInfoSchema.extend(contactSchema.shape).extend(bioSchema.shape);
