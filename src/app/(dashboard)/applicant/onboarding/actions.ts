"use server";

import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { getResend, getFromEmail } from "@/lib/email/resend";

export interface RtrPayload {
  candidate: {
    fullName: string;
    roleSought: string;
    email: string;
    phone: string;
    otherAgencies?: string | null;
  };
  recruiter?: string | null;
  agreementDate: string;
  effectiveThrough: string;
  signature: {
    method: "draw" | "type";
    imageDataUrl: string;
  };
  submittedAtIso: string;
  submittedAtDisplay: string;
  userAgent: string;
}

export interface RtrResult {
  ok: boolean;
  error?: string;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function buildEmailHtml(payload: RtrPayload): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Right to Represent Agreement — Intrastack Solutions</title>
</head>
<body style="margin:0;padding:0;background:#F6F7F9;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2B2B2E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7F9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#1A1A1A;border-radius:12px 12px 0 0;padding:28px 32px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#FBC569;">Intrastack Solutions</p>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;line-height:1.25;">Right to Represent Agreement</h1>
          <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,.6);">Your signed agreement has been received and is securely on file.</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:14.5px;line-height:1.6;color:#2B2B2E;">
            Hi <strong>${payload.candidate.fullName}</strong>,<br><br>
            Thank you for completing your Right to Represent Agreement with Intrastack Solutions. A copy of your signed agreement is securely stored on file. Below is a summary of your submission.
          </p>

          <!-- Receipt table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E4E8;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            ${[
              ["Candidate", payload.candidate.fullName],
              ["Role Sought", payload.candidate.roleSought],
              ["Email", payload.candidate.email],
              ["Phone", payload.candidate.phone],
              ["Agreement Date", fmtDate(payload.agreementDate)],
              ["Effective Through", fmtDate(payload.effectiveThrough)],
              ["Signature Method", payload.signature.method === "draw" ? "Hand-drawn" : "Typed"],
              ["Submitted", payload.submittedAtDisplay],
            ]
              .map(
                ([label, value], i) =>
                  `<tr style="background:${i % 2 === 0 ? "#F6F7F9" : "#fff"};">
                    <td style="padding:10px 16px;font-size:12.5px;font-weight:600;color:#6B6F76;width:40%;">${label}</td>
                    <td style="padding:10px 16px;font-size:13px;color:#1A1A1A;">${value}</td>
                  </tr>`
              )
              .join("")}
          </table>

          <p style="margin:0;font-size:12.5px;color:#6B6F76;line-height:1.6;">
            This email serves as your confirmation receipt. If you have any questions, please contact your Intrastack recruiter or reach us at <a href="mailto:info@intrastack.com" style="color:#D9402A;">info@intrastack.com</a>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F6F7F9;border-radius:0 0 12px 12px;padding:16px 32px;border-top:1px solid #E2E4E8;">
          <p style="margin:0;font-size:11.5px;color:#6B6F76;">
            © ${new Date().getFullYear()} Intrastack Solutions · 331 Bella Vida Blvd, Orlando, FL 32828
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function submitRtrAction(payload: RtrPayload): Promise<RtrResult> {
  const user = await requireRole("applicant");
  const supabase = createAdminSupabaseClient();
  const ts = Date.now();

  // 1. Upload agreement JSON
  const jsonPath = `${user.id}/agreement_${ts}.json`;
  const { error: jsonErr } = await supabase.storage
    .from("representation_agreements")
    .upload(jsonPath, JSON.stringify(payload), {
      contentType: "application/json",
      upsert: false,
    });

  if (jsonErr) {
    console.error("[rtr] JSON upload failed:", jsonErr.message);
    return { ok: false, error: "Failed to store agreement. Please try again." };
  }

  // 2. Upload signature PNG (strip the data URL prefix)
  const base64 = payload.signature.imageDataUrl.replace(
    /^data:image\/png;base64,/,
    ""
  );
  const pngBuffer = Buffer.from(base64, "base64");
  const pngPath = `${user.id}/signature_${ts}.png`;

  const { error: pngErr } = await supabase.storage
    .from("representation_agreements")
    .upload(pngPath, pngBuffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (pngErr) {
    console.error("[rtr] PNG upload failed:", pngErr.message);
    // Non-fatal: JSON agreement is stored; continue
  }

  // 3. Mark profile as signed
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ signed_for_representation: true })
    .eq("id", user.id);

  if (profileErr) {
    console.error("[rtr] profile update failed:", profileErr.message);
    return {
      ok: false,
      error: "Agreement stored but profile update failed. Contact support.",
    };
  }

  // 4. Send confirmation email
  try {
    await getResend().emails.send({
      from: getFromEmail(),
      to: payload.candidate.email,
      subject: "Your Right to Represent Agreement — Intrastack Solutions",
      html: buildEmailHtml(payload),
    });
  } catch (emailErr) {
    // Email failure is non-fatal — the agreement is stored and profile updated
    console.error("[rtr] email send failed:", emailErr);
  }

  return { ok: true };
}
