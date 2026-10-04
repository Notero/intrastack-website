import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { deleteNewsItemAction, toggleNewsPublished } from "./actions";
import { Switch } from "@/components/ui/switch";

export const metadata = { title: "News · Admin" };

const KIND_LABEL: Record<string, string> = {
  blog: "Blog",
  trend: "Trend",
  whitepaper: "Whitepaper",
  client_story: "Client story",
};

export default async function NewsListPage() {
  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase
    .from("news_items")
    .select("id, slug, kind, title, tags, published, published_at, author")
    .order("published_at", { ascending: false });

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Marketing"
        title="News"
        description="Blogs, trends, whitepapers and client stories published to the public site."
        actions={
          <Button asChild>
            <Link href="/admin/news/new"><Plus className="mr-1.5 h-4 w-4" />New article</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Article</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(items ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-semibold text-zinc-900">{item.title}</div>
                    <div className="text-xs text-zinc-500">
                      {item.slug}{item.author ? ` · by ${item.author}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{KIND_LABEL[item.kind] ?? item.kind}</Badge>
                  </TableCell>
                  <TableCell><span className="text-sm text-zinc-600">{Array.isArray(item.tags) ? item.tags.join(", ") : ""}</span></TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await toggleNewsPublished(item.id, !item.published);
                      }}
                    >
                      <Switch defaultChecked={item.published} type="submit" />
                    </form>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {new Date(item.published_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/news/${item.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteNewsItemAction(item.id);
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
              {(items?.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center text-sm text-zinc-500">
                    No articles yet. <Link href="/admin/news/new" className="text-brand-500 underline">Create the first one</Link>.
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
