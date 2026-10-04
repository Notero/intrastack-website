"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadOnboardingDocument, type UploadState } from "./actions";

const initialState: UploadState = {};

export function UploadDocumentForm({ jobId, applicationId }: { jobId: string; applicationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    uploadOnboardingDocument,
    initialState
  );

  // Automatically reset the form inputs if the upload succeeded
  // (Assuming your action returns success: true or clear fields on success)
  useEffect(() => {
    if (state.success && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  const errorId = "upload-form-error";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-4 flex flex-col gap-4"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="applicationId" value={applicationId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label">Document Label</Label>
        <Input
          id="label"
          name="label"
          type="text"
          placeholder="e.g., Offer Letter, NDA"
          required
          disabled={pending}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? errorId : undefined}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file">File (PDF, DOC, DOCX)</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          disabled={pending}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? errorId : undefined}
          className="cursor-pointer file:font-medium file:text-primary file:hover:cursor-pointer"
        />
      </div>

      {state.error && (
        <p id={errorId} className="text-sm font-medium text-destructive animate-in fade-in-50 duration-200">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm font-medium text-emerald-600 animate-in fade-in-50 duration-200">
          Document uploaded successfully!
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit min-w-[100px]">
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </form>
  );
}
