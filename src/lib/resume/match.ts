import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { ParsedResume } from "./schema";
import type { JobPost } from "@/lib/content/jobs";
import { ResumeMatchSchema, type RoleMatch } from "./match-schema";

/**
 * Resume → role matching.
 *
 * Given a ParsedResume and the open `job_posts`, ranks the best-fitting roles
 * and explains each fit. v1 keeps it simple: Claude scores the shortlist (no
 * embeddings). pgvector + Voyage AI embeddings can come later for scale.
 *
 * With no ANTHROPIC_API_KEY, falls back to a deterministic skill-overlap
 * heuristic (`stub: true`) so the whole flow runs in dev without a key —
 * mirroring the resume parser's stub.
 */

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 2048;
const TOP_N = 3;

const SYSTEM_INSTRUCTION =
  "You are a technical recruiter. Score how well a candidate fits each open role " +
  "from 0 to 100 based on skills, experience, and seniority. Return ONLY the top " +
  `${TOP_N} roles, ranked best first. For each role use the exact jobId and title ` +
  "given; matchedSkills = candidate skills the role needs; gaps = role requirements " +
  "the candidate is missing; reasoning = 1–2 concise sentences. Never invent roles or skills.";

export type MatchResult = { matches: RoleMatch[]; stub: boolean };

export async function matchResume(
  resume: ParsedResume,
  jobs: JobPost[],
): Promise<MatchResult> {
  if (jobs.length === 0) return { matches: [], stub: true };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { matches: heuristicMatches(resume, jobs), stub: true };
  }

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_INSTRUCTION,
    messages: [{ role: "user", content: buildPrompt(resume, jobs) }],
    output_config: { format: zodOutputFormat(ResumeMatchSchema) },
  });

  const parsed = response.parsed_output;
  if (!parsed) throw new Error("Model did not return matches.");

  const matches = [...parsed.matches]
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_N);
  return { matches, stub: false };
}

function buildPrompt(resume: ParsedResume, jobs: JobPost[]): string {
  const candidate = [
    `Name: ${resume.fullName ?? "Unknown"}`,
    resume.summary ? `Summary: ${resume.summary}` : "",
    resume.yearsOfExperience != null
      ? `Years of experience: ${resume.yearsOfExperience}`
      : "",
    `Core competencies: ${resume.coreCompetencies.join(", ") || "—"}`,
    `Technical stack: ${resume.technicalStack.join(", ") || "—"}`,
    `Recent roles: ${
      resume.historicalRoles
        .map((r) => `${r.title ?? "?"} @ ${r.company ?? "?"}`)
        .join("; ") || "—"
    }`,
  ]
    .filter(Boolean)
    .join("\n");

  const roles = jobs
    .map((j, i) =>
      [
        `Role ${i + 1}`,
        `jobId: ${j.id}`,
        `title: ${j.title}`,
        j.seniority ? `seniority: ${j.seniority}` : "",
        `tags: ${(j.tags ?? []).join(", ") || "—"}`,
        j.requirements?.length
          ? `requirements: ${j.requirements.join("; ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  return `Candidate profile:\n${candidate}\n\nOpen roles:\n${roles}\n\nRank the ${TOP_N} best-fitting roles for this candidate.`;
}

// ---- Deterministic stub (no API key) --------------------------------------

type Skill = { label: string; norm: string };

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function heuristicMatches(resume: ParsedResume, jobs: JobPost[]): RoleMatch[] {
  const resumeSkills = new Set(
    [...resume.technicalStack, ...resume.coreCompetencies].map(norm),
  );

  const scored = jobs.map((job): RoleMatch => {
    const required: Skill[] = (job.tags ?? []).map((t) => ({
      label: t,
      norm: norm(t),
    }));

    // Tag-based scoring when the role lists tags; otherwise scan requirement
    // text for any of the candidate's skills so untagged roles still rank.
    let matched: Skill[];
    let gaps: Skill[];
    let ratio: number;
    if (required.length) {
      matched = required.filter((s) => resumeSkills.has(s.norm));
      gaps = required.filter((s) => !resumeSkills.has(s.norm));
      ratio = matched.length / required.length;
    } else {
      const haystack = norm(
        [...(job.requirements ?? []), job.description ?? ""].join(" "),
      );
      matched = [...resumeSkills]
        .filter((s) => s.length >= 3 && haystack.includes(s))
        .map((s) => ({ label: s, norm: s }));
      gaps = [];
      ratio = clamp(matched.length / 4, 0, 1);
    }

    // Keep the stub in a believable band — never a flat 0% or 100%.
    const score = Math.round(clamp(35 + ratio * 60, 30, 96));

    const matchedLabels = matched.map((s) => s.label).slice(0, 8);
    const gapLabels = gaps.map((s) => s.label).slice(0, 6);
    const reasoningParts = [
      matchedLabels.length
        ? `Strong overlap on ${list(matchedLabels.slice(0, 3))}`
        : "Limited direct skill overlap",
    ];
    if (gapLabels.length) {
      reasoningParts.push(`would ramp on ${list(gapLabels.slice(0, 2))}`);
    }
    if (job.seniority) reasoningParts.push(`${job.seniority}-level role`);

    return {
      jobId: job.id,
      jobTitle: job.title,
      score,
      matchedSkills: matchedLabels,
      gaps: gapLabels,
      reasoning: `${reasoningParts.join("; ")}.`,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, TOP_N);
}
