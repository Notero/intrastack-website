"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AuditLogRow } from "./page";

type Row = AuditLogRow & { actor_name: string | null };

const ACTION_STYLE: Record<string, string> = {
  insert: "bg-green-50 text-green-700",
  update: "bg-brand-500/5 text-brand-500",
  delete: "bg-red-50 text-red-700",
  login_success: "bg-green-50 text-green-700",
  login_failure: "bg-red-50 text-red-700",
  password_reset_requested: "bg-indigo-50 text-indigo-700",
  password_reset_completed: "bg-indigo-50 text-indigo-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ALL_TABLES = [
  "all", "profiles", "applications", "job_posts",
  "onboarding_documents", "tickets", "ticket_replies", "auth",
] as const;

export function AuditLogTable({ rows }: { rows: Row[] }) {
  const [search, setSearch] = useState("");
  const [table, setTable] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = rows.filter((r) => {
    const matchesTable =
      table === "all" ||
      (table === "auth" ? r.table_name === null : r.table_name === table);

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (r.actor_name ?? "").toLowerCase().includes(q) ||
      r.action.toLowerCase().includes(q) ||
      (r.table_name ?? "").toLowerCase().includes(q) ||
      (r.row_id ?? "").toLowerCase().includes(q);

    const created = new Date(r.created_at).getTime();
    const matchesFrom = !dateFrom || created >= new Date(dateFrom).getTime();
    const matchesTo = !dateTo || created <= new Date(dateTo).getTime() + 86400000; // include full end day

    return matchesTable && matchesSearch && matchesFrom && matchesTo;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search actor, action, table, row id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-auto"
        />
        <span className="text-xs text-zinc-400">to</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-auto"
        />
        <span className="text-xs text-zinc-400 ml-auto">
          {filtered.length} of {rows.length} events
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ALL_TABLES.map((t) => (
          <button
            key={t}
            onClick={() => setTable(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
              table === t
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
            }`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Row</TableHead>
              <TableHead className="pr-6">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-sm text-zinc-400">
                  No events match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6">
                    <div className="font-medium text-zinc-900">{r.actor_name ?? "System / Unknown"}</div>
                    {r.actor_role && <div className="text-xs text-zinc-400">{r.actor_role}</div>}
                    {r.ip_address && <div className="text-xs text-zinc-400">{r.ip_address}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[11px] ${ACTION_STYLE[r.action] ?? "bg-zinc-100 text-zinc-500"}`}>
                      {r.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600">
                    {r.table_name ?? <span className="text-zinc-400">auth</span>}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 font-mono max-w-[140px] truncate">
                    {r.row_id ?? "—"}
                  </TableCell>
                  <TableCell className="pr-6 text-sm text-zinc-500 whitespace-nowrap">
                    {formatDate(r.created_at)}
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