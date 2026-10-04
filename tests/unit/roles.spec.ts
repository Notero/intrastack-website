import { test, expect } from "@playwright/test";
import { isRole, roleToDashboard } from "@/lib/auth/roles";

test.describe("isRole", () => {
  test("accepts known roles", () => {
    expect(isRole("admin")).toBe(true);
    expect(isRole("customer")).toBe(true);
    expect(isRole("applicant")).toBe(true);
  });

  test("rejects unknown or non-string values", () => {
    expect(isRole("recruiter")).toBe(false);
    expect(isRole("bogus")).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole(42)).toBe(false);
  });
});

test.describe("roleToDashboard", () => {
  test("maps each role to its dashboard path", () => {
    expect(roleToDashboard("admin")).toBe("/admin");
    expect(roleToDashboard("customer")).toBe("/customer");
    expect(roleToDashboard("applicant")).toBe("/applicant");
  });
});
