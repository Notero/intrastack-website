"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { suspendUser, activateUser, type UserFormState } from "../actions";

const ROLES = ["admin", "customer", "applicant"] as const;
const STATUSES = ["active", "invited", "suspended", "deactivated"] as const;

const ROLE_DESC: Record<string, string> = {
  admin: "Full platform access. Can manage all content, users, and settings.",
  customer: "Can post jobs, manage listings, raise support tickets, and review applicants.",
  applicant: "Can apply for jobs and manage their profile.",
};

const STATUS_COLOR: Record<string, string> = {
  active: "text-green-700 bg-green-50 border-green-200",
  invited: "text-sky-700 bg-sky-50 border-sky-200",
  suspended: "text-red-700 bg-red-50 border-red-200",
  deactivated: "text-zinc-600 bg-zinc-50 border-zinc-200",
};

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  timezone: string | null;
  locale: string | null;
  role: string;
  status: string;
  created_at: string | null;
  last_sign_in_at: string | null;
}

interface Props {
  profile: Profile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roleProfile: any;
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
}

export function UserEditForm({ profile, action }: Props) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(action, {});

  const isSuspended = profile.status === "suspended";

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-3.5" /> Back to users
      </Link>

      {/* Status banner */}
      <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${STATUS_COLOR[profile.status] ?? STATUS_COLOR.active}`}>
        Account status: <span className="capitalize">{profile.status}</span>
        {profile.last_sign_in_at && (
          <span className="ml-3 font-normal opacity-70">
            Last sign-in: {new Date(profile.last_sign_in_at).toLocaleDateString()}
          </span>
        )}
      </div>

      {state.success && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{state.success}</p>
      )}
      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      {/* Role & status */}
      <Card>
        <CardHeader><CardTitle>Role &amp; access</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Role</Label>
                <Select name="role" defaultValue={profile.role}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        <span className="capitalize">{r}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-400">{ROLE_DESC[profile.role]}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</Label>
                <Select name="status" defaultValue={profile.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="capitalize">{s}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Full name</Label>
                <Input name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Display name</Label>
                <Input name="display_name" defaultValue={profile.display_name ?? ""} placeholder="Display name" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone</Label>
                <Input name="phone" defaultValue={profile.phone ?? ""} placeholder="+1 555 000 0000" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timezone</Label>
                <Input name="timezone" defaultValue={profile.timezone ?? ""} placeholder="e.g. America/New_York" />
              </div>
            </div>

            <div className="flex justify-end">
              <SubmitButton>Save changes</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account info (read-only) */}
      <Card>
        <CardHeader><CardTitle>Account info</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="Email" value={profile.email ?? "—"} />
          <Row label="User ID" value={profile.id} mono />
          <Row label="Joined" value={profile.created_at ? new Date(profile.created_at).toLocaleString() : "—"} />
          <Row label="Locale" value={profile.locale ?? "—"} />
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader><CardTitle className="text-red-700">Danger zone</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                {isSuspended ? "Reactivate account" : "Suspend account"}
              </div>
              <div className="text-xs text-zinc-500">
                {isSuspended
                  ? "Restore access. The user will be able to sign in again."
                  : "Block sign-in immediately. The user will not be able to access their account."}
              </div>
            </div>
            <form action={isSuspended ? activateUser.bind(null, profile.id) : suspendUser.bind(null, profile.id)}>
              <SubmitButton
                variant={isSuspended ? "outline" : "destructive"}
                size="sm"
              >
                {isSuspended ? "Reactivate" : "Suspend"}
              </SubmitButton>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-zinc-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      <span className={`text-sm text-zinc-700 ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
