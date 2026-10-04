"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import {
  insertLeadershipPerson,
  updateLeadershipPerson as updateLeadershipPersonRow,
  deleteLeadershipPerson,
} from "@/lib/db/leadershipPeople";
import { personSchema, type LeadershipGroupValue } from "./schema";

const LEADERSHIP_PHOTOS_BUCKET = "leadership-photos";

export interface PersonFormState {
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

function parseIntro(raw: FormDataEntryValue | null): string[] {
  const text = String(raw ?? "").trim();
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function parseHighlights(raw: FormDataEntryValue | null): { title: string; body: string }[] {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((h) => ({ title: String(h?.title ?? "").trim(), body: String(h?.body ?? "").trim() }))
      .filter((h) => h.title || h.body);
  } catch {
    return [];
  }
}

function parseCertifications(raw: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c): c is string => typeof c === "string" && c.trim().length > 0);
  } catch {
    return [];
  }
}

async function uploadPhotoIfPresent(file: File | null, slug: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = await createSupabaseServerClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${slug}/photo-${randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(LEADERSHIP_PHOTOS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) throw new Error(`Upload failed (${LEADERSHIP_PHOTOS_BUCKET}/${path}): ${error.message}`);
  return path;
}

function buildRow(formData: FormData) {
  const name = strOrNull(formData.get("name"));
  const title = strOrNull(formData.get("title"));
  const group_name = String(formData.get("group_name") ?? "") as LeadershipGroupValue;
  const region = strOrNull(formData.get("region"));
  const email = strOrNull(formData.get("email"));
  const phone = strOrNull(formData.get("phone"));
  const linkedin_url = strOrNull(formData.get("linkedin_url"));
  const instagram_url = strOrNull(formData.get("instagram_url"));
  const twitter_url = strOrNull(formData.get("twitter_url"));
  const displayOrderRaw = strOrNull(formData.get("display_order"));
  const certifications = parseCertifications(formData.get("certifications"));

  const validation = personSchema.safeParse({
    name: name ?? "",
    title: title ?? "",
    group_name,
    region: region ?? "",
    display_order: displayOrderRaw ?? "0",
    email: email ?? "",
    phone: phone ?? "",
    linkedin_url: linkedin_url ?? "",
    instagram_url: instagram_url ?? "",
    twitter_url: twitter_url ?? "",
    certifications,
  });

  const fieldErrors: PersonFormState["fieldErrors"] = {};
  if (!validation.success) {
    for (const issue of validation.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }

  const display_order = displayOrderRaw ? parseInt(displayOrderRaw, 10) || 0 : 0;

  return {
    fieldErrors,
    name,
    title,
    group_name,
    region,
    email,
    phone,
    linkedin_url,
    instagram_url,
    twitter_url,
    intro: parseIntro(formData.get("intro")),
    highlights: parseHighlights(formData.get("highlights")),
    closing: strOrNull(formData.get("closing")),
    certifications,
    display_order,
    published: formData.get("published") === "on",
  };
}

export async function createLeadershipPerson(
  listPath: "/admin/leadership" | "/admin/advisors",
  _prev: PersonFormState,
  formData: FormData,
): Promise<PersonFormState> {
  await requireRole("admin");

  const parsed = buildRow(formData);
  if (Object.keys(parsed.fieldErrors).length) return { fieldErrors: parsed.fieldErrors };

  const slug = slugify(parsed.name!);

  try {
    const photoPath = await uploadPhotoIfPresent(formData.get("photo") as File | null, slug);

    const row = {
      slug,
      name: parsed.name!,
      title: parsed.title!,
      group_name: parsed.group_name,
      region: parsed.region,
      photo_path: photoPath,
      email: parsed.email,
      phone: parsed.phone,
      linkedin_url: parsed.linkedin_url,
      instagram_url: parsed.instagram_url,
      twitter_url: parsed.twitter_url,
      intro: parsed.intro,
      highlights: parsed.highlights,
      closing: parsed.closing,
      certifications: parsed.certifications,
      display_order: parsed.display_order,
      published: parsed.published,
    } satisfies TablesInsert<"leadership_people">;

    const supabase = await createSupabaseServerClient();
    const { error } = await insertLeadershipPerson(supabase, row);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  revalidatePath(listPath);
  revalidatePath(listPath === "/admin/leadership" ? "/about/leadership" : "/about/advisors");
  redirect(listPath);
}

export async function updateLeadershipPerson(
  listPath: "/admin/leadership" | "/admin/advisors",
  id: string,
  _prev: PersonFormState,
  formData: FormData,
): Promise<PersonFormState> {
  await requireRole("admin");

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: fetchErr } = await supabase
    .from("leadership_people")
    .select("slug, photo_path")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) return { error: fetchErr?.message ?? "Not found" };

  const parsed = buildRow(formData);
  if (Object.keys(parsed.fieldErrors).length) return { fieldErrors: parsed.fieldErrors };

  const slug = slugify(parsed.name!) || existing.slug;

  try {
    const newPhoto = await uploadPhotoIfPresent(formData.get("photo") as File | null, slug);

    const row = {
      slug,
      name: parsed.name!,
      title: parsed.title!,
      group_name: parsed.group_name,
      region: parsed.region,
      photo_path: newPhoto ?? existing.photo_path,
      email: parsed.email,
      phone: parsed.phone,
      linkedin_url: parsed.linkedin_url,
      instagram_url: parsed.instagram_url,
      twitter_url: parsed.twitter_url,
      intro: parsed.intro,
      highlights: parsed.highlights,
      closing: parsed.closing,
      certifications: parsed.certifications,
      display_order: parsed.display_order,
      published: parsed.published,
    } satisfies TablesUpdate<"leadership_people">;

    const { error } = await updateLeadershipPersonRow(supabase, id, row);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  revalidatePath(listPath);
  revalidatePath(listPath === "/admin/leadership" ? "/about/leadership" : "/about/advisors");
  redirect(listPath);
}

export async function deleteLeadershipPersonAction(
  listPath: "/admin/leadership" | "/admin/advisors",
  id: string,
) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await deleteLeadershipPerson(supabase, id);
  if (error) throw new Error(error.message);
  revalidatePath(listPath);
  revalidatePath(listPath === "/admin/leadership" ? "/about/leadership" : "/about/advisors");
}

export async function toggleLeadershipPublished(
  listPath: "/admin/leadership" | "/admin/advisors",
  id: string,
  next: boolean,
) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await updateLeadershipPersonRow(supabase, id, { published: next });
  if (error) throw new Error(error.message);
  revalidatePath(listPath);
  revalidatePath(listPath === "/admin/leadership" ? "/about/leadership" : "/about/advisors");
}
