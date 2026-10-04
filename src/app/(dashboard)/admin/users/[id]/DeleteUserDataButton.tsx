"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserDataAction } from "./actions";

export function DeleteUserDataButton({ userId, email }: { userId: string; email: string | null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    const confirmed = confirm(
      `Permanently delete all data for ${email ?? userId}? This deletes their account, applications, resumes, documents, and every other row tied to them. This cannot be undone.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteUserDataAction(userId);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="destructive" onClick={onClick} disabled={pending}>
        <Trash2 className="mr-1.5 h-4 w-4" />
        {pending ? "Deleting…" : "Delete data (GDPR)"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
