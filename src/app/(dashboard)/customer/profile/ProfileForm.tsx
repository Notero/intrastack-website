"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { CheckCircle2 } from "lucide-react";
import { updateCustomerProfile, type CustomerProfileState } from "./actions";

interface Props {
  profile: {
    full_name: string | null;
    display_name: string | null;
    phone: string | null;
    timezone: string | null;
    email: string | null;
    locale: string | null;
  };
  customerProfile: {
    company_name: string | null;
    title: string | null;
    linkedin_url: string | null;
    verified: boolean;
    verified_at: string | null;
  } | null;
  userId: string;
}

const initial: CustomerProfileState = {};

export function ProfileForm({ profile, customerProfile, userId }: Props) {
  const [state, formAction] = useActionState(updateCustomerProfile, initial);

  return (
    <form action={formAction} className="space-y-6">
      {/* Personal info */}
      <Card>
        <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"     name="full_name"     defaultValue={profile.full_name ?? ""} />
            <Field label="Display name"  name="display_name"  defaultValue={profile.display_name ?? ""} />
            <Field label="Phone"         name="phone"         defaultValue={profile.phone ?? ""} />
            <Field label="Timezone"      name="timezone"      defaultValue={profile.timezone ?? "UTC"} />
          </div>
        </CardContent>
      </Card>

      {/* Customer info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer details</CardTitle>
            {customerProfile?.verified && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ Verified
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" name="company_name" defaultValue={customerProfile?.company_name ?? ""} />
            <Field label="Title"   name="title"        defaultValue={customerProfile?.title ?? ""} />
          </div>
          <Field label="LinkedIn URL" name="linkedin_url" defaultValue={customerProfile?.linkedin_url ?? ""} placeholder="https://linkedin.com/in/yourprofile" />
        </CardContent>
      </Card>

      {/* Read-only account info */}
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="Email"   value={profile.email ?? "—"} />
          <Row label="Locale"  value={profile.locale ?? "en"} />
          <Row label="User ID" value={userId} mono />
        </CardContent>
      </Card>

      {state.error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="size-4" /> Profile saved successfully.
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      <span className={`text-sm text-zinc-700 ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
