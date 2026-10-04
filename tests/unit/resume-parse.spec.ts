import { test, expect } from "@playwright/test";
import { isPdf, isDocx, parseResume } from "@/lib/resume/parse";

test.describe("isPdf", () => {
  test("matches by mimeType", () => {
    expect(isPdf({ mimeType: "application/pdf", filename: "resume.bin" })).toBe(true);
  });

  test("matches by extension when mimeType is generic", () => {
    expect(isPdf({ mimeType: "application/octet-stream", filename: "resume.PDF" })).toBe(true);
  });

  test("rejects non-PDF files", () => {
    expect(isPdf({ mimeType: "application/octet-stream", filename: "resume.docx" })).toBe(false);
  });
});

test.describe("isDocx", () => {
  test("matches by mimeType", () => {
    expect(
      isDocx({
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename: "resume.bin",
      })
    ).toBe(true);
  });

  test("matches by extension when mimeType is generic", () => {
    expect(isDocx({ mimeType: "application/octet-stream", filename: "resume.DOCX" })).toBe(true);
  });

  test("rejects non-DOCX files", () => {
    expect(isDocx({ mimeType: "application/pdf", filename: "resume.pdf" })).toBe(false);
  });
});

test.describe("parseResume stub branch", () => {
  test("returns the deterministic stub when ANTHROPIC_API_KEY is unset", async () => {
    const prev = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const result = await parseResume({
        buffer: Buffer.from(""),
        mimeType: "application/pdf",
        filename: "resume.pdf",
      });
      expect(result.stub).toBe(true);
      expect(result.resume.fullName).toBe("Jordan Sample");
      expect(result.resume.email).toBe("jordan.sample@example.com");
    } finally {
      if (prev !== undefined) process.env.ANTHROPIC_API_KEY = prev;
    }
  });
});
