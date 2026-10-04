import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MessageSquare } from "lucide-react";

export const metadata = { title: "Tickets · Customer" };

const STATUS_COLOR: Record<string, string> = {
  open:        "bg-brand-500/10 text-brand-600",
  in_progress: "bg-blue-100 text-blue-700",
  resolved:    "bg-green-100 text-green-700",
  closed:      "bg-zinc-100 text-zinc-500",
};

const PRIORITY_COLOR: Record<string, string> = {
  low:    "bg-zinc-100 text-zinc-500",
  normal: "bg-sky-100 text-sky-700",
  high:   "bg-brand-500/10 text-brand-600",
  urgent: "bg-red-100 text-red-700",
};

export default async function TicketsPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: tickets = [] } = await supabase
    .from("tickets")
    .select("id, subject, category, priority, status, created_at, updated_at")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Support"
        title="Tickets"
        description="Track and manage your open support requests."
        actions={
          <Button asChild>
            <Link href="/customer/create_ticket">
              <PlusCircle className="mr-1.5 h-4 w-4" />New ticket
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tickets ?? []).map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-zinc-900">
                      <MessageSquare className="size-3.5 shrink-0 text-zinc-400" />
                      {t.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500 capitalize">
                    {t.category?.replace("_", " ")}
                  </TableCell>
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
                  <TableCell className="pr-6 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/customer/ticket/${t.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(tickets ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center text-sm text-zinc-400">
                    No tickets yet.{" "}
                    <Link href="/customer/create_ticket" className="text-brand-500 underline">
                      Create one
                    </Link>.
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
