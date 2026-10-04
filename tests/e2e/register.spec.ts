import { test, expect } from "@playwright/test";

// ponytail: each run of the happy-path test leaves one unconfirmed
// auth.users row in the Dev project (the UI flow never returns an id to
// clean up). Add a admin.listUsers()-filtered cleanup by an
// "e2e-register-" email prefix if that volume ever becomes a problem.

// The register page's Suspense fallback is itself another <RegisterForm />,
// so right after navigation (before hydration settles) two copies can
// briefly exist in the DOM — wait for load to settle before interacting,
// and still scope to the first <form> defensively.

test("mismatched confirm password shows a field error without navigating", async ({ page }) => {
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  const form = page.locator("form").first();
  await form.locator("#fullName").fill("Test User");
  await form.locator("#email").fill(`e2e-register-${Date.now()}@intrastack-test.local`);
  await form.locator("#password").fill("password123");
  await form.locator("#confirmPassword").fill("different123");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Passwords do not match.")).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("valid signup shows the check-your-email confirmation screen", async ({ page }) => {
  const email = `e2e-register-${Date.now()}@intrastack-test.local`;
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  const form = page.locator("form").first();
  await form.locator("#fullName").fill("Test User");
  await form.locator("#email").fill(email);
  await form.locator("#password").fill("password123");
  await form.locator("#confirmPassword").fill("password123");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/\/register\?success=1/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
});
