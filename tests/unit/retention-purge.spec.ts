import { test, expect } from "@playwright/test";
import { monthsAgo } from "@/lib/retention/monthsAgo";
import { isAuthorizedCronRequest } from "@/lib/retention/cronAuth";

test.describe("monthsAgo", () => {
  test("subtracts calendar months, not fixed-length days", () => {
    const now = new Date();
    const twelve = new Date(monthsAgo(12));
    const expected = new Date(now);
    expected.setUTCMonth(expected.getUTCMonth() - 12);
    expect(twelve.toISOString().slice(0, 10)).toBe(expected.toISOString().slice(0, 10));
  });

  test("returns an ISO timestamp string", () => {
    expect(monthsAgo(24)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

test.describe("isAuthorizedCronRequest", () => {
  test("rejects when CRON_SECRET is unset", () => {
    delete process.env.CRON_SECRET;
    const req = new Request("http://localhost", {
      headers: { authorization: "Bearer anything" },
    });
    expect(isAuthorizedCronRequest(req)).toBe(false);
  });

  test("rejects a wrong secret", () => {
    process.env.CRON_SECRET = "right-secret";
    const req = new Request("http://localhost", {
      headers: { authorization: "Bearer wrong-secret" },
    });
    expect(isAuthorizedCronRequest(req)).toBe(false);
    delete process.env.CRON_SECRET;
  });

  test("accepts the correct bearer secret", () => {
    process.env.CRON_SECRET = "right-secret";
    const req = new Request("http://localhost", {
      headers: { authorization: "Bearer right-secret" },
    });
    expect(isAuthorizedCronRequest(req)).toBe(true);
    delete process.env.CRON_SECRET;
  });
});
