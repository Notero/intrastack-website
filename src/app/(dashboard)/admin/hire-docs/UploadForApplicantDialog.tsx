"use client";

import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  uploadOnboardingDocument,
  type UploadState,
} from "./actions";

const initialState: UploadState = {};

export function UploadForApplicantDialog({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(uploadOnboardingDocument, initialState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="secondary">
          <Upload className="mr-1.5 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload onboarding document</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="applicationId" value={applicationId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="label">Document label</Label>
            <Input id="label" name="label" type="text" placeholder="Offer Letter" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file">File (PDF or DOCX)</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" required />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" disabled={pending} className="mt-1 w-fit">
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}