"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Lock, CheckCircle } from "lucide-react";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";

interface Props {
  slug: string;
  title: string;
  fileUrl?: string | null;
}

type Step = "idle" | "submitting" | "done" | "error";

export function WhitepaperGateModal({ slug, title, fileUrl }: Props) {
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("");
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!consent) {
      setErrorMsg("Please agree to the privacy policy to continue.");
      setStep("error");
      return;
    }
    setStep("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/whitepaper-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          intent: intent.trim() || null,
          slug,
          title,
          consent: true,
          consent_version: PRIVACY_POLICY_VERSION,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStep("error");
        return;
      }
      setStep("done");
      // Trigger download if URL is available
      if (fileUrl) {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = title;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, 400);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("error");
    }
  }

  return (
    <div className="border-2 border-ink-900 sticky top-24">
      {/* Header */}
      <div className="bg-brand-600 text-white px-6 py-4 flex items-center gap-3">
        <Lock className="w-5 h-5 shrink-0" />
        <div>
          <div className="font-sans font-bold uppercase tracking-wider text-[12px]">
            Gated download
          </div>
          <div className="font-serif font-bold text-[18px] leading-none mt-0.5">
            Unlock the full report
          </div>
        </div>
      </div>

      <div className="p-6 bg-white">
        {step === "done" ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-12 h-12 text-brand-600 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-[20px] text-ink-900">You&apos;re all set!</h3>
            <p className="font-sans text-[14px] text-ink-600 mt-2 leading-relaxed">
              {fileUrl
                ? "Your download should start automatically. Check your email for a copy."
                : "We'll send the report to your email shortly."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-sans text-[13px] text-ink-600 leading-relaxed">
              Enter your email to download the full report instantly.
            </p>

            <div>
              <label className="font-sans text-[11px] font-bold uppercase tracking-wide text-ink-600">
                Work email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full h-10 border border-ink-300 bg-ink-50/60 px-3 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-sans text-[11px] font-bold uppercase tracking-wide text-ink-600">
                What are you looking for? <span className="font-normal text-ink-400 normal-case">(optional)</span>
              </label>
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="e.g. evaluating AI tools, competitive research, board presentation…"
                rows={3}
                className="mt-1 w-full border border-ink-300 bg-ink-50/60 px-3 py-2 font-sans text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-brand-600"
              />
              <span className="font-sans text-[11px] text-ink-600 leading-relaxed">
                I agree that Intrastack may store and process this information.{" "}
                <Link href="/privacy" className="font-bold text-brand-600 hover:underline">
                  Privacy policy
                </Link>
              </span>
            </label>

            {step === "error" && (
              <p className="font-sans text-[13px] text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={step === "submitting"}
              className="w-full bg-accent-400 text-ink-900 font-black uppercase tracking-wide text-[14px] py-3.5 flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {step === "submitting" ? "Processing…" : "Download the paper"}
            </button>

            <p className="font-sans text-[11px] text-ink-400 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
