import { z } from "zod";

/**
 * Structured shape a resume is parsed into. This schema is the single source
 * of truth: it constrains the LLM's output (via structured outputs) and gives
 * us the TypeScript type for everything downstream (matching, storage, UI).
 *
 * Fields that may be absent are nullable rather than optional so the model
 * always emits a value (null) and the shape stays predictable.
 */

export const HistoricalRoleSchema = z.object({
  title: z.string().nullable(),
  company: z.string().nullable(),
  // Dates are kept as written on the resume (e.g. "Jan 2021", "Present").
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  durationMonths: z.number().nullable(),
  highlights: z.array(z.string()),
});

export const EducationSchema = z.object({
  degree: z.string().nullable(),
  institution: z.string().nullable(),
  year: z.string().nullable(),
});

export const ParsedResumeSchema = z.object({
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  summary: z.string().nullable(),
  yearsOfExperience: z.number().nullable(),
  coreCompetencies: z.array(z.string()),
  technicalStack: z.array(z.string()),
  historicalRoles: z.array(HistoricalRoleSchema),
  education: z.array(EducationSchema),
  certifications: z.array(z.string()),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;
export type HistoricalRole = z.infer<typeof HistoricalRoleSchema>;
export type Education = z.infer<typeof EducationSchema>;
