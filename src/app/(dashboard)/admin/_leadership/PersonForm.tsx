"use client";

import { useActionState, useRef, useState } from "react";
import type { ZodError } from "zod";
import { Plus, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CERT_CATALOG } from "@/lib/content/certifications";
import { REGIONS, basicInfoSchema, contactSchema, type LeadershipGroupValue } from "./schema";
import type { PersonFormState } from "./actions";

export interface GroupOption {
  value: LeadershipGroupValue;
  label: string;
}

export interface PersonFormDefaults {
  id?: string;
  name: string;
  title: string;
  group_name: LeadershipGroupValue;
  region: string;
  email: string;
  phone: string;
  linkedin_url: string;
  instagram_url: string;
  twitter_url: string;
  intro: string; // paragraphs joined by blank lines
  highlights: { title: string; body: string }[];
  closing: string;
  certifications: string[];
  display_order: number;
  published: boolean;
  photoUrl: string | null;
}

interface Props {
  action: (state: PersonFormState, formData: FormData) => Promise<PersonFormState>;
  defaults: PersonFormDefaults;
  submitLabel: string;
  cancelHref: string;
  groupOptions: GroupOption[];
}

const STEPS = [
  { id: "basic", label: "Basic Info" },
  { id: "contact", label: "Contact & Photo" },
  { id: "bio", label: "Bio & Credentials" },
] as const;
type StepId = (typeof STEPS)[number]["id"];

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const NO_REGION = "none";

function flattenZodError(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

export function PersonForm({ action, defaults, submitLabel, cancelHref, groupOptions }: Props) {
  const [state, formAction] = useActionState<PersonFormState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState<StepId>("basic");
  const [groupName, setGroupName] = useState<LeadershipGroupValue>(defaults.group_name);
  const [region, setRegion] = useState<string>(defaults.region || NO_REGION);
  const [highlights, setHighlights] = useState(defaults.highlights);
  const [certifications, setCertifications] = useState<string[]>(defaults.certifications);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const fieldError = (key: string) => stepErrors[key] ?? state.fieldErrors?.[key];

  const addHighlight = () => setHighlights((prev) => [...prev, { title: "", body: "" }]);
  const removeHighlight = (i: number) => setHighlights((prev) => prev.filter((_, idx) => idx !== i));
  const updateHighlight = (i: number, patch: Partial<{ title: string; body: string }>) =>
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));

  const toggleCert = (name: string) =>
    setCertifications((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  function validateStep(id: StepId): boolean {
    if (!formRef.current) return true;
    const fd = new FormData(formRef.current);

    if (id === "basic") {
      const result = basicInfoSchema.safeParse({
        name: String(fd.get("name") ?? ""),
        title: String(fd.get("title") ?? ""),
        group_name: groupName,
        region: region === NO_REGION ? "" : region,
        display_order: String(fd.get("display_order") ?? "0"),
      });
      if (!result.success) {
        setStepErrors(flattenZodError(result.error));
        return false;
      }
    } else if (id === "contact") {
      const result = contactSchema.safeParse({
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        linkedin_url: String(fd.get("linkedin_url") ?? ""),
        instagram_url: String(fd.get("instagram_url") ?? ""),
        twitter_url: String(fd.get("twitter_url") ?? ""),
      });
      if (!result.success) {
        setStepErrors(flattenZodError(result.error));
        return false;
      }
    }

    setStepErrors({});
    return true;
  }

  function goNext() {
    if (validateStep(step) && stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1].id);
    }
  }

  function goToStep(id: StepId) {
    setStepErrors({});
    setStep(id);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f && f.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo must be 5MB or smaller.");
      setPhotoPreview(null);
      e.target.value = "";
      return;
    }
    setPhotoError(null);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="group_name" value={groupName} />
      <input type="hidden" name="region" value={region === NO_REGION ? "" : region} />
      <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />
      <input type="hidden" name="certifications" value={JSON.stringify(certifications)} />

      <Tabs value={step} onValueChange={(v) => goToStep(v as StepId)}>
        <TabsList className="!h-auto w-full !justify-between !gap-0 !rounded-none !bg-transparent !p-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <TabsTrigger
                value={s.id}
                className="!h-auto !flex-col !gap-2 !rounded-none border-none !p-0 data-active:!bg-transparent data-active:!text-foreground"
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                    stepIndex > i
                      ? "bg-zinc-900 text-white"
                      : stepIndex === i
                        ? "border-2 border-zinc-900 text-zinc-900"
                        : "border border-zinc-300 text-zinc-400"
                  )}
                >
                  {stepIndex > i ? <Check className="size-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap",
                    stepIndex >= i ? "text-foreground" : "text-zinc-400"
                  )}
                >
                  {s.label}
                </span>
              </TabsTrigger>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1", stepIndex > i ? "bg-zinc-900" : "bg-zinc-200")} />
              )}
            </div>
          ))}
        </TabsList>

        {/* ── Basic Info ── */}
        <TabsContent value="basic" forceMount className="mt-6 data-[state=inactive]:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Who this person is, and where they show up on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="name" name="name" defaultValue={defaults.name} placeholder="Full name" required />
                  {fieldError("name") ? <p className="text-xs text-red-600">{fieldError("name")}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input id="title" name="title" defaultValue={defaults.title} placeholder="e.g. Chief Executive Officer" required />
                  {fieldError("title") ? <p className="text-xs text-red-600">{fieldError("title")}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Group</Label>
                  <Select value={groupName} onValueChange={(v) => setGroupName(v as LeadershipGroupValue)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {groupOptions.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError("group_name") ? <p className="text-xs text-red-600">{fieldError("group_name")}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Region (optional)</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_REGION}>No region specified</SelectItem>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">Published</div>
                  <div className="text-xs text-zinc-500">Off = draft, hidden from the public site.</div>
                </div>
                <Switch name="published" defaultChecked={defaults.published} />
              </div>

              <div className="max-w-xs space-y-2">
                <Label htmlFor="display_order" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Display order
                </Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={defaults.display_order} />
                <p className="text-xs text-zinc-400">
                  Controls the order people appear in the public listing — lower numbers show first. Leave at 0
                  unless you need to reorder.
                </p>
                {fieldError("display_order") ? <p className="text-xs text-red-600">{fieldError("display_order")}</p> : null}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={goNext}>Next: Contact & Photo</Button>
          </div>
        </TabsContent>

        {/* ── Contact & Photo ── */}
        <TabsContent value="contact" forceMount className="mt-6 data-[state=inactive]:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Photo</CardTitle>
              <CardDescription>How visitors can reach them, plus their headshot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                {(photoPreview || defaults.photoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview ?? defaults.photoUrl ?? ""} alt="" className="h-24 w-24 rounded-full border border-zinc-200 object-cover" />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-zinc-200 text-xs text-zinc-400">
                    No photo
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Input id="photo" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                  <p className="text-xs text-zinc-500">Optional — falls back to initials if left blank. Max 5MB.</p>
                  {photoError ? <p className="text-xs text-red-600">{photoError}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={defaults.email} placeholder="name@intrastack.com" />
                  {fieldError("email") ? <p className="text-xs text-red-600">{fieldError("email")}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={defaults.phone} placeholder="+1 555 555 5555" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">LinkedIn</Label>
                  <Input id="linkedin_url" name="linkedin_url" defaultValue={defaults.linkedin_url} placeholder="https://linkedin.com/in/..." />
                  {fieldError("linkedin_url") ? <p className="text-xs text-red-600">{fieldError("linkedin_url")}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Instagram</Label>
                  <Input id="instagram_url" name="instagram_url" defaultValue={defaults.instagram_url} placeholder="https://instagram.com/..." />
                  {fieldError("instagram_url") ? <p className="text-xs text-red-600">{fieldError("instagram_url")}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Twitter / X</Label>
                  <Input id="twitter_url" name="twitter_url" defaultValue={defaults.twitter_url} placeholder="https://x.com/..." />
                  {fieldError("twitter_url") ? <p className="text-xs text-red-600">{fieldError("twitter_url")}</p> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={() => goToStep("basic")}>Back</Button>
            <Button type="button" onClick={goNext}>Next: Bio & Credentials</Button>
          </div>
        </TabsContent>

        {/* ── Bio & Credentials (optional — leave blank for a card-only entry with no linked bio page) ── */}
        <TabsContent value="bio" forceMount className="mt-6 data-[state=inactive]:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Bio & Credentials</CardTitle>
              <CardDescription>
                Optional — their story, focus areas, and certifications. Leave blank for a card-only entry with no
                linked bio page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="intro" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Intro</Label>
                <Textarea id="intro" name="intro" defaultValue={defaults.intro} rows={8} placeholder={"First paragraph.\n\nSecond paragraph."} />
                <p className="text-xs text-zinc-400">Separate paragraphs with a blank line.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Highlights</Label>
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-zinc-200 p-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={h.title}
                        onChange={(e) => updateHighlight(i, { title: e.target.value })}
                        placeholder="Highlight title"
                      />
                      <Textarea
                        value={h.body}
                        onChange={(e) => updateHighlight(i, { body: e.target.value })}
                        rows={2}
                        placeholder="Highlight body"
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(i)} className="text-red-600 hover:text-red-700 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="mr-1.5 h-4 w-4" />Add highlight
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Closing pull-quote</Label>
                <Textarea id="closing" name="closing" defaultValue={defaults.closing} rows={3} />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Certifications</Label>
                <p className="text-xs text-zinc-400">
                  Select any certifications this person holds — shown on their public bio page.
                </p>
                <div className="space-y-4">
                  {CERT_CATALOG.map((group) => (
                    <div key={group.id}>
                      <div className="text-xs font-semibold text-zinc-700">{group.vendor}</div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {group.certs.map((c) => (
                          <label key={c.name} className="flex items-center gap-2 text-sm text-zinc-700">
                            <Checkbox
                              checked={certifications.includes(c.name)}
                              onCheckedChange={() => toggleCert(c.name)}
                            />
                            {c.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {state.error ? (
            <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => goToStep("contact")}>Back</Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" asChild>
                <a href={cancelHref}>Cancel</a>
              </Button>
              <SubmitButton>{submitLabel}</SubmitButton>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
