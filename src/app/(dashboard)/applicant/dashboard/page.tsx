import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ClipboardList, Bookmark, Bell, Briefcase } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard · Applicant" };

export default async function ApplicantDashboardPage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalApplications },
    { count: activeApplications },
    { count: savedJobs },
    { count: unreadNotifications },
    { data: recentApplications },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", user.id),

    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", user.id)
      .in("status", ["submitted", "reviewing", "interview", "offer"]),

    supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", user.id),

    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),

    supabase
      .from("applications")
      .select("id, status, created_at, job_posts ( title, location )")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = user.email?.split("@")[0] ?? "there";

  const STATUS_LABEL: Record<string, { label: string; className: string }> = {
    submitted: { label: "Submitted",  className: "bg-zinc-100 text-zinc-600" },
    reviewing: { label: "Reviewing",  className: "bg-blue-50 text-blue-600" },
    interview: { label: "Interview",  className: "bg-violet-50 text-violet-600" },
    offer:     { label: "Offer",      className: "bg-green-50 text-green-600" },
    accepted:  { label: "Accepted",   className: "bg-green-100 text-green-700" },
    rejected:  { label: "Rejected",   className: "bg-red-50 text-red-500" },
    withdrawn: { label: "Withdrawn",  className: "bg-zinc-100 text-zinc-400" },
  };

  return (
    <div className="w-full space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{greeting}, {name}</h1>
        <p className="mt-1 text-sm text-zinc-500">Here&apos;s a snapshot of your job search activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Total Applications"
          value={totalApplications ?? 0}
          sub="all time"
          color="blue"
          href="/applicant/applications"
        />
        <StatCard
          icon={Briefcase}
          label="Active"
          value={activeApplications ?? 0}
          sub="in progress"
          color="violet"
          href="/applicant/applications"
        />
        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value={savedJobs ?? 0}
          sub="bookmarked"
          color="amber"
          href="/applicant/saved-jobs"
        />
        <StatCard
          icon={Bell}
          label="Unread"
          value={unreadNotifications ?? 0}
          sub="notifications"
          color="cyan"
          href="/applicant/notifications"
        />
      </div>

      {/* Recent applications */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-800">Recent Applications</h2>
          <Link href="/applicant/applications" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {!recentApplications || recentApplications.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-400">
            No applications yet.{" "}
            <Link href="/careers" className="text-primary hover:underline">Browse open roles</Link>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {recentApplications.map((app) => {
              const job = (Array.isArray(app.job_posts) ? app.job_posts[0] : app.job_posts) as { title: string; location: string } | null;
              const s = STATUS_LABEL[app.status] ?? { label: app.status, className: "bg-zinc-100 text-zinc-500" };
              return (
                <li key={app.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{job?.title ?? "Unknown Role"}</p>
                    <p className="text-xs text-zinc-500">{job?.location ?? "—"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, color, href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  color: "blue" | "violet" | "amber" | "cyan";
  href: string;
}) {
  const colors = {
    blue:   "border-blue-200   bg-blue-50   text-blue-900",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
    amber:  "border-brand-500  bg-brand-500/5  text-brand-500",
    cyan:   "border-brand-500   bg-brand-500/5   text-brand-500",
  };
  const iconColors = {
    blue: "text-blue-400", violet: "text-violet-400",
    amber: "text-brand-400", cyan: "text-brand-400",
  };

  return (
    <Link href={href} className={`rounded-2xl border p-5 shadow-sm transition-opacity hover:opacity-80 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</span>
        <Icon className={`size-4 ${iconColors[color]}`} />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs opacity-60">{sub}</div>
    </Link>
  );
}
