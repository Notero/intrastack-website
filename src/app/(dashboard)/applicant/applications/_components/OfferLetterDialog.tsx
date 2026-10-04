"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  getOfferLetterDownloadUrlAction,
  uploadSignedOfferAction,
  type UploadSignedOfferState,
} from "../actions";

const initialState: UploadSignedOfferState = {};

export function OfferLetterDialog({
  open,
  onOpenChange,
  applicationId,
  filePath,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  filePath: string;
}) {
  const [downloadPending, setDownloadPending] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(uploadSignedOfferAction, initialState);

  useEffect(() => {
    if (state.success && !state.error) {
      formRef.current?.reset();
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  async function handleDownload() {
    setDownloadPending(true);
    setDownloadError(null);
    const result = await getOfferLetterDownloadUrlAction(filePath);
    setDownloadPending(false);
    if (result.error || !result.url) {
      setDownloadError(result.error ?? "Something went wrong.");
      return;
    }
    window.open(result.url, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle>Offer letter</DialogTitle>
        </DialogHeader>

        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownload}
            disabled={downloadPending}
          >
            {downloadPending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            <span className="ml-1.5">Download offer letter</span>
          </Button>
          {downloadError && <p className="mt-1 text-xs text-destructive">{downloadError}</p>}
        </div>

        <form ref={formRef} action={formAction} className="mt-2 flex flex-col gap-3">
          <input type="hidden" name="applicationId" value={applicationId} />
          <p className="text-sm text-zinc-600">Signed it? Upload it back here.</p>
          <Input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            required
            disabled={pending}
            className="cursor-pointer file:font-medium file:text-primary file:hover:cursor-pointer"
          />
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            <span className="ml-1.5">Upload signed offer</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
