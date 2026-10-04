"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSignedDownloadUrl } from "./actions";

export function DownloadButton({ filePath }: { filePath: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setPending(true);
    setError(null);
    const result = await getSignedDownloadUrl(filePath);
    setPending(false);

    if (result.error || !result.url) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    window.open(result.url, "_blank");
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" size="sm" variant="secondary" onClick={handleDownload} disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        <span className="ml-1.5">Download</span>
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}