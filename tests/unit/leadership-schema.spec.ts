import { test, expect } from "@playwright/test";
import { personSchema } from "@/app/(dashboard)/admin/_leadership/schema";

const validPerson = {
  name: "Jane Doe",
  title: "VP of Engineering",
  group_name: "vp",
  display_order: 0,
};

test.describe("personSchema", () => {
  test("accepts minimal valid input", () => {
    const result = personSchema.safeParse(validPerson);
    expect(result.success).toBe(true);
  });

  test("rejects an invalid group_name", () => {
    const result = personSchema.safeParse({ ...validPerson, group_name: "manager" });
    expect(result.success).toBe(false);
  });

  test("rejects a malformed email", () => {
    const result = personSchema.safeParse({ ...validPerson, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  test("accepts an empty email string (optional field)", () => {
    const result = personSchema.safeParse({ ...validPerson, email: "" });
    expect(result.success).toBe(true);
  });

  test("rejects a URL without a scheme", () => {
    const result = personSchema.safeParse({
      ...validPerson,
      linkedin_url: "linkedin.com/in/janedoe",
    });
    expect(result.success).toBe(false);
  });

  test("accepts a well-formed https URL", () => {
    const result = personSchema.safeParse({
      ...validPerson,
      linkedin_url: "https://linkedin.com/in/janedoe",
    });
    expect(result.success).toBe(true);
  });

  test("rejects missing required fields", () => {
    const result = personSchema.safeParse({ title: "VP" });
    expect(result.success).toBe(false);
  });
});
