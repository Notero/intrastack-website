"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { insertJobPost } from "@/lib/db/jobPosts";
import { notifyAllAdmins } from "@/lib/db/notifications";

const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
  "temporary",
] as const;
type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

const slugify = (raw: string) =>
  raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") +
  "-" +
  Date.now();

function str(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

function lines(v: FormDataEntryValue | null): string[] {
  if (v == null) return [];
  return String(v).split("\n").map((s) => s.trim()).filter(Boolean);
}

function tags(v: FormDataEntryValue | null): string[] {
  if (v == null) return [];
  return [...new Set(String(v).split(",").map((s) => s.trim()).filter(Boolean))];
}

export async function submitJobListing(formData: FormData): Promise<never> {
  const user = await requireRole(["customer", "admin"]);

  const title = str(formData.get("title"));
  const location = str(formData.get("location"));
  const employment_type = str(formData.get("employment_type")) as EmploymentType | null;
  const short_description = str(formData.get("short_description"));

  if (!title || !location || !employment_type || !short_description) {
    redirect("/customer/list_job?error=missing_fields");
  }

  if (!EMPLOYMENT_TYPES.includes(employment_type)) {
    redirect("/customer/list_job?error=invalid_type");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await insertJobPost(supabase, {
    recruiter_id: user.id,
    slug: slugify(title),
    title,
    team: str(formData.get("team")),
    location,
    remote: formData.get("remote") === "on",
    employment_type,
    seniority: str(formData.get("seniority")),
    salary_range: str(formData.get("salary_range")),
    short_description,
    description: str(formData.get("description")),
    responsibilities: lines(formData.get("responsibilities")),
    requirements: lines(formData.get("requirements")),
    nice_to_have: lines(formData.get("nice_to_have")),
    tags: tags(formData.get("tags")),
    published: false, // always pending review
  } satisfies TablesInsert<"job_posts">);

  if (error) redirect("/customer/list_job?error=db");

  await notifyAllAdmins(
    createAdminSupabaseClient(),
    "job",
    "New job listing submitted for review",
    `'${title}' is awaiting approval.`,
  );

  redirect("/customer/my_job_listings");
}
