import { test, expect } from "@playwright/test";
import { getClientKeyFromRequest } from "@/lib/rateLimit";

test.describe("getClientKeyFromRequest", () => {
  test("uses the first entry of x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientKeyFromRequest(req)).toBe("1.2.3.4");
  });

  test("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getClientKeyFromRequest(req)).toBe("9.9.9.9");
  });

  test("falls back to 'unknown' when neither header is set", () => {
    const req = new Request("http://localhost");
    expect(getClientKeyFromRequest(req)).toBe("unknown");
  });
});
