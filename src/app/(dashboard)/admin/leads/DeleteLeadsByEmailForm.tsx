"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteLeadsAction } from "./actions";

export function DeleteLeadsByEmailForm() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Permanently delete every lead submitted with ${email}? This cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteLeadsAction(email);
      if (result.error) setMessage({ text: result.error, error: true });
      else {
        setMessage({ text: result.success ?? "Deleted." });
        setEmail("");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div>
        <label htmlFor="delete-lead-email" className="mb-1 block text-[11px] font-medium text-zinc-500">
          Delete leads by email (GDPR)
        </label>
        <Input
          id="delete-lead-email"
          type="email"
          required
          placeholder="person@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 w-56"
        />
      </div>
      <Button type="submit" variant="destructive" disabled={pending}>
        <Trash2 className="mr-1.5 h-4 w-4" />
        {pending ? "Deleting…" : "Delete"}
      </Button>
      {message && (
        <p className={`text-xs ${message.error ? "text-red-600" : "text-green-700"}`}>{message.text}</p>
      )}
    </form>
  );
}
