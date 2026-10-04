"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";

type Status = "idle" | "submitting" | "ok" | "error";

const INTERESTS = [
  "Cloud Transformation",
  "Cloud Migration",
  "AI & Machine Learning",
  "DevOps & Automation",
  "Data Analytics",
  "Security & Compliance",
  "Software Development",
  "Staff Augmentation",
  "IT Consulting",
  "Not sure yet",
] as const;

type Variant = "card" | "embedded";

type Props = {
  variant?: Variant;
  title?: string;
  subtitle?: string;
  defaultInterest?: string;
};

const CONTACT_EMAIL = "info@intrastack.com";

export default function ReachUsForm({
  variant = "card",
  title = "Talk to a senior engineer.",
  subtitle = "Same business day reply. No SDRs.",
  defaultInterest,
}: Props) {
  const pathname = usePathname();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [interest, setInterest] = useState<string>(
    defaultInterest ?? "Cloud Transformation"
  );
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const urlParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const payload = {
      full_name: String(fd.get("full_name") ?? "").trim(),
      work_email: String(fd.get("work_email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      company: String(fd.get("company") ?? "").trim() || null,
      interests: [interest],
      message: String(fd.get("message") ?? "").trim(),
      consent_to_contact: consent,
      consent_version: PRIVACY_POLICY_VERSION,
      source_path: pathname,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      website: String(fd.get("website") ?? ""),
    };

    if (!payload.full_name || !payload.work_email || !payload.company) {
      setStatus("error");
      setErrorMsg("Name, work email, and company are required.");
      return;
    }
    if (payload.message.length < 10) {
      setStatus("error");
      setErrorMsg("Please share a sentence or two about what's on fire.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setErrorMsg("Please consent to being contacted about your enquiry.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
      setInterest(defaultInterest ?? "Cloud Transformation");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "ok") {
    return (
      <Shell variant={variant}>
        <div className="py-6 text-center">
          <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-foreground">
            Message received.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for reaching out — a senior engineer will respond within one
            business day.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setStatus("idle")}
          >
            Send another
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell variant={variant}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-primary via-primary/70 to-secondary shadow-sm"
        />
        <div className="min-w-0">
          <h2 className="text-2xl md:text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
        {/* Honeypot */}
        <div className="sr-only" aria-hidden>
          <label htmlFor="website">Website (leave empty)</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Full name"
            name="full_name"
            required
            autoComplete="name"
            placeholder="Jane Doe"
          />
          <Field
            label="Work email"
            name="work_email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Company"
            name="company"
            required
            autoComplete="organization"
            placeholder="Company name"
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="interest"
            className="text-sm font-semibold text-foreground"
          >
            Interest
          </Label>
          <select
            id="interest"
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="h-11 w-full rounded-lg border border-base-300 bg-paper px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
          >
            {INTERESTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="text-sm font-semibold text-foreground"
          >
            How can we help? <span className="text-primary">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="A few sentences is enough. Where you are, what's blocking, what you'd want from a partner."
            className="rounded-lg border-base-300 bg-paper focus-visible:ring-primary/30 focus-visible:border-primary"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            id="consent"
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree that Intrastack may store and process this information to
            respond.{" "}
            <Link
              href="/privacy"
              className="font-semibold text-primary hover:underline"
            >
              Privacy policy
            </Link>
          </span>
        </label>

        {status === "error" && errorMsg && (
          <p className="text-sm text-destructive" role="alert">
            {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold shadow-sm"
        >
          {status === "submitting" ? (
            "Sending…"
          ) : (
            <>
              Send message <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Or email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-primary hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </form>
    </Shell>
  );
}

/* ----------------------------- shell ---------------------------- */

function Shell({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  if (variant === "embedded") {
    return <div>{children}</div>;
  }
  return (
    <div className="rounded-3xl border border-base-300 bg-paper p-6 md:p-10 shadow-sm">
      {children}
    </div>
  );
}

/* ----------------------------- fields ---------------------------- */

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-11 rounded-lg border-base-300 bg-paper px-3.5 focus-visible:ring-primary/30 focus-visible:border-primary"
      />
    </div>
  );
}
