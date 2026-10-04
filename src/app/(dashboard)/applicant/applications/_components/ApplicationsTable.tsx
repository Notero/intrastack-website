"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Clock, CheckCircle2, XCircle, Loader2, Eye, CalendarClock, FileSignature } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OfferLetterDialog } from "./OfferLetterDialog";

type AppStatus = "submitted" | "reviewing" | "interview" | "offer" | "accepted" | "rejected" | "withdrawn";
type OfferLetterStatus = "sent" | "signed" | "accepted";

type Application = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedAt: string;
  status: AppStatus;
  notes?: string;
  offerLetter?: { status: OfferLetterStatus; filePath: string } | null;
};

const STATUS_CONFIG: Record<AppStatus, { label: string; className: string; icon: React.ElementType }> = {
  submitted: { label: "Submitted",  className: "bg-zinc-100 text-zinc-600",         icon: Clock },
  reviewing: { label: "Reviewing",  className: "bg-blue-50 text-blue-600",          icon: Loader2 },
  interview: { label: "Interview",  className: "bg-violet-50 text-violet-600",      icon: CheckCircle2 },
  offer:     { label: "Offer",      className: "bg-green-50 text-green-600",        icon: CheckCircle2 },
  accepted:  { label: "Accepted",   className: "bg-emerald-50 text-emerald-600",    icon: CheckCircle2 },
  rejected:  { label: "Rejected",   className: "bg-red-50 text-red-500",            icon: XCircle },
  withdrawn: { label: "Withdrawn",  className: "bg-zinc-100 text-zinc-500",         icon: XCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [selected, setSelected] = useState<Application | null>(null);
  const [offerDialogApp, setOfferDialogApp] = useState<Application | null>(null);

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-300 py-20 text-center">
        <ClipboardList className="size-10 text-zinc-300" />
        <p className="text-sm text-zinc-500">No applications yet. Start applying from the Careers page.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {["Role", "Location", "Applied", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {applications.map((app) => {
              const { label, className, icon: Icon } = STATUS_CONFIG[app.status];
              return (
                <tr key={app.id} className="hover:bg-zinc-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-900">{app.jobTitle}</p>
                    <p className="text-xs text-zinc-500">{app.company}</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{app.location}</td>
                  <td className="px-5 py-4 text-zinc-500">{formatDate(app.appliedAt)}</td>
                  <td className="px-5 py-4">
                    <Badge className={`inline-flex items-center gap-1.5 ${className}`}>
                      <Icon className="size-3" />{label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {app.status === "interview" && (
                        <Link
                          href={`/applicant/meetings/new?application=${app.id}`}
                          className="text-brand-500 hover:text-brand-600"
                          title="Book a meeting"
                        >
                          <CalendarClock className="size-4" />
                        </Link>
                      )}
                      {app.notes && (
                        <button onClick={() => setSelected(app)} className="text-zinc-400 hover:text-zinc-700" title="View notes">
                          <Eye className="size-4" />
                        </button>
                      )}
                      {app.offerLetter?.status === "sent" && (
                        <button
                          onClick={() => setOfferDialogApp(app)}
                          className="text-brand-500 hover:text-brand-600"
                          title="Download & sign offer letter"
                        >
                          <FileSignature className="size-4" />
                        </button>
                      )}
                      {app.offerLetter?.status === "signed" && (
                        <span className="text-zinc-400" title="Signed — awaiting review">
                          <FileSignature className="size-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-white text-zinc-900">
          <h3 className="text-lg font-semibold">{selected?.jobTitle}</h3>
          <p className="text-sm text-zinc-500">{selected?.company} · {selected?.location}</p>
          <hr className="border-zinc-200" />
          <p className="text-sm text-zinc-700">{selected?.notes}</p>
        </DialogContent>
      </Dialog>

      {offerDialogApp?.offerLetter && (
        <OfferLetterDialog
          open={!!offerDialogApp}
          onOpenChange={(open) => !open && setOfferDialogApp(null)}
          applicationId={offerDialogApp.id}
          filePath={offerDialogApp.offerLetter.filePath}
        />
      )}
    </>
  );
}
