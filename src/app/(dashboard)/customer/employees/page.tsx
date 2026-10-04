import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Employees · Customer" };

export default async function EmployeesPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, phone, employer_id, employer_since")
    .not("employer_id", "is", null)
    .order("employer_since", { ascending: false });
  if (user.role !== "admin") query = query.eq("employer_id", user.id);

  const { data: employees } = await query;

  const employerIds = [
    ...new Set((employees ?? []).map((e) => e.employer_id).filter((id): id is string => !!id)),
  ];
  const employerNameById = new Map<string, string>();
  if (user.role === "admin" && employerIds.length) {
    const { data: employers } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", employerIds);
    for (const e of employers ?? []) {
      employerNameById.set(e.id, e.full_name || e.email || "Customer");
    }
  }

  const columnCount = user.role === "admin" ? 4 : 3;

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Talent"
        title="Employees"
        description="Applicants who completed onboarding and are now working with you."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead>Phone</TableHead>
                {user.role === "admin" && <TableHead>Employer</TableHead>}
                <TableHead className="pr-6">Employed since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(employees ?? []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-zinc-900">{e.full_name ?? "—"}</div>
                    <div className="text-xs text-zinc-500">{e.email}</div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600">{e.phone ?? "—"}</TableCell>
                  {user.role === "admin" && (
                    <TableCell className="text-sm text-zinc-600">
                      {e.employer_id ? employerNameById.get(e.employer_id) ?? "—" : "—"}
                    </TableCell>
                  )}
                  <TableCell className="pr-6 text-sm text-zinc-500">
                    {e.employer_since ? new Date(e.employer_since).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {(employees?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={columnCount} className="py-16 text-center text-sm text-zinc-500">
                    No employees yet.
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
