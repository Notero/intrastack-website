import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import type { Database } from "../../src/lib/supabase/database.types";

/**
 * Full hiring-pipeline happy path across all three roles, using the static
 * admin/customer accounts and the fresh per-run applicant created by
 * global-setup.ts. Steps run serially because each one depends on DB state
 * the previous step created (a real one-way status chain, not test
 * isolation we can fake away).
 *
 * Job/application/meeting/document ids are looked up via the service-role
 * client rather than scraped from the DOM — the UI actions themselves are
 * still driven for real; this is only for chaining ids between steps.
 */

const AUTH_DIR = path.resolve(__dirname, ".auth");
const RUN_STATE_FILE = path.resolve(__dirname, ".state", "run.json");
const FIXTURE_PDF = path.resolve(__dirname, "fixtures", "sample.pdf");

// Lazy so `playwright test --list` (which never runs global-setup, so
// neither the env vars nor .state/run.json exist yet) can still enumerate
// this file instead of failing at import time.
let _admin: ReturnType<typeof createClient<Database>> | undefined;
function db() {
  if (!_admin) {
    _admin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

let _runState: { applicantId: string; applicantEmail: string; jobPostId?: string } | undefined;
function runState() {
  if (!_runState) {
    _runState = JSON.parse(fs.readFileSync(RUN_STATE_FILE, "utf-8"));
  }
  return _runState!;
}

const jobTitle = `E2E Test Role ${Date.now()}`;

function recordJobPostId(id: string) {
  const state = runState();
  state.jobPostId = id;
  fs.writeFileSync(RUN_STATE_FILE, JSON.stringify(state, null, 2));
}

test.describe.configure({ mode: "serial" });

let browser: Browser;
let adminCtx: BrowserContext, customerCtx: BrowserContext, applicantCtx: BrowserContext;
let adminPage: Page, customerPage: Page, applicantPage: Page;
let jobId: string;
let applicationId: string;

test.beforeAll(async ({ browser: b }) => {
  browser = b;
  adminCtx = await browser.newContext({ storageState: path.join(AUTH_DIR, "admin.json") });
  customerCtx = await browser.newContext({ storageState: path.join(AUTH_DIR, "customer.json") });
  applicantCtx = await browser.newContext({ storageState: path.join(AUTH_DIR, "applicant.json") });
  adminPage = await adminCtx.newPage();
  customerPage = await customerCtx.newPage();
  applicantPage = await applicantCtx.newPage();
});

test.afterAll(async () => {
  await adminCtx.close();
  await customerCtx.close();
  await applicantCtx.close();
});

test("1. customer posts a job", async () => {
  await customerPage.goto("/customer/list_job");
  await customerPage.locator('input[name="title"]').fill(jobTitle);
  await customerPage.locator('input[name="location"]').fill("Remote");
  await customerPage.locator('textarea[name="short_description"]').fill("E2E test job posting.");
  await customerPage.getByRole("button", { name: "Submit for review" }).click();
  await customerPage.waitForURL(/\/customer\/my_job_listings/, { timeout: 15_000 });

  const { data: job } = await db().from("job_posts").select("id").eq("title", jobTitle).single();
  expect(job).toBeTruthy();
  jobId = job!.id;
  recordJobPostId(jobId);
});

test("2. admin approves the job", async () => {
  await adminPage.goto("/admin/jobs");
  const row = adminPage.locator("tr", { hasText: jobTitle }).first();
  await row.getByRole("button", { name: "Review" }).click();
  await adminPage.getByRole("button", { name: "Approve" }).click();

  await expect
    .poll(async () => {
      const { data } = await db().from("job_posts").select("published").eq("id", jobId).single();
      return data?.published;
    }, { timeout: 15_000 })
    .toBe(true);
});

test("3. public careers page shows the job", async ({ page }) => {
  await page.goto("/careers");
  await expect(page.getByText(jobTitle)).toBeVisible();
});

test("4. applicant completes the RTR e-signature", async () => {
  await applicantPage.goto("/applicant/onboarding");

  const field = (label: string) => applicantPage.locator(".rtr-field", { hasText: label }).locator("input, textarea");
  await field("Full legal name").fill("E2E Applicant Test");
  await field("Role sought").fill("QA Engineer");
  await field("Phone").fill("+15551234567");
  await applicantPage.getByRole("button", { name: "Continue to review →" }).click();

  const scrollArea = applicantPage.locator(".rtr-doc-scroll");
  await scrollArea.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
    el.dispatchEvent(new Event("scroll"));
  });
  await applicantPage.locator(".rtr-card input[type=checkbox]").check();
  await applicantPage.getByRole("button", { name: "Continue to sign →" }).click();

  const canvas = applicantPage.locator(".rtr-canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("signature canvas not visible");
  await applicantPage.mouse.move(box.x + 10, box.y + box.height / 2);
  await applicantPage.mouse.down();
  await applicantPage.mouse.move(box.x + box.width - 10, box.y + box.height / 2, { steps: 10 });
  await applicantPage.mouse.up();

  await applicantPage.locator(".rtr-card input[type=checkbox]").check();
  await applicantPage.getByRole("button", { name: "Submit signed agreement" }).click();

  await expect(applicantPage.getByRole("heading", { name: "Agreement signed and submitted" })).toBeVisible({
    timeout: 15_000,
  });
});

test("5. applicant applies to the job", async () => {
  await applicantPage.goto("/applicant/jobs");
  await applicantPage.getByPlaceholder("Search jobs…").fill(jobTitle);
  await applicantPage.getByRole("button", { name: jobTitle }).first().click();
  await applicantPage.getByRole("button", { name: "Apply", exact: true }).click();
  await applicantPage.getByRole("button", { name: "Submit Application" }).click();

  await expect
    .poll(async () => {
      const { data } = await db()
        .from("applications")
        .select("id")
        .eq("job_post_id", jobId)
        .eq("applicant_id", runState().applicantId)
        .maybeSingle();
      return data?.id ?? null;
    }, { timeout: 15_000 })
    .not.toBeNull();

  const { data: application } = await db()
    .from("applications")
    .select("id")
    .eq("job_post_id", jobId)
    .eq("applicant_id", runState().applicantId)
    .single();
  applicationId = application!.id;
});

test("6. customer moves the application to interview", async () => {
  await customerPage.goto(`/customer/my_job_listings/${jobId}/talent`);
  // The fresh applicant has no full_name/display_name set, so the talent
  // page (nameById fallback chain) shows their email instead.
  const row = customerPage.locator("div.rounded-xl", { hasText: runState().applicantEmail });
  await row.getByTitle("Accept → Interview").click();

  await expect
    .poll(async () => {
      const { data } = await db().from("applications").select("status").eq("id", applicationId).single();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("interview");
});

test("7. applicant books an interview meeting", async () => {
  await applicantPage.goto(`/applicant/meetings/new?application=${applicationId}`);

  const proposed = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const value = proposed.toISOString().slice(0, 16);
  await applicantPage.locator("#proposed-at").fill(value);
  await applicantPage.getByRole("button", { name: "Book Meeting" }).click();

  await applicantPage.waitForURL(/\/applicant\/meetings$/, { timeout: 15_000 });

  // bookMeetingAction's redirect can fire a beat before the insert is
  // read-committed for a fresh query — wait for the row to actually be
  // visible before moving on, same pattern as every other step's poll.
  await expect
    .poll(async () => {
      const { data } = await db().from("meetings").select("id").eq("job_post_id", jobId).maybeSingle();
      return data?.id ?? null;
    }, { timeout: 15_000 })
    .not.toBeNull();
});

test("8. customer confirms then completes the meeting", async () => {
  await customerPage.goto("/customer/meetings");
  // MeetingRow's outer wrapper is the "div.rounded-xl" — a generic `div`
  // hasText match picks the innermost matching div, which doesn't contain
  // the meetingLink input as a descendant.
  const row = customerPage.locator("div.rounded-xl", { hasText: jobTitle }).first();
  await row.locator('input[name="meetingLink"]').fill("https://meet.example.com/e2e-test");
  await row.getByRole("button", { name: "Confirm" }).click();

  const completedRow = customerPage.locator("div.rounded-xl", { hasText: jobTitle }).first();
  await expect(completedRow.getByRole("button", { name: "Mark completed" })).toBeVisible({ timeout: 15_000 });
  await completedRow.getByRole("button", { name: "Mark completed" }).click();
});

test("9. customer sends the offer letter", async () => {
  await customerPage.goto(`/customer/my_job_listings/${jobId}/talent`);
  await customerPage.locator('input[name="file"]').setInputFiles(FIXTURE_PDF);
  await customerPage.getByRole("button", { name: "Send offer" }).click();

  await expect
    .poll(async () => {
      const { data } = await db()
        .from("offer_letters")
        .select("status")
        .eq("application_id", applicationId)
        .maybeSingle();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("sent");
});

test("10. applicant signs and returns the offer letter", async () => {
  await applicantPage.goto("/applicant/applications");
  await applicantPage.getByTitle("Download & sign offer letter").click();
  await applicantPage.locator('input[name="file"]').setInputFiles(FIXTURE_PDF);
  await applicantPage.getByRole("button", { name: "Upload signed offer" }).click();

  await expect
    .poll(async () => {
      const { data } = await db().from("offer_letters").select("status").eq("application_id", applicationId).single();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("signed");
});

test("11. customer accepts the signed offer", async () => {
  await customerPage.goto(`/customer/my_job_listings/${jobId}/talent`);
  await customerPage.getByRole("button", { name: "Accept signed offer" }).click();

  await expect
    .poll(async () => {
      const { data } = await db().from("applications").select("status").eq("id", applicationId).single();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("accepted");
});

test("12. customer uploads an onboarding document", async () => {
  await customerPage.goto(`/customer/my_job_listings/${jobId}/talent`);
  await customerPage.locator("#label").fill("Offer Letter");
  await customerPage.locator("#file").setInputFiles(FIXTURE_PDF);
  await customerPage.getByRole("button", { name: "Upload", exact: true }).click();

  await expect(customerPage.getByText("Document uploaded successfully!")).toBeVisible({ timeout: 15_000 });
});

test("13. applicant signs the onboarding document", async () => {
  await applicantPage.goto("/applicant/hire-docs");
  await applicantPage.locator('input[name="file"]').first().setInputFiles(FIXTURE_PDF);
  await applicantPage.getByRole("button", { name: "Upload signed copy" }).click();

  await expect
    .poll(async () => {
      const { data } = await db()
        .from("onboarding_documents")
        .select("status")
        .eq("application_id", applicationId)
        .maybeSingle();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("signed");
});

test("14. customer accepts the signed document and the applicant is hired", async () => {
  await customerPage.goto(`/customer/my_job_listings/${jobId}/talent`);
  await customerPage.getByTitle("Accept", { exact: true }).click();

  await expect
    .poll(async () => {
      const { data } = await db()
        .from("onboarding_documents")
        .select("status")
        .eq("application_id", applicationId)
        .single();
      return data?.status;
    }, { timeout: 15_000 })
    .toBe("accepted");

  await expect
    .poll(async () => {
      const { data } = await db().from("profiles").select("employer_id").eq("id", runState().applicantId).single();
      return data?.employer_id;
    }, { timeout: 15_000 })
    .not.toBeNull();
});
