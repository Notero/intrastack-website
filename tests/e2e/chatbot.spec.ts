import { test, expect } from "@playwright/test";

const FALLBACK_REPLY =
  "Sorry, something went wrong on our end. You can reach IntraStack directly at 888-959-7868 or info@intrastack.com.";
const NOT_CONFIGURED_REPLY =
  "AI chat is not configured yet. Email info@intrastack.com or call 888-959-7868.";

test("sending a message returns an assistant reply", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();

  const dialog = page.getByRole("dialog", { name: "IntraStack chat assistant" });
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder("Type your message...").fill("What services do you offer?");
  await dialog.getByRole("button", { name: "Send message" }).click();

  // Real Groq call (GROQ_API_KEY is configured) — content is non-deterministic,
  // so only assert a non-empty reply bubble appears beyond the greeting + the
  // user's own message, and that it isn't one of the known failure strings.
  const bubbles = dialog.locator("div.rounded-2xl");
  await expect(bubbles.last()).toBeVisible({ timeout: 15_000 });
  await expect(bubbles.last()).not.toHaveText("");
  await expect(bubbles.last()).not.toHaveText(FALLBACK_REPLY);
  await expect(bubbles.last()).not.toHaveText(NOT_CONFIGURED_REPLY);
});
