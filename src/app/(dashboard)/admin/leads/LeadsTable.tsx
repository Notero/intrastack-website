"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { LeadRow } from "./page";

const SOURCE_LABEL: Record<string, string> = {
  contact_form: "Contact Form",
  whitepaper_download: "Whitepaper",
  newsletter_signup: "Newsletter",
  chatbot: "Chatbot",
};

const SOURCE_STYLE: Record<string, string> = {
  contact_form: "bg-brand-500/5 text-brand-500",
  whitepaper_download: "bg-brand-500/5 text-brand-500",
  newsletter_signup: "bg-green-50 text-green-700",
  chatbot: "bg-indigo-50 text-indigo-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ALL_SOURCES = ["all", "contact_form", "whitepaper_download", "newsletter_signup", "chatbot"] as const;

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<string>("all");

  const filtered = leads.filter((l) => {
    const matchesSource = source === "all" || l.source === source;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.email.toLowerCase().includes(q) ||
      (l.name ?? "").toLowerCase().includes(q) ||
      (l.resource_title ?? "").toLowerCase().includes(q) ||
      (l.notes ?? "").toLowerCase().includes(q) ||
      (l.intent ?? "").toLowerCase().includes(q);
    return matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search email, name, resource…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {ALL_SOURCES.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
                source === s
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {s === "all" ? "All sources" : SOURCE_LABEL[s]}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-400 ml-auto">
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Name / Resource</TableHead>
              <TableHead>Intent / Message</TableHead>
              <TableHead className="pr-6">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-sm text-zinc-400">
                  No leads match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="pl-6 font-medium text-zinc-900">{l.email}</TableCell>
                  <TableCell>
                    <Badge className={`capitalize text-[11px] ${SOURCE_STYLE[l.source] ?? "bg-zinc-100 text-zinc-500"}`}>
                      {SOURCE_LABEL[l.source] ?? l.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-700 max-w-[200px]">
                    {l.name ? (
                      <div className="font-medium">{l.name}</div>
                    ) : null}
                    {l.resource_title ? (
                      <div className="text-zinc-500 text-xs truncate">{l.resource_title}</div>
                    ) : null}
                    {!l.name && !l.resource_title && <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600 max-w-[260px]">
                    <span className="line-clamp-2">
                      {l.intent ?? l.notes ?? <span className="text-zinc-400">—</span>}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-sm text-zinc-500 whitespace-nowrap">
                    {formatDate(l.created_at)}
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
