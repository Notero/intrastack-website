import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Users, Newspaper, Briefcase, Mail, TrendingUp, UserCheck, Clock, ShieldCheck } from "lucide-react";

export const metadata = { title: "Dashboard · Admin" };

async function fetchStats() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: totalNews },
    { count: publishedNews },
    { count: totalJobs },
    { count: publishedJobs },
    { count: totalLeads },
    { count: newLeads },
    { data: recentUsers },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("news_items").select("*", { count: "exact", head: true }),
    supabase.from("news_items").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("job_posts").select("*", { count: "exact", head: true }),
    supabase.from("job_posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("contact_form_leads").select("*", { count: "exact", head: true }),
    supabase.from("contact_form_leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("profiles").select("id, email, full_name, role, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_form_leads").select("id, full_name, work_email, company, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    activeUsers: activeUsers ?? 0,
    totalNews: totalNews ?? 0,
    publishedNews: publishedNews ?? 0,
    totalJobs: totalJobs ?? 0,
    publishedJobs: publishedJobs ?? 0,
    totalLeads: totalLeads ?? 0,
    newLeads: newLeads ?? 0,
    recentUsers: recentUsers ?? [],
    recentLeads: recentLeads ?? [],
  };
}

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  customer: "bg-blue-100 text-blue-700",
  applicant: "bg-zinc-100 text-zinc-600",
};

const LEAD_STATUS_COLOR: Record<string, string> = {
  new: "bg-brand-500/10 text-brand-600",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-green-100 text-green-700",
  won: "bg-emerald-100 text-emerald-700",
  archived: "bg-zinc-100 text-zinc-500",
};

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  const stats = await fetchStats();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="w-full space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`${greeting}, ${user.email?.split("@")[0] ?? "Admin"}`}
        description="Here's what's happening across the platform."
      />

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Users */}
        <div className="col-span-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Users</span>
            <Users className="size-4 text-zinc-300" />
          </div>
          <div className="mt-3 text-3xl font-bold text-zinc-900">{stats.totalUsers}</div>
          <div className="mt-1 text-xs text-zinc-500">{stats.activeUsers} active</div>
        </div>

        {/* News */}
        <div className="col-span-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">News</span>
            <Newspaper className="size-4 text-zinc-300" />
          </div>
          <div className="mt-3 text-3xl font-bold text-zinc-900">{stats.totalNews}</div>
          <div className="mt-1 text-xs text-zinc-500">{stats.publishedNews} published</div>
        </div>

        {/* Jobs */}
        <div className="col-span-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Jobs</span>
            <Briefcase className="size-4 text-zinc-300" />
          </div>
          <div className="mt-3 text-3xl font-bold text-zinc-900">{stats.totalJobs}</div>
          <div className="mt-1 text-xs text-zinc-500">{stats.publishedJobs} live</div>
        </div>

        {/* Leads */}
        <div className="col-span-1 rounded-2xl border border-brand-500 bg-brand-500/5 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">Leads</span>
            <Mail className="size-4 text-brand-500" />
          </div>
          <div className="mt-3 text-3xl font-bold text-brand-500">{stats.totalLeads}</div>
          <div className="mt-1 text-xs text-brand-500">{stats.newLeads} new</div>
        </div>

        {/* Active rate — wide */}
        <div className="col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">User activity rate</span>
            <TrendingUp className="size-4 text-zinc-300" />
          </div>
          <div className="mt-3 text-3xl font-bold text-zinc-900">
            {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-zinc-500">{stats.activeUsers} of {stats.totalUsers} users are active</div>
        </div>

        {/* Content health */}
        <div className="col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Content publish rate</span>
            <ShieldCheck className="size-4 text-zinc-300" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-zinc-900">
                {stats.totalNews > 0 ? Math.round((stats.publishedNews / stats.totalNews) * 100) : 0}%
              </div>
              <div className="text-xs text-zinc-500">news published</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-blue-400" style={{ width: `${stats.totalNews > 0 ? (stats.publishedNews / stats.totalNews) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">
                {stats.totalJobs > 0 ? Math.round((stats.publishedJobs / stats.totalJobs) * 100) : 0}%
              </div>
              <div className="text-xs text-zinc-500">jobs live</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${stats.totalJobs > 0 ? (stats.publishedJobs / stats.totalJobs) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Recent rows ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent users */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <UserCheck className="size-4 text-zinc-400" /> Recent signups
            </div>
            <Link href="/admin/users" className="text-xs text-brand-500 hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-zinc-100">
            {stats.recentUsers.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-zinc-400">No users yet.</li>
            )}
            {stats.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold uppercase text-zinc-600">
                  {(u.full_name ?? u.email ?? "?").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-800">{u.full_name ?? u.email}</div>
                  <div className="text-xs text-zinc-400">{u.email}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${ROLE_COLOR[u.role] ?? "bg-zinc-100 text-zinc-600"}`}>
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent leads */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <Clock className="size-4 text-zinc-400" /> Recent leads
            </div>
          </div>
          <ul className="divide-y divide-zinc-100">
            {stats.recentLeads.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-zinc-400">No leads yet.</li>
            )}
            {stats.recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500/5 text-xs font-bold uppercase text-brand-500">
                  {(l.full_name ?? l.work_email ?? "?").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-800">{l.full_name}</div>
                  <div className="text-xs text-zinc-400">{l.company ?? l.work_email}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${LEAD_STATUS_COLOR[l.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                  {l.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
