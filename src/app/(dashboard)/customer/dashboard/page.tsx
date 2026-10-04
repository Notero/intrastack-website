import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Ticket, Briefcase, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard · Customer" };

export default async function CustomerDashboardPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: openTickets },
    { count: resolvedThisMonth },
    { count: activeListings },
    { count: pendingReview },
    { data: recentTickets },
  ] = await Promise.all([
    supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("requester_id", user.id)
      .in("status", ["open", "in_progress"]),

    supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("requester_id", user.id)
      .in("status", ["resolved", "closed"])
      .gte("resolved_at", startOfMonth.toISOString()),

    supabase
      .from("job_posts")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user.id)
      .eq("published", true),

    supabase
      .from("job_posts")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user.id)
      .eq("published", false),

    supabase
      .from("tickets")
      .select("id, subject, status, created_at, category")
      .eq("requester_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const STATUS_STYLE: Record<string, string> = {
    open:        "bg-zinc-100 text-zinc-600",
    in_progress: "bg-blue-50 text-blue-600",
    resolved:    "bg-green-50 text-green-700",
    closed:      "bg-zinc-100 text-zinc-400",
  };

  return (
    <div className="w-full space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`${greeting}, ${user.email?.split("@")[0] ?? "Customer"}`}
        description="Here's a snapshot of your recruiting activity."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Ticket}      label="Open Tickets"    value={openTickets ?? 0}        sub="awaiting response" color="cyan" />
        <StatCard icon={CheckCircle} label="Resolved"        value={resolvedThisMonth ?? 0}  sub="this month"        color="green" />
        <StatCard icon={Briefcase}   label="Active Listings" value={activeListings ?? 0}     sub="live jobs"         color="blue" />
        <StatCard icon={Clock}       label="Pending Review"  value={pendingReview ?? 0}       sub="awaiting approval" color="amber" />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="/customer/create_ticket">Create a ticket</Link></Button>
          <Button asChild variant="outline"><Link href="/customer/list_job">List a job</Link></Button>
          <Button asChild variant="outline"><Link href="/customer/tickets">View tickets</Link></Button>
          <Button asChild variant="outline"><Link href="/customer/my_job_listings">My listings</Link></Button>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-800">Recent tickets</h2>
          <Link href="/customer/tickets" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        {!recentTickets || recentTickets.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-400">
            No tickets yet.{" "}
            <Link href="/customer/create_ticket" className="text-primary hover:underline">Create one</Link>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {recentTickets.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link href={`/customer/ticket/${t.id}`} className="text-sm font-medium text-zinc-900 hover:underline">
                    {t.subject}
                  </Link>
                  <p className="text-xs capitalize text-zinc-400">{t.category}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>
                  {t.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number; sub: string;
  color: "cyan" | "green" | "blue" | "amber";
}) {
  const colors = { cyan: "border-brand-400/30 bg-brand-500/5 text-brand-600", green: "border-green-200 bg-green-50 text-green-900", blue: "border-blue-200 bg-blue-50 text-blue-900", amber: "border-brand-400/30 bg-brand-500/5 text-brand-600" };
  const iconColors = { cyan: "text-brand-400", green: "text-green-400", blue: "text-blue-400", amber: "text-brand-400" };
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</span>
        <Icon className={`size-4 ${iconColors[color]}`} />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs opacity-60">{sub}</div>
    </div>
  );
}
