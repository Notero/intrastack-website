"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EMPLOYMENT_LABELS, type EmploymentType } from "@/lib/content/jobs";
import { cn } from "@/lib/utils";

export interface FilterState {
  workStyles: string[];
  skills: string[];
  seniority: string[];
  employmentTypes: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  workStyles: [],
  skills: [],
  seniority: [],
  employmentTypes: [],
};

const WORK_STYLES = ["Remote", "On-site"];
const SENIORITY_OPTIONS = ["Junior", "Mid", "Senior", "Staff", "Lead", "Principal"];
const EMPLOYMENT_TYPE_OPTIONS = Object.entries(EMPLOYMENT_LABELS) as [EmploymentType, string][];

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between border-b border-zinc-100 py-3 text-left text-sm font-semibold text-zinc-700 transition-colors hover:text-brand-500"
    >
      {label}
      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  );
}

function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-95",
        selected
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
      )}
    >
      {label}
    </button>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  availableSkills: string[];
}

export function JobFilterDrawer({ open, onClose, filters, onApply, availableSkills }: Props) {
  const [local, setLocal] = useState<FilterState>(filters);
  const [sections, setSections] = useState({
    workStyle: true,
    employmentType: false,
    seniority: false,
    skills: false,
  });

  function toggleSection(key: keyof typeof sections) {
    setSections((s) => ({ ...s, [key]: !s[key] }));
  }

  function toggleItem(field: keyof FilterState, value: string) {
    const arr = local[field];
    setLocal((prev) => ({
      ...prev,
      [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    }));
  }

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setLocal(filters);
    } else {
      onClose();
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex w-[400px] flex-col p-0">
        <SheetHeader className="flex-row items-center justify-between border-b border-zinc-100 px-6 py-4">
          <SheetTitle className="text-base font-bold text-zinc-900">Filter Jobs</SheetTitle>
          <button
            onClick={() => setLocal(DEFAULT_FILTERS)}
            className="text-xs font-medium text-zinc-400 underline hover:text-brand-500"
          >
            Reset all
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <SectionHeader label="Work Style" open={sections.workStyle} onToggle={() => toggleSection("workStyle")} />
          {sections.workStyle && (
            <div className="flex flex-wrap gap-2 py-4">
              {WORK_STYLES.map((w) => (
                <ToggleChip key={w} label={w} selected={local.workStyles.includes(w)} onToggle={() => toggleItem("workStyles", w)} />
              ))}
            </div>
          )}

          <SectionHeader label="Employment Type" open={sections.employmentType} onToggle={() => toggleSection("employmentType")} />
          {sections.employmentType && (
            <div className="flex flex-wrap gap-2 py-4">
              {EMPLOYMENT_TYPE_OPTIONS.map(([value, label]) => (
                <ToggleChip key={value} label={label} selected={local.employmentTypes.includes(value)} onToggle={() => toggleItem("employmentTypes", value)} />
              ))}
            </div>
          )}

          <SectionHeader label="Seniority" open={sections.seniority} onToggle={() => toggleSection("seniority")} />
          {sections.seniority && (
            <div className="flex flex-wrap gap-2 py-4">
              {SENIORITY_OPTIONS.map((s) => (
                <ToggleChip key={s} label={s} selected={local.seniority.includes(s)} onToggle={() => toggleItem("seniority", s)} />
              ))}
            </div>
          )}

          <SectionHeader label="Skills" open={sections.skills} onToggle={() => toggleSection("skills")} />
          {sections.skills && (
            <div className="flex flex-wrap gap-2 py-4">
              {availableSkills.map((s) => (
                <ToggleChip key={s} label={s} selected={local.skills.includes(s)} onToggle={() => toggleItem("skills", s)} />
              ))}
            </div>
          )}

          <div className="h-4" />
        </div>

        <div className="flex gap-3 border-t border-zinc-100 px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-brand-500 hover:bg-brand-600" onClick={() => onApply(local)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
