import { test, expect } from "@playwright/test";
import { clean, EMAIL_RE } from "@/lib/validation";

test.describe("clean", () => {
  test("trims whitespace", () => {
    expect(clean("  hi  ")).toBe("hi");
  });

  test("caps length at max", () => {
    expect(clean("x".repeat(20), 5)).toBe("xxxxx");
  });

  test("returns null for non-strings", () => {
    expect(clean(123)).toBeNull();
    expect(clean(null)).toBeNull();
    expect(clean(undefined)).toBeNull();
  });

  test("returns null for empty/whitespace-only strings", () => {
    expect(clean("   ")).toBeNull();
    expect(clean("")).toBeNull();
  });
});

test.describe("EMAIL_RE", () => {
  test("matches basic emails", () => {
    expect(EMAIL_RE.test("a@b.com")).toBe(true);
    expect(EMAIL_RE.test("first.last@example.co")).toBe(true);
  });

  test("rejects malformed emails", () => {
    expect(EMAIL_RE.test("bad")).toBe(false);
    expect(EMAIL_RE.test("no-at-sign.com")).toBe(false);
    expect(EMAIL_RE.test("has @spaces.com")).toBe(false);
    expect(EMAIL_RE.test("no-domain@")).toBe(false);
  });
});
