"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, FileIcon, Eye, FolderOpen, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  filename: string;
  fileType: "pdf" | "doc" | "docx";
  signedUrl: string;
}

const TYPE_LABEL: Record<Props["fileType"], string> = {
  pdf:  "PDF",
  doc:  "Word",
  docx: "Word",
};

export function ResumeCard({ filename, fileType, signedUrl }: Props) {
  const [open, setOpen]         = useState(false);
  const [blobUrl, setBlobUrl]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const blobRef = useRef<string | null>(null);

  // Fetch the file into a blob URL when the modal opens.
  // Blob URLs bypass Supabase's X-Frame-Options header so the iframe renders.
  useEffect(() => {
    if (!open || blobUrl) return;

    let cancelled = false;

    const loadPreview = () => {
      setLoading(true);
      setFetchError(false);

      fetch(signedUrl)
        .then((res) => {
          if (!res.ok) throw new Error("fetch failed");
          return res.blob();
        })
        .then((blob) => {
          if (cancelled) return;
          const url = URL.createObjectURL(blob);
          blobRef.current = url;
          setBlobUrl(url);
        })
        .catch(() => {
          if (!cancelled) setFetchError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    loadPreview();

    return () => { cancelled = true; };
  }, [open, signedUrl, blobUrl]);

  // Revoke the blob URL when the component unmounts to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  function handleOpenDocument() {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.click();
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        {/* Icon */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          {fileType === "pdf"
            ? <FileText className="size-6 text-red-500" />
            : <FileIcon className="size-6 text-blue-500" />
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate font-semibold text-zinc-900">{filename}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{TYPE_LABEL[fileType]}</Badge>
            <span className="text-xs text-zinc-400">Current resume</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
            <Eye className="size-3.5" />
            Preview
          </Button>
        </div>
      </div>

      {/* Preview modal */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {fileType === "pdf"
                ? <FileText className="size-4 shrink-0 text-red-500" />
                : <FileIcon className="size-4 shrink-0 text-blue-500" />
              }
              <span className="text-sm font-semibold text-zinc-900">Preview</span>
              <span className="hidden truncate text-xs text-zinc-400 sm:block">{filename}</span>
              <Badge variant="secondary" className="shrink-0 text-xs">{TYPE_LABEL[fileType]}</Badge>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={!blobUrl}
                onClick={handleOpenDocument}
              >
                <FolderOpen className="size-3.5" />
                Open Document
              </Button>
              <button
                onClick={handleClose}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 items-center justify-center overflow-hidden bg-zinc-100">
            {loading && (
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <Loader2 className="size-8 animate-spin" />
                <p className="text-sm">Loading preview…</p>
              </div>
            )}

            {fetchError && (
              <div className="flex flex-col items-center gap-3 text-center text-zinc-500">
                <FileText className="size-12 text-zinc-300" />
                <p className="text-sm font-medium">Could not load preview.</p>
                <p className="text-xs text-zinc-400">The link may have expired. Refresh the page and try again.</p>
              </div>
            )}

            {!loading && !fetchError && blobUrl && fileType === "pdf" && (
              <iframe
                src={blobUrl}
                title="Preview"
                className="h-full w-full border-0"
              />
            )}

            {!loading && !fetchError && blobUrl && fileType !== "pdf" && (
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <FileIcon className="size-16 text-blue-300" />
                <p className="text-sm font-medium text-zinc-700">
                  Word documents can&apos;t be previewed in the browser.
                </p>
                <p className="text-xs text-zinc-500">Use Open Document to view it in Word or Google Docs.</p>
                <Button className="mt-2 gap-2" onClick={handleOpenDocument}>
                  <FolderOpen className="size-4" />
                  Open Document
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
