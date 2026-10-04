import Link from "next/link";
import { Users } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Users · Admin" };

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  customer: "bg-brand-500/10 text-brand-600",
  applicant: "bg-zinc-100 text-zinc-600",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  invited: "bg-sky-100 text-sky-700",
  suspended: "bg-red-100 text-red-700",
  deactivated: "bg-zinc-100 text-zinc-500",
};

export default async function UsersPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, status, created_at, last_sign_in_at")
    .order("created_at", { ascending: false });

  const counts = (users ?? []).reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="User management"
        description="View and manage all registered accounts, roles, and statuses."
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["admin", "customer", "applicant"] as const).map((role) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-zinc-900">{counts[role] ?? 0}</div>
              <div className="mt-0.5 text-xs font-medium capitalize text-zinc-500">{role}s</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users ?? []).map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-zinc-900">{u.full_name ?? "—"}</div>
                    <div className="text-xs text-zinc-500">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_COLOR[u.role] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[u.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/users/${u.id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(users?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center text-sm text-zinc-500">
                    No users yet.
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
