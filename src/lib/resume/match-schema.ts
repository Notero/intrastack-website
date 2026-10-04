import { z } from "zod";

/**
 * Output shape for resume → role matching. Constrains the LLM (structured
 * outputs) and types the matching result for the API + UI. The same shape is
 * produced by the deterministic stub when no ANTHROPIC_API_KEY is set.
 */

export const RoleMatchSchema = z.object({
  // Echoes the source JobPost so the UI can link back to the role.
  jobId: z.string(),
  jobTitle: z.string(),
  // Fit score, 0–100.
  score: z.number(),
  // Candidate skills the role calls for.
  matchedSkills: z.array(z.string()),
  // Role requirements the candidate doesn't obviously have yet.
  gaps: z.array(z.string()),
  reasoning: z.string(),
});

export const ResumeMatchSchema = z.object({
  matches: z.array(RoleMatchSchema),
});

export type RoleMatch = z.infer<typeof RoleMatchSchema>;
export type ResumeMatch = z.infer<typeof ResumeMatchSchema>;
