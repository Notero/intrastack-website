import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import mammoth from "mammoth";
import { ParsedResumeSchema, type ParsedResume } from "./schema";

/**
 * Resume parsing service.
 *
 * Accepts a PDF or DOCX, and uses Claude (structured outputs) to turn it into
 * a `ParsedResume`. PDFs are sent to the model natively as a document block;
 * DOCX is converted to text first with mammoth.
 *
 * If ANTHROPIC_API_KEY is not set, returns a deterministic stub (with
 * `stub: true`) so the upload pipeline and UI work end-to-end during local
 * development without a key — mirrors the MOCK_* fallback the rest of the app
 * uses when Supabase isn't configured.
 */

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 4096;

const SYSTEM_INSTRUCTION =
  "You are a precise resume parser. Extract only what is present in the document; " +
  "do not invent details. If a field is absent, use null (or an empty array for lists). " +
  "Normalize the technical stack to canonical tool/technology names (e.g. 'AWS', 'PostgreSQL').";

export type ResumeFile = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
};

export type ParseResult = {
  resume: ParsedResume;
  stub: boolean;
};

export function isPdf(file: { mimeType: string; filename: string }): boolean {
  return (
    file.mimeType === "application/pdf" ||
    file.filename.toLowerCase().endsWith(".pdf")
  );
}

export function isDocx(file: { mimeType: string; filename: string }): boolean {
  return (
    file.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.filename.toLowerCase().endsWith(".docx")
  );
}

export async function parseResume(file: ResumeFile): Promise<ParseResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { resume: stubResume(), stub: true };
  }

  const client = new Anthropic();
  const content = await buildContent(file);

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_INSTRUCTION,
    messages: [{ role: "user", content }],
    output_config: { format: zodOutputFormat(ParsedResumeSchema) },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("Model did not return a parseable resume.");
  }
  return { resume: parsed, stub: false };
}

async function buildContent(
  file: ResumeFile,
): Promise<Anthropic.MessageParam["content"]> {
  const ask = {
    type: "text" as const,
    text: "Parse this resume into the required structure.",
  };

  if (isPdf(file)) {
    return [
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: file.buffer.toString("base64"),
        },
      },
      ask,
    ];
  }

  const { value: text } = await mammoth.extractRawText({ buffer: file.buffer });
  return [{ type: "text", text: `Resume text:\n\n${text}` }, ask];
}

function stubResume(): ParsedResume {
  return {
    fullName: "Jordan Sample",
    email: "jordan.sample@example.com",
    phone: "+1 (555) 010-0143",
    location: "Austin, TX",
    summary:
      "Stubbed result — set ANTHROPIC_API_KEY to parse real resumes. " +
      "Senior platform engineer with a cloud and DevOps focus.",
    yearsOfExperience: 7,
    coreCompetencies: [
      "Cloud Architecture",
      "DevOps",
      "Team Leadership",
      "CI/CD",
    ],
    technicalStack: [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Python",
      "Docker",
      "PostgreSQL",
    ],
    historicalRoles: [
      {
        title: "Senior Platform Engineer",
        company: "Northwind Cloud",
        startDate: "2021",
        endDate: "Present",
        durationMonths: 48,
        highlights: [
          "Led migration of 40+ services to EKS",
          "Cut deploy time 70% with a Terraform + ArgoCD pipeline",
        ],
      },
      {
        title: "DevOps Engineer",
        company: "Bluefin Systems",
        startDate: "2018",
        endDate: "2021",
        durationMonths: 36,
        highlights: ["Built the CI/CD platform on GitHub Actions"],
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Texas",
        year: "2018",
      },
    ],
    certifications: ["AWS Solutions Architect – Associate"],
  };
}
