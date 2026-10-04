"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateApplicationStatusAsAdmin } from "./actions";
import type { ApplicationRow } from "./page";
import type { Enums } from "@/lib/supabase/database.types";

type Status = Enums<"application_status">;

const STATUS_META: Record<Status, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-zinc-100 text-zinc-600" },
  reviewing: { label: "Reviewing", className: "bg-blue-50 text-blue-600" },
  interview: { label: "Interview", className: "bg-violet-50 text-violet-600" },
  offer:     { label: "Offer",     className: "bg-green-50 text-green-600" },
  accepted:  { label: "Accepted",  className: "bg-emerald-50 text-emerald-600" },
  rejected:  { label: "Rejected",  className: "bg-red-50 text-red-500" },
  withdrawn: { label: "Withdrawn", className: "bg-zinc-100 text-zinc-500" },
};

const STATUSES = Object.keys(STATUS_META) as Status[];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusSelect({ row }: { row: ApplicationRow }) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  function set(next: Status) {
    if (next === row.status || pending) return;
    setFailed(false);
    start(async () => {
      try {
        await updateApplicationStatusAsAdmin(row.id, row.jobPostId, next);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={row.status}
        onChange={(e) => set(e.target.value as Status)}
        disabled={pending}
        aria-label={`Status for ${row.applicantName}`}
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 outline-none focus:border-brand-500 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-3.5 animate-spin text-zinc-400" />}
      {failed && <span className="text-[10px] text-red-500">Failed</span>}
    </div>
  );
}

export function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [job, setJob] = useState<string>("all");
  const [customer, setCustomer] = useState<string>("all");

  const jobs = useMemo(
    () => [...new Set(applications.map((a) => a.jobTitle))].sort(),
    [applications],
  );
  const customers = useMemo(
    () => [...new Set(applications.map((a) => a.customerName))].sort(),
    [applications],
  );

  const filtered = applications.filter((a) => {
    if (status !== "all" && a.status !== status) return false;
    if (job !== "all" && a.jobTitle !== job) return false;
    if (customer !== "all" && a.customerName !== customer) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.applicantName.toLowerCase().includes(q) ||
      a.jobTitle.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q)
    );
  });

  const selectClass =
    "rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-brand-500";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search applicant, job, customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_META[s].label}</option>
          ))}
        </select>
        <select value={job} onChange={(e) => setJob(e.target.value)} className={selectClass} aria-label="Filter by job post">
          <option value="all">All job posts</option>
          {jobs.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className={selectClass} aria-label="Filter by customer">
          <option value="all">All customers</option>
          {customers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span className="ml-auto text-xs text-zinc-400">
          {filtered.length} of {applications.length} applications
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Applicant</TableHead>
              <TableHead>Job title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Set status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-sm text-zinc-500">
                  No applications match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="pl-6 font-medium text-zinc-900">{a.applicantName}</TableCell>
                  <TableCell className="text-zinc-600">{a.jobTitle}</TableCell>
                  <TableCell className="text-zinc-600">{a.customerName}</TableCell>
                  <TableCell className="text-zinc-500">{formatDate(a.appliedAt)}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_META[a.status].className}>{STATUS_META[a.status].label}</Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <StatusSelect row={a} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
