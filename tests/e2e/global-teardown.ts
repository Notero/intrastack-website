import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "./loadEnv";
import type { Database } from "../../src/lib/supabase/database.types";

const STATE_DIR = path.resolve(__dirname, ".state");
const RUN_STATE_FILE = path.join(STATE_DIR, "run.json");

export default async function globalTeardown() {
  loadEnvLocal();

  if (!fs.existsSync(RUN_STATE_FILE)) return;
  const run = JSON.parse(fs.readFileSync(RUN_STATE_FILE, "utf-8")) as {
    applicantId: string;
    jobPostId?: string;
  };

  const admin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  // Deleting the job post cascades applications/meetings/offer_letters/
  // onboarding_documents tied to it, keeping the static customer account
  // from accumulating a new listing every run without ever touching the
  // account itself.
  if (run.jobPostId) {
    await admin.from("job_posts").delete().eq("id", run.jobPostId);
  }

  // Cascades the fresh applicant's own rows (profile, applications, etc.).
  await admin.auth.admin.deleteUser(run.applicantId).catch(() => {});

  fs.rmSync(STATE_DIR, { recursive: true, force: true });
}
