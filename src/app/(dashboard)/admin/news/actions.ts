"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import {
  insertNewsItem,
  updateNewsItem as updateNewsItemRow,
  deleteNewsItem,
} from "@/lib/db/newsItems";

const NEWS_IMAGES_BUCKET = "news-images";
const NEWS_FILES_BUCKET = "news-files";

const KINDS = ["blog", "trend", "whitepaper", "client_story"] as const;
export type NewsKind = (typeof KINDS)[number];

export interface NewsFormState {
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

async function uploadIfPresent(
  file: File | null,
  bucket: string,
  slug: string,
  suffix: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = await createSupabaseServerClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${slug}/${suffix}-${randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) throw new Error(`Upload failed (${bucket}/${path}): ${error.message}`);
  return path;
}

async function fileUrlFromPath(path: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${NEWS_FILES_BUCKET}/${path}`;
}

export async function createNewsItem(
  _prev: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  await requireRole("admin");

  const kind = String(formData.get("kind") ?? "") as NewsKind;
  if (!KINDS.includes(kind)) return { error: "Invalid kind." };

  const title = strOrNull(formData.get("title"));
  const excerpt = strOrNull(formData.get("excerpt"));
  const tagsRaw = strOrNull(formData.get("tags"));
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const fieldErrors: NewsFormState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Required";
  if (!excerpt) fieldErrors.excerpt = "Required";
  if (tags.length === 0) fieldErrors.tags = "Select at least one tag";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const slug = slugify(title!);

  const cover = formData.get("cover") as File | null;
  if (!cover || cover.size === 0) {
    return { fieldErrors: { cover: "Cover image is required" } };
  }

  try {
    const coverPath = await uploadIfPresent(cover, NEWS_IMAGES_BUCKET, slug, "cover");
    const image2Path = await uploadIfPresent(formData.get("image2") as File | null, NEWS_IMAGES_BUCKET, slug, "image2");
    const image3Path = await uploadIfPresent(formData.get("image3") as File | null, NEWS_IMAGES_BUCKET, slug, "image3");

    let fileUrl: string | null = null;
    if (kind === "whitepaper") {
      const pdf = formData.get("pdf") as File | null;
      if (pdf && pdf.size > 0) {
        const pdfPath = await uploadIfPresent(pdf, NEWS_FILES_BUCKET, slug, "doc");
        fileUrl = pdfPath ? await fileUrlFromPath(pdfPath) : null;
      }
    }

    const row = {
      slug,
      kind,
      title: title!,
      excerpt: excerpt!,
      tags,
      body: strOrNull(formData.get("body")),
      cover_image_path: coverPath!,
      image_2_path: image2Path,
      image_3_path: image3Path,
      published: formData.get("published") === "on",
      author: kind === "blog" ? strOrNull(formData.get("author")) : null,
      read_time: kind === "trend" ? (formData.get("read_time") ? parseInt(String(formData.get("read_time")), 10) || null : null) : null,
      pages: kind === "whitepaper" ? (formData.get("pages") ? Number(formData.get("pages")) : null) : null,
      file_size: kind === "whitepaper" ? strOrNull(formData.get("file_size")) : null,
      file_url: fileUrl,
      client: kind === "client_story" ? strOrNull(formData.get("client")) : null,
      industry: kind === "client_story" ? strOrNull(formData.get("industry")) : null,
      metric_value: kind === "client_story" ? strOrNull(formData.get("metric_value")) : null,
      metric_label: kind === "client_story" ? strOrNull(formData.get("metric_label")) : null,
    } satisfies TablesInsert<"news_items">;

    const supabase = await createSupabaseServerClient();
    const { error } = await insertNewsItem(supabase, row);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNewsItem(
  id: string,
  _prev: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  await requireRole("admin");

  const kind = String(formData.get("kind") ?? "") as NewsKind;
  if (!KINDS.includes(kind)) return { error: "Invalid kind." };

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: fetchErr } = await supabase
    .from("news_items")
    .select("slug, cover_image_path, image_2_path, image_3_path, file_url")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) return { error: fetchErr?.message ?? "Not found" };

  const title = strOrNull(formData.get("title"));
  const excerpt = strOrNull(formData.get("excerpt"));
  const tagsRaw = strOrNull(formData.get("tags"));
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  if (!title || !excerpt || tags.length === 0) return { error: "Title, excerpt and tags are required." };

  const slug = slugify(title!) || existing.slug;

  try {
    const newCover = await uploadIfPresent(formData.get("cover") as File | null, NEWS_IMAGES_BUCKET, slug, "cover");
    const newImg2  = await uploadIfPresent(formData.get("image2") as File | null, NEWS_IMAGES_BUCKET, slug, "image2");
    const newImg3  = await uploadIfPresent(formData.get("image3") as File | null, NEWS_IMAGES_BUCKET, slug, "image3");

    let fileUrl: string | null | undefined = undefined;
    if (kind === "whitepaper") {
      const pdf = formData.get("pdf") as File | null;
      if (pdf && pdf.size > 0) {
        const pdfPath = await uploadIfPresent(pdf, NEWS_FILES_BUCKET, slug, "doc");
        fileUrl = pdfPath ? await fileUrlFromPath(pdfPath) : null;
      }
    }

    const row = {
      slug,
      kind,
      title: title!,
      excerpt: excerpt!,
      tags,
      body: strOrNull(formData.get("body")),
      cover_image_path: newCover ?? existing.cover_image_path,
      image_2_path: newImg2 ?? existing.image_2_path,
      image_3_path: newImg3 ?? existing.image_3_path,
      published: formData.get("published") === "on",
      author: kind === "blog" ? strOrNull(formData.get("author")) : null,
      read_time: kind === "trend" ? (formData.get("read_time") ? parseInt(String(formData.get("read_time")), 10) || null : null) : null,
      pages: kind === "whitepaper" ? (formData.get("pages") ? Number(formData.get("pages")) : null) : null,
      file_size: kind === "whitepaper" ? strOrNull(formData.get("file_size")) : null,
      file_url: fileUrl !== undefined ? fileUrl : (kind === "whitepaper" ? existing.file_url : null),
      client: kind === "client_story" ? strOrNull(formData.get("client")) : null,
      industry: kind === "client_story" ? strOrNull(formData.get("industry")) : null,
      metric_value: kind === "client_story" ? strOrNull(formData.get("metric_value")) : null,
      metric_label: kind === "client_story" ? strOrNull(formData.get("metric_label")) : null,
    } satisfies TablesUpdate<"news_items">;

    const { error } = await updateNewsItemRow(supabase, id, row);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNewsItemAction(id: string) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await deleteNewsItem(supabase, id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/news");
}

export async function toggleNewsPublished(id: string, next: boolean) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await updateNewsItemRow(supabase, id, { published: next });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/news");
}
