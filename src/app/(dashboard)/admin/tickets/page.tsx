import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "Tickets · Admin" };

const STATUS_COLOR: Record<string, string> = {
  open: "bg-brand-500/10 text-brand-600",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-zinc-100 text-zinc-500",
};

const PRIORITY_COLOR: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-500",
  normal: "bg-sky-100 text-sky-700",
  high: "bg-brand-500/10 text-brand-600",
  urgent: "bg-red-100 text-red-700",
};

export default async function AdminTicketsPage() {
  await requireRole("admin");

  const supabase = createAdminSupabaseClient();

  const { data: tickets = [] } = await supabase
    .from("tickets")
    .select("id, subject, category, priority, status, created_at, requester_id")
    .order("created_at", { ascending: true });

  // Fetch requester names separately (tickets.requester_id → auth.users, not profiles FK)
  const requesterIds = [...new Set((tickets ?? []).map((t) => t.requester_id).filter(Boolean))];
  const { data: profileRows = [] } = requesterIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", requesterIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profileRows ?? []).map((p) => [p.id, p.full_name]));

  const rows = (tickets ?? []).map((t) => ({
    ...t,
    requester_label: profileMap[t.requester_id] ?? "Unknown",
  }));

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Support"
        title="Tickets"
        description="All support requests ordered oldest first — address the longest-waiting first."
      />

      {/* Status filter strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
          <span
            key={s}
            className="cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium capitalize text-zinc-600 hover:border-brand-500 hover:text-brand-500 transition-colors"
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </span>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Subject</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-zinc-900">
                      <MessageSquare className="size-3.5 shrink-0 text-zinc-400" />
                      {t.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{t.requester_label}</TableCell>
                  <TableCell className="text-sm text-zinc-600 capitalize">{t.category?.replace("_", " ")}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PRIORITY_COLOR[t.priority] ?? ""}`}>
                      {t.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[t.status] ?? ""}`}>
                      {t.status?.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/tickets/${t.id}`}>Open</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-zinc-500">
                    No tickets yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
