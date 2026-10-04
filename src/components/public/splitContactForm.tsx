"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/seo/site";
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

type Props = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  defaultInterest?: string;
};

export default function SplitContactForm({
  title = "Let's build something that actually ships.",
  subtitle = "Tell us where you are and where you want to be. A senior engineer will reply, not a sales rep.",
  eyebrow = "Get in touch",
  defaultInterest,
}: Props) {
  const pathname = usePathname();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [interest, setInterest] = useState<string>(
    defaultInterest ?? "Cloud Transformation"
  );
  const [consent, setConsent] = useState(false);

  const { email, telephone, address } = SITE.contact;
  const phoneDisplay = "+1 (888) 959-7868";
  const hqDisplay = `${address.addressLocality}, ${address.addressRegion}`;

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

  return (
    <Card className="grid grid-cols-1 overflow-hidden rounded-3xl p-0 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary p-10 md:p-14 text-primary-foreground">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-16 size-80 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {title}
          </h2>
          <p className="mt-4 text-base opacity-90 leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-10 space-y-5">
            <ContactRow
              icon={<Mail className="size-5" />}
              label="Email"
              value={email}
              href={`mailto:${email}`}
            />
            <ContactRow
              icon={<Phone className="size-5" />}
              label="Phone"
              value={phoneDisplay}
              href={`tel:${telephone}`}
            />
            <ContactRow
              icon={<MapPin className="size-5" />}
              label="HQ"
              value={hqDisplay}
            />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="p-8 md:p-12">
        {status === "ok" ? (
          <div className="flex h-full flex-col items-center justify-center text-center py-10">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-foreground">
              Message received.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for reaching out — a senior engineer will respond within
              one business day.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setStatus("idle")}
            >
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <h3 className="text-xl font-bold text-foreground">
              Send us a message
            </h3>

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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              <Label htmlFor="interest" className="text-sm font-semibold">
                Interest
              </Label>
              <select
                id="interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                {INTERESTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold">
                How can we help? <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="A few sentences is enough. Where you are, what's blocking, what you'd want from a partner."
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
                I agree that Intrastack may store and process this information
                to respond.{" "}
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
              size="lg"
              disabled={status === "submitting"}
              className="w-full"
            >
              {status === "submitting" ? (
                "Sending…"
              ) : (
                <>
                  Send message <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-75">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-4 hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    );
  }
  return <div className="flex items-center gap-4">{content}</div>;
}

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
      <Label htmlFor={name} className="text-sm font-semibold">
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
      />
    </div>
  );
}
