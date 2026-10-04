import { NextResponse } from "next/server";
import { purgeExpiredData } from "@/lib/retention/purgeExpiredData";
import { isAuthorizedCronRequest } from "@/lib/retention/cronAuth";

/**
 * GET /api/cron/purge-expired-data
 *
 * Vercel Cron target (see web-app/vercel.json), monthly. Task 11 — data
 * retention automation.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await purgeExpiredData();
  return NextResponse.json({ ok: true, summary });
}
