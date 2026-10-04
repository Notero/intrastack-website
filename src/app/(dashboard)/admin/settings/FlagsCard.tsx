"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { updateFlags } from "./actions";

const FLAG_DEFS: Array<{ id: string; label: string; description: string }> = [
  { id: "mfa",     label: "Require MFA for all admins",      description: "Enforced at login" },
  { id: "archive", label: "Auto-archive closed requisitions", description: "Closed 30 days after fill" },
  { id: "careers", label: "Public careers board sync",        description: "Mirror job posts to the public site" },
  { id: "digest",  label: "Weekly digest emails",             description: "Sent Mondays at 08:00" },
];

export function FlagsCard({ initialFlags }: { initialFlags: Record<string, boolean> }) {
  const [flags, setFlags] = useState<Record<string, boolean>>(initialFlags);
  const [, startTransition] = useTransition();

  function toggle(id: string, value: boolean) {
    const next = { ...flags, [id]: value };
    setFlags(next);
    startTransition(() => { updateFlags(next); });
  }

  return (
    <Card>
      <CardHeader><CardTitle>Feature flags</CardTitle></CardHeader>
      <CardContent className="divide-y divide-zinc-200">
        {FLAG_DEFS.map((flag) => (
          <div key={flag.id} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div>
              <div className="text-sm font-semibold text-zinc-900">{flag.label}</div>
              <div className="text-xs text-zinc-500">{flag.description}</div>
            </div>
            <Switch
              checked={flags[flag.id] ?? false}
              onCheckedChange={(v) => toggle(flag.id, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
