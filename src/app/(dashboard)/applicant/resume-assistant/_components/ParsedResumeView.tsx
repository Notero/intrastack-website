import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ParsedResume } from "@/lib/resume/schema";

function initials(name: string | null): string {
  if (!name) return "—";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
      {children}
    </h3>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <Icon className="size-4 shrink-0 text-zinc-400" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-900">{value}</div>
        <div className="text-[11px] uppercase tracking-wide text-zinc-400">{label}</div>
      </div>
    </div>
  );
}

export function ParsedResumeView({ resume }: { resume: ParsedResume }) {
  const contact = [resume.email, resume.phone, resume.location].filter(Boolean);
  const contactIcons = [Mail, Phone, MapPin];

  return (
    <div className="space-y-6">
      {/* Identity header */}
      <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-zinc-900 text-sm font-bold text-white">
          {initials(resume.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-zinc-900">
            {resume.fullName ?? "Unnamed candidate"}
          </h2>
          {contact.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
              {contact.map((value, i) => {
                const Icon = contactIcons[i] ?? Mail;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <Icon className="size-3.5 text-zinc-400" />
                    {value}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <p className="text-sm leading-relaxed text-zinc-600">{resume.summary}</p>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          icon={Clock}
          label="Experience"
          value={
            resume.yearsOfExperience != null
              ? `${resume.yearsOfExperience} yrs`
              : "—"
          }
        />
        <Stat
          icon={Briefcase}
          label="Roles"
          value={String(resume.historicalRoles.length)}
        />
        <Stat
          icon={Award}
          label="Certifications"
          value={String(resume.certifications.length)}
        />
      </div>

      {/* Core competencies */}
      {resume.coreCompetencies.length > 0 && (
        <div className="space-y-2.5">
          <SectionLabel>Core competencies</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {resume.coreCompetencies.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Technical stack */}
      {resume.technicalStack.length > 0 && (
        <div className="space-y-2.5">
          <SectionLabel>Technical stack</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {resume.technicalStack.map((t) => (
              <Badge key={t} variant="outline" className="gap-1 text-xs">
                <Layers className="size-2.5 text-zinc-400" />
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Work history */}
      {resume.historicalRoles.length > 0 && (
        <div className="space-y-3">
          <SectionLabel>Work history</SectionLabel>
          <ol className="space-y-4 border-l border-zinc-200 pl-5">
            {resume.historicalRoles.map((role, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.4rem] top-1.5 size-2 rounded-full bg-zinc-300 ring-4 ring-white" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-semibold text-zinc-900">
                    {role.title ?? "Role"}
                    {role.company && (
                      <span className="font-normal text-zinc-500">
                        {" · "}
                        {role.company}
                      </span>
                    )}
                  </p>
                  {(role.startDate || role.endDate) && (
                    <span className="text-xs text-zinc-400">
                      {role.startDate ?? "?"} – {role.endDate ?? "?"}
                    </span>
                  )}
                </div>
                {role.highlights.length > 0 && (
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-zinc-600 marker:text-zinc-300">
                    {role.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="space-y-2.5">
          <SectionLabel>Education</SectionLabel>
          <ul className="space-y-2">
            {resume.education.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <GraduationCap className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                <span className="text-zinc-700">
                  <span className="font-medium text-zinc-900">
                    {e.degree ?? "Qualification"}
                  </span>
                  {e.institution && ` · ${e.institution}`}
                  {e.year && (
                    <span className="text-zinc-400"> ({e.year})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="space-y-2.5">
          <SectionLabel>Certifications</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {resume.certifications.map((c) => (
              <Badge key={c} variant="outline" className="gap-1 text-xs">
                <Award className="size-2.5 text-zinc-400" />
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
