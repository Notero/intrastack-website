/**
 * Helpers for resolving Supabase Storage object paths to public URLs.
 * Public buckets serve objects at:
 *   <SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>
 *
 * We build the URL by string concatenation rather than calling
 * `supabase.storage.from(...).getPublicUrl(...)` to avoid an unnecessary
 * client instantiation on every render.
 */

export const NEWS_IMAGES_BUCKET = "news-images";
export const LEADERSHIP_PHOTOS_BUCKET = "leadership-photos";

function publicObjectUrl(bucket: string, path: string): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}

export function newsImageUrl(path?: string | null): string | null {
  if (!path) return null;
  return publicObjectUrl(NEWS_IMAGES_BUCKET, path);
}

export function leaderPhotoUrl(path?: string | null): string | null {
  if (!path) return null;
  return publicObjectUrl(LEADERSHIP_PHOTOS_BUCKET, path);
}
