import { test, expect } from "@playwright/test";
import { ParsedResumeSchema } from "@/lib/resume/schema";

const validResume = {
  fullName: "Jordan Sample",
  email: "jordan@example.com",
  phone: null,
  location: null,
  summary: null,
  yearsOfExperience: null,
  coreCompetencies: [],
  technicalStack: [],
  historicalRoles: [],
  education: [],
  certifications: [],
};

test.describe("ParsedResumeSchema", () => {
  test("accepts a fully-populated valid resume", () => {
    const result = ParsedResumeSchema.safeParse(validResume);
    expect(result.success).toBe(true);
  });

  test("accepts nullable fields explicitly set to null", () => {
    const result = ParsedResumeSchema.safeParse({
      ...validResume,
      fullName: null,
      email: null,
    });
    expect(result.success).toBe(true);
  });

  test("rejects a missing required array field", () => {
    const { coreCompetencies, ...withoutCompetencies } = validResume;
    const result = ParsedResumeSchema.safeParse(withoutCompetencies);
    expect(result.success).toBe(false);
  });

  test("rejects a historicalRoles entry with the wrong shape", () => {
    const result = ParsedResumeSchema.safeParse({
      ...validResume,
      historicalRoles: [{ title: "Engineer" /* missing other required keys */ }],
    });
    expect(result.success).toBe(false);
  });

  test("accepts a well-formed historicalRoles entry", () => {
    const result = ParsedResumeSchema.safeParse({
      ...validResume,
      historicalRoles: [
        {
          title: "Engineer",
          company: "Acme",
          startDate: "2020",
          endDate: "Present",
          durationMonths: 12,
          highlights: ["Shipped things"],
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
