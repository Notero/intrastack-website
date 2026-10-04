import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { deleteLeadershipPersonAction, toggleLeadershipPublished } from "../_leadership/actions";

export const metadata = { title: "Leadership · Admin" };

const GROUP_LABEL: Record<string, string> = {
  founder: "Founder",
  executive: "Executive",
  vp: "VP",
  director: "Director",
};

export default async function LeadershipListPage() {
  const supabase = await createSupabaseServerClient();
  const { data: people } = await supabase
    .from("leadership_people")
    .select("id, slug, name, title, group_name, published, display_order")
    .in("group_name", ["founder", "executive", "vp", "director"])
    .order("group_name", { ascending: true })
    .order("display_order", { ascending: true });

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Marketing"
        title="Leadership"
        description="Executives, VPs, and directors shown on the public leadership page."
        actions={
          <Button asChild>
            <Link href="/admin/leadership/new"><Plus className="mr-1.5 h-4 w-4" />Add person</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(people ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-zinc-900">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{GROUP_LABEL[p.group_name] ?? p.group_name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{p.display_order}</TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await toggleLeadershipPublished("/admin/leadership", p.id, !p.published);
                      }}
                    >
                      <Switch defaultChecked={p.published} type="submit" />
                    </form>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/leadership/${p.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteLeadershipPersonAction("/admin/leadership", p.id);
                        }}
                      >
                        <SubmitButton variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </SubmitButton>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(people?.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-sm text-zinc-500">
                    No leadership entries yet. <Link href="/admin/leadership/new" className="text-brand-500 underline">Add the first one</Link>.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
