import { test, expect } from "@playwright/test";
import path from "node:path";

const AUTH_DIR = path.resolve(__dirname, ".auth");

test.describe("route protection", () => {
  for (const route of ["/admin", "/customer", "/applicant"]) {
    test(`unauthenticated visit to ${route} redirects to /login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }

  test("wrong-role access redirects to /unauthorized", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: path.join(AUTH_DIR, "applicant.json"),
    });
    const page = await context.newPage();
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/unauthorized/);
    await context.close();
  });
});

test.describe("login form", () => {
  test("bad credentials show an error", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill("nobody@intrastack-test.local");
    await page.locator("#password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("correct admin credentials redirect to /admin", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill(process.env.E2E_ADMIN_EMAIL!);
    await page.locator("#password").fill(process.env.E2E_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
  });

  test("correct customer credentials redirect to /customer", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill(process.env.E2E_CUSTOMER_EMAIL!);
    await page.locator("#password").fill(process.env.E2E_CUSTOMER_PASSWORD!);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/customer/, { timeout: 15_000 });
  });
});
