"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  uploadSignedOnboardingDocumentAction,
  type UploadSignedDocumentState,
} from "./actions";

const initialState: UploadSignedDocumentState = {};

export function UploadSignedDocumentForm({ documentId }: { documentId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    uploadSignedOnboardingDocumentAction,
    initialState
  );

  useEffect(() => {
    if (state.success && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-2 flex items-center gap-2">
      <input type="hidden" name="documentId" value={documentId} />
      <Input
        type="file"
        name="file"
        accept=".pdf,.doc,.docx"
        required
        disabled={pending}
        className="h-8 w-56 cursor-pointer text-xs file:font-medium file:text-primary file:hover:cursor-pointer"
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        Upload signed copy
      </Button>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
