import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata = { title: "Customers · Admin" };

export default async function CustomersPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: customers } = await supabase
    .from("profiles")
    .select("id, email, full_name, status, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  const ids = (customers ?? []).map((r) => r.id);

  const { data: customerProfiles } = ids.length
    ? await supabase
        .from("customer_profiles")
        .select("id, company_name, title, verified")
        .in("id", ids)
    : { data: [] };

  const profileMap = Object.fromEntries(
    (customerProfiles ?? []).map((p) => [p.id, p]),
  );

  const STATUS_COLOR: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    invited: "bg-sky-100 text-sky-700",
    suspended: "bg-red-100 text-red-700",
    deactivated: "bg-zinc-100 text-zinc-500",
  };

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Talent"
        title="Customers"
        description="All customer accounts — view their listings and verification status."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(customers ?? []).map((r) => {
                const rp = profileMap[r.id];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="pl-6 py-4">
                      <div className="font-semibold text-zinc-900">{r.full_name ?? "—"}</div>
                      <div className="text-xs text-zinc-500">{r.email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600">{rp?.company_name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-zinc-600">{rp?.title ?? "—"}</TableCell>
                    <TableCell>
                      {rp?.verified
                        ? <CheckCircle className="size-4 text-green-500" />
                        : <XCircle className="size-4 text-zinc-300" />}
                    </TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[r.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/customers/${r.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(customers?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-zinc-500">
                    No customers yet.
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
