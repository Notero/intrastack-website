import { test, expect } from "@playwright/test";
import { getFromEmail } from "@/lib/email/resend";

test.describe("getFromEmail", () => {
  test("throws when RESEND_FROM_EMAIL is not set", () => {
    const prev = process.env.RESEND_FROM_EMAIL;
    delete process.env.RESEND_FROM_EMAIL;
    try {
      expect(() => getFromEmail()).toThrow("RESEND_FROM_EMAIL env var is not set");
    } finally {
      if (prev !== undefined) process.env.RESEND_FROM_EMAIL = prev;
    }
  });

  test("returns the value when set", () => {
    const prev = process.env.RESEND_FROM_EMAIL;
    process.env.RESEND_FROM_EMAIL = "noreply@intrastack.com";
    try {
      expect(getFromEmail()).toBe("noreply@intrastack.com");
    } finally {
      if (prev === undefined) delete process.env.RESEND_FROM_EMAIL;
      else process.env.RESEND_FROM_EMAIL = prev;
    }
  });
});
