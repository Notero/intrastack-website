"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { insertJobPost, updateJobPost, deleteJobPost } from "@/lib/db/jobPosts";
import {
  JOB_POST_SNAPSHOT_COLUMNS,
  recordJobPostOutcome,
} from "@/lib/db/jobPostHistory";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { insertNotification } from "@/lib/db/notifications";

const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
  "temporary",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface JobFormState {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
}

const slugify = (raw: string) =>
  raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

/** Split a textarea by newlines into a clean array; empty if blank. */
function splitLines(v: FormDataEntryValue | null): string[] {
  if (v == null) return [];
  return String(v)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Comma-split tags; lowercase trim, dedupe, drop empties. */
function splitTags(v: FormDataEntryValue | null): string[] {
  if (v == null) return [];
  return [
    ...new Set(
      String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

function buildRow(formData: FormData, fallbackSlug?: string) {
  const title = strOrNull(formData.get("title"));
  const location = strOrNull(formData.get("location"));
  const employment_type = String(formData.get("employment_type") ?? "") as EmploymentType;
  const short_description = strOrNull(formData.get("short_description"));

  const fieldErrors: JobFormState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Required";
  if (!location) fieldErrors.location = "Required";
  if (!EMPLOYMENT_TYPES.includes(employment_type)) fieldErrors.employment_type = "Required";
  if (!short_description) fieldErrors.short_description = "Required";

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const slugRaw = strOrNull(formData.get("slug"));
  const slug = slugRaw ? slugify(slugRaw) : fallbackSlug ?? slugify(title!);

  return {
    row: {
      slug,
      title: title!,
      team: strOrNull(formData.get("team")),
      location: location!,
      remote: formData.get("remote") === "on",
      employment_type,
      seniority: strOrNull(formData.get("seniority")),
      salary_range: strOrNull(formData.get("salary_range")),
      short_description: short_description!,
      description: strOrNull(formData.get("description")),
      responsibilities: splitLines(formData.get("responsibilities")),
      requirements: splitLines(formData.get("requirements")),
      nice_to_have: splitLines(formData.get("nice_to_have")),
      tags: splitTags(formData.get("tags")),
      published: formData.get("published") === "on",
    } satisfies TablesInsert<"job_posts">,
  };
}

export async function createJob(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireRole("admin");
  const built = buildRow(formData);
  if ("fieldErrors" in built) return { fieldErrors: built.fieldErrors };

  const supabase = await createSupabaseServerClient();
  const { error } = await insertJobPost(supabase, built.row);
  if (error) return { error: error.message };

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function updateJob(
  id: string,
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("job_posts").select("slug").eq("id", id).single();

  const built = buildRow(formData, existing?.slug);
  if ("fieldErrors" in built) return { fieldErrors: built.fieldErrors };

  const { error } = await updateJobPost(supabase, id, built.row);
  if (error) return { error: error.message };

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(id: string) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await deleteJobPost(supabase, id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/jobs");
}

export async function toggleJobPublished(id: string, next: boolean) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await updateJobPost(supabase, id, { published: next });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/jobs");
}

export async function approveJob(id: string): Promise<void> {
  const admin = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("job_posts")
    .select(JOB_POST_SNAPSHOT_COLUMNS)
    .eq("id", id)
    .single();

  if (job) {
    await recordJobPostOutcome(supabase, job, "approved", admin.id);
  }

  const { error } = await updateJobPost(supabase, id, { published: true });
  if (error) throw new Error(error.message);

  if (job?.recruiter_id) {
    await insertNotification(createAdminSupabaseClient(), {
      user_id: job.recruiter_id,
      kind: "job",
      title: `Your job listing '${job.title}' has been approved and is now live`,
      body: "It's now visible to applicants on the careers page.",
    });
  }

  revalidatePath("/admin/jobs");
}

export async function rejectJob(id: string): Promise<void> {
  const admin = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("job_posts")
    .select(JOB_POST_SNAPSHOT_COLUMNS)
    .eq("id", id)
    .single();

  if (job) {
    await recordJobPostOutcome(supabase, job, "rejected", admin.id);
  }

  const { error } = await deleteJobPost(supabase, id);
  if (error) throw new Error(error.message);

  if (job?.recruiter_id) {
    await insertNotification(createAdminSupabaseClient(), {
      user_id: job.recruiter_id,
      kind: "job",
      title: `Your job listing '${job.title}' was not approved`,
      body: "Contact support if you have questions about this decision.",
    });
  }

  revalidatePath("/admin/jobs");
}
