import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { exportUserData } from "@/lib/gdpr/exportUserData";
import { logDataSubjectEvent } from "@/lib/audit/logDataSubjectEvent";
import { EMAIL_RE } from "@/lib/validation";

/**
 * GET /api/admin/gdpr-export?userId=<uuid|email>&requestedAt=<date>
 *
 * Admin-only. Assembles one person's data across every table + storage
 * bucket named in GDPR/CCPA task 9A and returns it as a downloadable JSON
 * attachment. Logs the export via log_audit_event (task 9C/9D).
 */
export async function GET(request: Request) {
  const actor = await requireRole("admin");

  const { searchParams } = new URL(request.url);
  const userIdOrEmail = searchParams.get("userId")?.trim();
  const requestedAt = searchParams.get("requestedAt") || new Date().toISOString();

  if (!userIdOrEmail) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();

  let subjectId = userIdOrEmail;
  if (EMAIL_RE.test(userIdOrEmail)) {
    const { data: byEmail } = await admin
      .from("profiles")
      .select("id")
      .eq("email", userIdOrEmail)
      .maybeSingle();
    if (!byEmail) {
      return NextResponse.json({ error: "No user found with that email." }, { status: 404 });
    }
    subjectId = byEmail.id;
  }

  const bundle = await exportUserData(admin, subjectId);
  if (!bundle.profile) {
    return NextResponse.json({ error: "No user found with that id." }, { status: 404 });
  }

  await logDataSubjectEvent("gdpr_export", actor, subjectId, {
    requested_at: requestedAt,
    fulfilled_at: new Date().toISOString(),
  });

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="gdpr-export-${subjectId}.json"`,
    },
  });
}
