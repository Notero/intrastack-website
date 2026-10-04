import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../../_components/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { replyToTicketAsCustomer } from "./actions";

export const metadata = { title: "Ticket · Customer" };

interface PageProps {
  params: Promise<{ slug: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  open:        "bg-brand-500/10 text-brand-600",
  in_progress: "bg-blue-100 text-blue-700",
  resolved:    "bg-green-100 text-green-700",
  closed:      "bg-zinc-100 text-zinc-600",
};

const PRIORITY_COLOR: Record<string, string> = {
  low:    "bg-zinc-100 text-zinc-500",
  normal: "bg-sky-100 text-sky-700",
  high:   "bg-brand-500/10 text-brand-600",
  urgent: "bg-red-100 text-red-700",
};

export default async function TicketDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, subject, description, category, priority, status, created_at")
    .eq("id", slug)
    .eq("requester_id", user.id)
    .single();

  if (!ticket) notFound();

  const { data: replies = [] } = await supabase
    .from("ticket_replies")
    .select("id, body, is_admin, created_at")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  const isClosed = ticket.status === "closed" || ticket.status === "resolved";

  // Build the full message thread: original + replies
  const messages = [
    { id: "original", body: ticket.description, is_admin: false, created_at: ticket.created_at, isOriginal: true },
    ...(replies ?? []).map((r) => ({ ...r, isOriginal: false })),
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 6rem)" }}>

      {/* Header */}
      <div className="shrink-0 space-y-3 pb-4">
        <Link href="/customer/tickets" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
          <ArrowLeft className="size-3.5" /> Back to tickets
        </Link>
        <PageHeader eyebrow="Support" title={ticket.subject} />

        {/* Status strip */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-xs">
          <span className={`rounded-full px-2.5 py-0.5 font-semibold capitalize ${STATUS_COLOR[ticket.status] ?? ""}`}>
            {ticket.status.replace("_", " ")}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 font-semibold capitalize ${PRIORITY_COLOR[ticket.priority] ?? ""}`}>
            {ticket.priority}
          </span>
          <span className="capitalize text-zinc-500">{ticket.category?.replace("_", " ")}</span>
          <span className="ml-auto text-zinc-400">
            Opened {new Date(ticket.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
        {messages.map((msg) => {
          const isOwn = !msg.is_admin;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] space-y-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {msg.is_admin && (
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-brand-500">
                    Support
                  </span>
                )}
                {(msg as { isOriginal?: boolean }).isOriginal && (
                  <span className="mr-1 text-[10px] text-zinc-400">Original message</span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isOwn
                      ? "rounded-br-sm bg-zinc-800 text-white"
                      : "rounded-bl-sm border border-brand-500 bg-brand-500/5 text-zinc-800"
                  }`}
                >
                  {msg.body}
                </div>
                <span className="px-1 text-[10px] text-zinc-400">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}

        {(replies ?? []).length === 0 && (
          <p className="text-center text-xs text-zinc-400 py-4">
            No replies yet — support will respond soon.
          </p>
        )}
      </div>

      {/* Reply input pinned to bottom */}
      <div className="shrink-0 border-t border-zinc-100 pt-4">
        {!isClosed ? (
          <form action={replyToTicketAsCustomer.bind(null, ticket.id)} className="flex gap-3 items-end">
            <Textarea
              name="reply"
              rows={2}
              placeholder="Reply to support…"
              required
              className="flex-1 resize-none"
            />
            <SubmitButton className="shrink-0">Send</SubmitButton>
          </form>
        ) : (
          <p className="text-center text-xs text-zinc-400 py-2">
            This ticket is {ticket.status} — no further replies.
          </p>
        )}
      </div>
    </div>
  );
}
