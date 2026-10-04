import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Ticket History · Customer" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_STYLE: Record<string, string> = {
  resolved: "bg-green-50 text-green-700",
  closed:   "bg-zinc-100 text-zinc-500",
};

export default async function TicketHistoryPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("id, subject, category, status, created_at, resolved_at, closed_at")
    .eq("requester_id", user.id)
    .in("status", ["resolved", "closed"])
    .order("created_at", { ascending: false });

  if (error) console.error("[ticket-history] fetch failed:", error.message);

  const rows = tickets ?? [];

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Support"
        title="Ticket history"
        description="All resolved and closed support requests."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-6">Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-sm text-zinc-400">
                    No closed tickets yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="pl-6 font-medium text-zinc-900">{t.subject}</TableCell>
                    <TableCell className="capitalize text-zinc-500">{t.category}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${STATUS_STYLE[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">{formatDate(t.created_at)}</TableCell>
                    <TableCell className="pr-6 text-zinc-500">
                      {t.closed_at ? formatDate(t.closed_at) : t.resolved_at ? formatDate(t.resolved_at) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
