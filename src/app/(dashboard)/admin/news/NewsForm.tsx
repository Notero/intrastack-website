"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewsFormState, NewsKind } from "./actions";

// ─── Tag catalogue ──────────────────────────────────────────────────────────
// These must match the `name` values used in industryPage / servicePage /
// solutionPage so the overlap query in fetchNewsByTags fires correctly.

const TAG_GROUPS = [
  {
    group: "Industries",
    tags: ["Education", "Finance", "Government", "Healthcare", "Logistics", "Manufacturing", "Retail", "Telecom"],
  },
  {
    group: "Services",
    tags: [
      "Cloud Transformation",
      "DevOps & Automation",
      "AI & Machine Learning",
      "Cybersecurity",
      "Software Development",
      "Mobile Development",
      "Hardware & Software",
      "Staffing Services",
      "Cloud Migration",
      "Cloud Strategy & Design",
    ],
  },
  {
    group: "Solutions",
    tags: [
      "Data Analytics",
      "Security & Compliance",
      "Business Continuity",
      "AWS",
      "Azure",
      "Kubernetes",
      "AI Automation",
      "Enterprise Security",
      "CI/CD Transformation",
      "Hybrid Cloud",
    ],
  },
] as const;

const ALL_TAGS = TAG_GROUPS.flatMap((g) => g.tags);

// ─── Types ──────────────────────────────────────────────────────────────────

const KIND_OPTIONS: Array<{ value: NewsKind; label: string; description: string }> = [
  { value: "blog", label: "Blog post", description: "General article, announcement, or insight." },
  { value: "trend", label: "Trend", description: "Industry trend with a read-time estimate." },
  { value: "whitepaper", label: "Whitepaper", description: "In-depth PDF document." },
  { value: "client_story", label: "Client story", description: "Case study with a measurable outcome." },
];

export interface NewsFormDefaults {
  id?: string;
  kind: NewsKind;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  published: boolean;
  author: string;
  read_time: number | string;
  pages: string;
  file_size: string;
  file_url: string;
  client: string;
  industry: string;
  metric_value: string;
  metric_label: string;
  coverUrl: string | null;
  image2Url: string | null;
  image3Url: string | null;
}

interface Props {
  action: (state: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  defaults: NewsFormDefaults;
  submitLabel: string;
}

// ─── Tag picker ─────────────────────────────────────────────────────────────

function TagPicker({ defaultTags, error }: { defaultTags: string[]; error?: string }) {
  const [selected, setSelected] = useState<string[]>(defaultTags);

  const toggle = (tag: string) =>
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Tags <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-zinc-400 mt-0.5">
          Select every industry, service, or solution this article should appear under.
        </p>
      </div>

      {/* Hidden input carries the value */}
      <input type="hidden" name="tags" value={selected.join(",")} />

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          {selected.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-brand-500"
            >
              {t}
              <button type="button" onClick={() => toggle(t)} className="hover:text-brand-500">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag groups */}
      <div className="space-y-3">
        {TAG_GROUPS.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">{g.group}</p>
            <div className="flex flex-wrap gap-1.5">
              {g.tags.map((tag) => {
                const active = selected.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-brand-500 bg-brand-500/5 text-brand-500"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

// ─── Main form ───────────────────────────────────────────────────────────────

export function NewsForm({ action, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<NewsFormState, FormData>(action, {});
  const [kind, setKind] = useState<NewsKind>(defaults.kind);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="kind" value={kind} />

      {/* ── Kind + publish ── */}
      <Card>
        <CardHeader><CardTitle>Article type</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {KIND_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setKind(o.value)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  kind === o.value
                    ? "border-brand-500 bg-brand-500/5 ring-1 ring-brand-500"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <div className="text-sm font-semibold text-zinc-900">{o.label}</div>
                <div className="mt-1 text-xs text-zinc-500">{o.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Core content ── */}
      <Card>
        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input id="title" name="title" defaultValue={defaults.title} placeholder="Article title" required />
            <p className="text-xs text-zinc-400">Slug is auto-generated from the title.</p>
            {state.fieldErrors?.title ? <p className="text-xs text-red-600">{state.fieldErrors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Excerpt <span className="text-red-500">*</span>
            </Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={defaults.excerpt} rows={2} placeholder="1–2 sentence summary shown on cards." required />
            {state.fieldErrors?.excerpt ? <p className="text-xs text-red-600">{state.fieldErrors.excerpt}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Body</Label>
            <Textarea id="body" name="body" defaultValue={defaults.body} rows={12} placeholder="Full article content. Newlines are preserved." />
          </div>

          {kind === "blog" && (
            <div className="space-y-2">
              <Label htmlFor="author" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Author</Label>
              <Input id="author" name="author" defaultValue={defaults.author} placeholder="e.g. Jane Smith" />
            </div>
          )}

          {kind === "trend" && (
            <div className="space-y-2">
              <Label htmlFor="read_time" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Read time (minutes)</Label>
              <Input id="read_time" name="read_time" type="number" min={1} defaultValue={defaults.read_time?.toString()} placeholder="e.g. 6" />
            </div>
          )}

          {kind === "whitepaper" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pages" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Pages</Label>
                <Input id="pages" name="pages" type="number" min={1} defaultValue={defaults.pages} placeholder="e.g. 18" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_size" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">File size</Label>
                <Input id="file_size" name="file_size" defaultValue={defaults.file_size} placeholder="e.g. 4.8 MB" />
              </div>
            </div>
          )}

          {kind === "client_story" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Client</Label>
                <Input id="client" name="client" defaultValue={defaults.client} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Industry</Label>
                <Input id="industry" name="industry" defaultValue={defaults.industry} placeholder="e.g. Healthcare" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metric_value" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Metric value</Label>
                <Input id="metric_value" name="metric_value" defaultValue={defaults.metric_value} placeholder="e.g. 38%" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metric_label" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Metric label</Label>
                <Input id="metric_label" name="metric_label" defaultValue={defaults.metric_label} placeholder="e.g. faster delivery" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Tags ── */}
      <Card>
        <CardHeader><CardTitle>Tags &amp; visibility</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <TagPicker defaultTags={defaults.tags} error={state.fieldErrors?.tags} />

          <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Published</div>
              <div className="text-xs text-zinc-500">Off = draft, hidden from the public site.</div>
            </div>
            <Switch name="published" defaultChecked={defaults.published} />
          </div>
        </CardContent>
      </Card>

      {/* ── Images ── */}
      <Card>
        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <ImageField
            name="cover"
            label="Cover image"
            required={!defaults.id}
            existingUrl={defaults.coverUrl}
            hint="Shown on cards and the detail page hero."
            error={state.fieldErrors?.cover}
          />
          <ImageField name="image2" label="Image 2 (optional)" existingUrl={defaults.image2Url} />
          <ImageField name="image3" label="Image 3 (optional)" existingUrl={defaults.image3Url} />
        </CardContent>
      </Card>

      {/* ── PDF (whitepaper only) ── */}
      {kind === "whitepaper" && (
        <Card>
          <CardHeader><CardTitle>PDF file</CardTitle></CardHeader>
          <CardContent>
            <PdfField existingUrl={defaults.file_url || null} />
          </CardContent>
        </Card>
      )}

      {state.error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/news">Cancel</Link>
        </Button>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ImageField({
  name, label, required = false, existingUrl, hint, error,
}: {
  name: string; label: string; required?: boolean;
  existingUrl?: string | null; hint?: string; error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}{required ? " *" : ""}
      </Label>
      <div className="flex items-start gap-4">
        {(preview || existingUrl) ? (
          <img src={preview ?? existingUrl ?? ""} alt="" className="h-24 w-32 rounded-md border border-zinc-200 object-cover" />
        ) : (
          <div className="grid h-24 w-32 place-items-center rounded-md border-2 border-dashed border-zinc-200 text-xs text-zinc-400">
            No image
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Input id={name} name={name} type="file" accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}

function PdfField({ existingUrl }: { existingUrl: string | null }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <Label htmlFor="pdf" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">PDF</Label>
      <Input id="pdf" name="pdf" type="file" accept="application/pdf"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
      />
      {name ? <p className="text-xs text-zinc-500">Will upload: {name}</p> : null}
      {existingUrl && !name ? (
        <p className="text-xs text-zinc-500">
          Current: <a href={existingUrl} target="_blank" rel="noreferrer" className="underline">view PDF</a>
        </p>
      ) : null}
    </div>
  );
}
