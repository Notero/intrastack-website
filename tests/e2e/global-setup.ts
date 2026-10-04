import { chromium, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "./loadEnv";
import type { Database } from "../../src/lib/supabase/database.types";

const AUTH_DIR = path.resolve(__dirname, ".auth");
const STATE_DIR = path.resolve(__dirname, ".state");
const RUN_STATE_FILE = path.join(STATE_DIR, "run.json");

async function loginAndSaveState(
  browser: import("@playwright/test").Browser,
  baseURL: string,
  email: string,
  password: string,
  stateFile: string
) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/login`);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15_000 });
  await context.storageState({ path: path.join(AUTH_DIR, stateFile) });
  await context.close();
}

export default async function globalSetup(config: FullConfig) {
  loadEnvLocal();

  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    E2E_ADMIN_EMAIL: process.env.E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD,
    E2E_CUSTOMER_EMAIL: process.env.E2E_CUSTOMER_EMAIL,
    E2E_CUSTOMER_PASSWORD: process.env.E2E_CUSTOMER_PASSWORD,
  };
  for (const [name, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing ${name} — add it to web-app/.env.local before running "pnpm test:e2e".`);
    }
  }

  const admin = createClient<Database>(required.NEXT_PUBLIC_SUPABASE_URL!, required.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // The applicant account is the one role anyone can self-register as, so
  // creating a fresh one per run (unlike the static admin/customer accounts)
  // mirrors real usage and keeps the long status-chain flow test starting
  // from a clean slate every time.
  const runId = Date.now().toString(36);
  const applicantEmail = `e2e-applicant-${runId}@intrastack-test.local`;
  const applicantPassword = `E2e-test-${runId}!`;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: applicantEmail,
    password: applicantPassword,
    email_confirm: true,
  });
  if (createError || !created.user) {
    throw new Error(`Failed to create the fresh e2e applicant user: ${createError?.message}`);
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(
    RUN_STATE_FILE,
    JSON.stringify({ runId, applicantId: created.user.id, applicantEmail, applicantPassword }, null, 2)
  );

  const baseURL = config.projects[0]?.use?.baseURL as string | undefined;
  if (!baseURL) throw new Error("playwright.e2e.config.ts must set use.baseURL");

  const browser = await chromium.launch();
  try {
    await loginAndSaveState(browser, baseURL, required.E2E_ADMIN_EMAIL!, required.E2E_ADMIN_PASSWORD!, "admin.json");
    await loginAndSaveState(browser, baseURL, required.E2E_CUSTOMER_EMAIL!, required.E2E_CUSTOMER_PASSWORD!, "customer.json");
    await loginAndSaveState(browser, baseURL, applicantEmail, applicantPassword, "applicant.json");
  } finally {
    await browser.close();
  }
}
