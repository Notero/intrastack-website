import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../../_components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { markInReview, resolveTicket, closeTicket, replyToTicket } from "./actions";

export const metadata = { title: "Ticket · Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      {children}
    </div>
  );
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const { id } = await params;
  await requireRole("admin");
  const supabase = createAdminSupabaseClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, subject, description, category, priority, status, created_at, requester_id")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const { data: replies = [] } = await supabase
    .from("ticket_replies")
    .select("id, body, is_admin, created_at, author_id")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  // Fetch names separately (requester_id → auth.users, not profiles FK)
  const allAuthorIds = [
    ticket.requester_id,
    ...(replies ?? []).map((r) => r.author_id),
  ].filter(Boolean);
  const uniqueIds = [...new Set(allAuthorIds)];
  const { data: profileRows = [] } = uniqueIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", uniqueIds)
    : { data: [] };
  const nameMap = Object.fromEntries((profileRows ?? []).map((p) => [p.id, p.full_name]));

  const requesterName = nameMap[ticket.requester_id] ?? "Unknown";

  const isClosed   = ticket.status === "closed";
  const isResolved = ticket.status === "resolved";
  const isInReview = ticket.status === "in_progress";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/tickets" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-3.5" /> Back to tickets
      </Link>

      <PageHeader eyebrow="Support" title={ticket.subject} />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Thread ── */}
        <div className="space-y-4 lg:col-span-2">

          {/* Original */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="grid size-7 place-items-center rounded-full bg-zinc-100">
                    <User className="size-3.5 text-zinc-500" />
                  </span>
                  <span className="font-semibold text-zinc-800">{requesterName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="size-3" />{new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-700 leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Replies */}
          {(replies ?? []).map((reply) => {
            const name = nameMap[reply.author_id] ?? (reply.is_admin ? "Admin" : requesterName);
            return (
              <Card key={reply.id} className={reply.is_admin ? "border-brand-500 bg-brand-500/5" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`grid size-7 place-items-center rounded-full ${reply.is_admin ? "bg-brand-500" : "bg-zinc-100"}`}>
                        <User className={`size-3.5 ${reply.is_admin ? "text-brand-500" : "text-zinc-500"}`} />
                      </span>
                      <span className="font-semibold text-zinc-800">
                        {name}
                        {reply.is_admin && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-500">Admin</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Clock className="size-3" />{new Date(reply.created_at).toLocaleString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-700 leading-relaxed">{reply.body}</p>
                </CardContent>
              </Card>
            );
          })}

          {/* Reply form */}
          {!isClosed && (
            <Card>
              <CardHeader><CardTitle>Reply</CardTitle></CardHeader>
              <CardContent>
                <form action={replyToTicket.bind(null, id)} className="space-y-3">
                  <Textarea name="body" rows={4} placeholder="Type your reply…" required />
                  <div className="flex justify-end">
                    <SubmitButton>Send reply</SubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <Row label="Status">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[ticket.status] ?? ""}`}>
                  {ticket.status.replace("_", " ")}
                </span>
              </Row>
              <Row label="Priority">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PRIORITY_COLOR[ticket.priority] ?? ""}`}>
                  {ticket.priority}
                </span>
              </Row>
              <Row label="Category">
                <span className="text-sm text-zinc-700 capitalize">{ticket.category?.replace("_", " ")}</span>
              </Row>
              <Row label="Requester">
                <span className="text-sm text-zinc-700">{requesterName}</span>
              </Row>
              <Row label="Opened">
                <span className="text-sm text-zinc-700">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </Row>
              <Row label="Replies">
                <span className="text-sm text-zinc-700">{(replies ?? []).length}</span>
              </Row>
            </CardContent>
          </Card>

          {/* Status actions */}
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {ticket.status === "open" && (
                <form action={markInReview.bind(null, id)}>
                  <SubmitButton className="w-full" size="sm" variant="outline">
                    Mark in review
                  </SubmitButton>
                </form>
              )}
              {(ticket.status === "open" || isInReview) && (
                <form action={resolveTicket.bind(null, id)}>
                  <SubmitButton className="w-full" size="sm" variant="outline">
                    Mark resolved
                  </SubmitButton>
                </form>
              )}
              {!isClosed && (
                <form action={closeTicket.bind(null, id)}>
                  <SubmitButton className="w-full" size="sm" variant="destructive">
                    Close ticket
                  </SubmitButton>
                </form>
              )}
              {isClosed && (
                <p className="text-center text-xs text-zinc-400">Ticket is closed.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
