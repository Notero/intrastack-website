"use client";

import { useState } from "react";
import {
  Mail, MapPin, Phone, Briefcase, Edit2, CheckCircle2,
  Globe, Link2, Building2, Clock, X, Plus, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { updateProfileAction, type ProfileData } from "../actions";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria",
  "Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia",
  "Czech Republic","Denmark","Egypt","Ethiopia","Finland","France",
  "Germany","Ghana","Greece","Hungary","India","Indonesia","Iran",
  "Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria",
  "Norway","Pakistan","Peru","Philippines","Poland","Portugal",
  "Romania","Russia","Saudi Arabia","Singapore","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Tanzania",
  "Thailand","Turkey","UAE","Uganda","Ukraine","United Kingdom",
  "United States","Vietnam","Zimbabwe",
] as const;

const TIMEZONES = [
  "UTC",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid",
  "Europe/Rome","Europe/Amsterdam","Europe/Stockholm","Europe/Warsaw",
  "Europe/Istanbul","Europe/Moscow",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "America/Toronto","America/Vancouver","America/Sao_Paulo","America/Mexico_City",
  "Asia/Dubai","Asia/Karachi","Asia/Kolkata","Asia/Dhaka","Asia/Bangkok",
  "Asia/Singapore","Asia/Shanghai","Asia/Tokyo","Asia/Seoul",
  "Africa/Lagos","Africa/Nairobi","Africa/Johannesburg","Africa/Cairo",
  "Australia/Sydney","Australia/Melbourne","Pacific/Auckland",
] as const;

interface Props {
  email: string | null;
  initialData: ProfileData;
}

export function ProfileCard({ email, initialData }: Props) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [data, setData]       = useState<ProfileData>(initialData);
  const [skillInput, setSkillInput] = useState("");

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    set("phone", e.target.value.replace(/[^\d+\s\-()]/g, ""));
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || data.skills.includes(trimmed)) return;
    set("skills", [...data.skills, trimmed]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    set("skills", data.skills.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  const completionFields: (string | number | boolean | string[] | null | undefined)[] = [
    data.fullName, email, data.phone, data.location, data.currentTitle,
    data.currentCompany, data.headline, data.bio,
    data.skills.length > 0 ? "yes" : "",
    data.linkedinUrl,
  ];
  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

  const initials = data.fullName
    ? data.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  async function handleSave() {
    await updateProfileAction(data);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-zinc-900/10 text-lg font-bold text-zinc-900">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{data.fullName || "—"}</p>
            {data.headline && <p className="text-sm text-zinc-500">{data.headline}</p>}
            <p className="text-xs text-zinc-400">{email}</p>
          </div>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
            <Edit2 className="size-3.5" />
            Edit
          </Button>
        )}
      </div>

      {/* Completion bar */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
          <span>Profile completion</span>
          <span>{completion}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {editing ? (
        <div className="space-y-8">

          {/* ── Basic info ─────────────────────────────────────────────── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Basic Info</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={data.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="How you appear publicly" />
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" value={data.headline} onChange={(e) => set("headline", e.target.value)} placeholder="e.g. Senior Cloud Engineer · Open to work" />
              </div>
              <div className="col-span-full flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={data.bio} onChange={(e) => set("bio", e.target.value)} placeholder="A short summary about yourself…" rows={3} />
              </div>
            </div>
          </section>

          {/* ── Contact ────────────────────────────────────────────────── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Contact</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input value={email ?? ""} disabled className="opacity-60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={data.phone} onChange={handlePhoneChange} placeholder="+1 555 000 0000" inputMode="tel" type="tel" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Select value={data.location} onValueChange={(v) => set("location", v)}>
                  <SelectTrigger id="location"><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={data.timezone} onValueChange={(v) => set("timezone", v)}>
                  <SelectTrigger id="timezone"><SelectValue placeholder="Select timezone" /></SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ── Professional ───────────────────────────────────────────── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Professional</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentTitle">Job Title</Label>
                <Input id="currentTitle" value={data.currentTitle} onChange={(e) => set("currentTitle", e.target.value)} placeholder="e.g. Cloud Engineer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input id="currentCompany" value={data.currentCompany} onChange={(e) => set("currentCompany", e.target.value)} placeholder="e.g. Acme Corp" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min={0}
                  max={60}
                  value={data.yearsExperience ?? ""}
                  onChange={(e) => set("yearsExperience", e.target.value === "" ? null : Number(e.target.value))}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Open to work</p>
                  <p className="text-xs text-zinc-500">Visible to recruiters</p>
                </div>
                <Switch
                  checked={data.openToWork}
                  onCheckedChange={(v) => set("openToWork", v)}
                />
              </div>
            </div>
          </section>

          {/* ── Skills ─────────────────────────────────────────────────── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Skills</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill} className="shrink-0 gap-1">
                  <Plus className="size-3.5" />Add
                </Button>
              </div>
              {data.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1.5 pr-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Links ──────────────────────────────────────────────────── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Links</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input id="linkedinUrl" value={data.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/yourname" type="url" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="githubUrl">GitHub</Label>
                <Input id="githubUrl" value={data.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/yourname" type="url" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="portfolioUrl">Portfolio / Website</Label>
                <Input id="portfolioUrl" value={data.portfolioUrl} onChange={(e) => set("portfolioUrl", e.target.value)} placeholder="https://yoursite.com" type="url" />
              </div>
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={() => { setData(initialData); setEditing(false); }}>Cancel</Button>
          </div>
        </div>

      ) : (
        /* ── Read view ──────────────────────────────────────────────────── */
        <div className="space-y-6">

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Basic Info</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ReadField icon={Mail}      label="Email"        value={email} />
              <ReadField icon={Briefcase} label="Headline"     value={data.headline} />
              {data.bio && (
                <div className="col-span-full">
                  <p className="text-xs text-zinc-500">Bio</p>
                  <p className="mt-0.5 text-sm text-zinc-900 whitespace-pre-line">{data.bio}</p>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Contact</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ReadField icon={Phone}  label="Phone"    value={data.phone} />
              <ReadField icon={MapPin} label="Location" value={data.location} />
              <ReadField icon={Clock}  label="Timezone" value={data.timezone !== "UTC" ? data.timezone : null} />
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Professional</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ReadField icon={Briefcase}  label="Title"       value={data.currentTitle} />
              <ReadField icon={Building2}  label="Company"     value={data.currentCompany} />
              <ReadField icon={Clock}      label="Experience"  value={data.yearsExperience != null ? `${data.yearsExperience} year${data.yearsExperience === 1 ? "" : "s"}` : null} />
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${data.openToWork ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                  {data.openToWork ? "Open to work" : "Not open to work"}
                </span>
              </div>
            </dl>
          </section>

          {data.skills.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </section>
          )}

          {(data.linkedinUrl || data.githubUrl || data.portfolioUrl) && (
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Links</h3>
              <div className="flex flex-col gap-2">
                {data.linkedinUrl  && <LinkRow icon={Link2}        label="LinkedIn"  href={data.linkedinUrl} />}
                {data.githubUrl    && <LinkRow icon={Link2}        label="GitHub"    href={data.githubUrl} />}
                {data.portfolioUrl && <LinkRow icon={ExternalLink} label="Portfolio" href={data.portfolioUrl} />}
              </div>
            </section>
          )}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="size-4" />
          Profile saved successfully.
        </div>
      )}
    </div>
  );
}

function ReadField({
  icon: Icon, label, value,
}: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-zinc-400" />
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-900">
          {value || <span className="italic text-zinc-400">Not set</span>}
        </p>
      </div>
    </div>
  );
}

function LinkRow({
  icon: Icon, label, href,
}: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-primary hover:underline"
    >
      <Icon className="size-4 shrink-0 text-zinc-400" />
      {label}
    </a>
  );
}
