"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmploymentType, JobFormState } from "./actions";

const EMPLOYMENT_OPTIONS: Array<{ value: EmploymentType; label: string }> = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

export interface JobFormDefaults {
  id?: string;
  title: string;
  slug: string;
  team: string;
  location: string;
  remote: boolean;
  employment_type: EmploymentType;
  seniority: string;
  salary_range: string;
  short_description: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  tags: string[];
  published: boolean;
}

interface Props {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  defaults: JobFormDefaults;
  submitLabel: string;
}

export function JobForm({ action, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<JobFormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Role</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Title"
              name="title"
              defaultValue={defaults.title}
              required
              error={state.fieldErrors?.title}
            />
            <Field label="Slug" name="slug" defaultValue={defaults.slug} placeholder="auto from title if empty" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Team" name="team" defaultValue={defaults.team} placeholder="e.g. Cloud Engineering" />
            <Field label="Seniority" name="seniority" defaultValue={defaults.seniority} placeholder="e.g. Senior" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Location"
              name="location"
              defaultValue={defaults.location}
              required
              error={state.fieldErrors?.location}
              placeholder="e.g. Austin, TX or Anywhere"
            />
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Employment type</Label>
              <Select name="employment_type" defaultValue={defaults.employment_type}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.fieldErrors?.employment_type ? (
                <p className="text-xs text-red-600">{state.fieldErrors.employment_type}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Salary range"
              name="salary_range"
              defaultValue={defaults.salary_range}
              placeholder="e.g. $150k – $180k"
            />
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Remote</div>
                <div className="text-xs text-zinc-500">Open to remote candidates</div>
              </div>
              <Switch name="remote" defaultChecked={defaults.remote} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="short_description" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Card summary
            </Label>
            <Textarea
              id="short_description"
              name="short_description"
              rows={2}
              defaultValue={defaults.short_description}
              required
              placeholder="1–2 sentences shown on the careers card"
            />
            {state.fieldErrors?.short_description ? (
              <p className="text-xs text-red-600">{state.fieldErrors.short_description}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Full description
            </Label>
            <Textarea id="description" name="description" rows={8} defaultValue={defaults.description} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bulleted sections</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-zinc-500">One bullet per line. Empty lines are ignored.</p>
          <BulletField label="Responsibilities" name="responsibilities" defaultValue={defaults.responsibilities} />
          <BulletField label="Requirements" name="requirements" defaultValue={defaults.requirements} />
          <BulletField label="Nice to have" name="nice_to_have" defaultValue={defaults.nice_to_have} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tags & visibility</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={defaults.tags.join(", ")}
              placeholder="AWS, Kubernetes, Terraform"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Published</div>
              <div className="text-xs text-zinc-500">Off = hidden from the public careers page.</div>
            </div>
            <Switch name="published" defaultChecked={defaults.published} />
          </div>
        </CardContent>
      </Card>

      {state.error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/jobs">Cancel</Link>
        </Button>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required = false,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}{required ? " *" : ""}
      </Label>
      <Input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function BulletField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</Label>
      <Textarea id={name} name={name} rows={5} defaultValue={defaultValue.join("\n")} />
    </div>
  );
}
