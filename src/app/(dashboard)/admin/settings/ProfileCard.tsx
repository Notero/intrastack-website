"use client";

import { useActionState, useState } from "react";
import { Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Separator } from "@/components/ui/separator";
import { updateProfile, type ProfileFormState } from "./actions";

export interface ProfileData {
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  timezone: string | null;
  locale: string | null;
  avatar_url: string | null;
  department: string | null;
}

const initialState: ProfileFormState = {};

export function ProfileCard({ profile }: { profile: ProfileData }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  const onSave = (fd: FormData) => {
    formAction(fd);
  };

  // Close edit mode once a save succeeds.
  if (state.ok && editing) setTimeout(() => setEditing(false), 0);

  const initials = (profile.full_name ?? profile.email ?? "A")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle>Profile</CardTitle>
        {editing ? (
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700 text-lg font-bold text-white">
            {initials}
          </span>
          <div>
            <div className="text-base font-semibold text-zinc-900">
              {profile.display_name || profile.full_name || profile.email || "Admin"}
            </div>
            <div className="text-sm text-zinc-500">{profile.email}</div>
          </div>
        </div>

        <Separator />

        {editing ? (
          <form action={onSave} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" name="full_name" defaultValue={profile.full_name ?? ""} />
              <Field label="Display name" name="display_name" defaultValue={profile.display_name ?? ""} />
              <Field label="Phone" name="phone" defaultValue={profile.phone ?? ""} />
              <Field label="Avatar URL" name="avatar_url" defaultValue={profile.avatar_url ?? ""} />
              <Field label="Timezone" name="timezone" defaultValue={profile.timezone ?? "UTC"} />
              <Field label="Locale" name="locale" defaultValue={profile.locale ?? "en"} />
              <Field label="Department" name="department" defaultValue={profile.department ?? ""} />
            </div>

            {state.error ? (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            ) : null}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <SubmitButton>Save</SubmitButton>
            </div>
          </form>
        ) : (
          <dl className="grid gap-5 md:grid-cols-2">
            <Row k="Full name" v={profile.full_name} />
            <Row k="Display name" v={profile.display_name} />
            <Row k="Phone" v={profile.phone} />
            <Row k="Avatar URL" v={profile.avatar_url} mono />
            <Row k="Timezone" v={profile.timezone} mono />
            <Row k="Locale" v={profile.locale} mono />
            <Row k="Department" v={profile.department} />
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}

function Row({ k, v, mono = false }: { k: string; v: string | null; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{k}</dt>
      <dd className={mono ? "break-all font-mono text-sm text-zinc-700" : "text-sm text-zinc-700"}>
        {v ?? <span className="text-zinc-400">—</span>}
      </dd>
    </div>
  );
}
