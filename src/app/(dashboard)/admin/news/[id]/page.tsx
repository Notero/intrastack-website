import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { newsImageUrl } from "@/lib/supabase/storage";
import { PageHeader } from "../../_components/PageHeader";
import { NewsForm } from "../NewsForm";
import { updateNewsItem, type NewsFormState, type NewsKind } from "../actions";

export const metadata = { title: "Edit article · Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: item, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !item) notFound();

  const boundUpdate = async (state: NewsFormState, formData: FormData) => {
    "use server";
    return updateNewsItem(id, state, formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="News" title="Edit article" description={item.title} />
      <NewsForm
        action={boundUpdate}
        submitLabel="Save changes"
        defaults={{
          id: item.id,
          kind: item.kind as NewsKind,
          title: item.title ?? "",
          excerpt: item.excerpt ?? "",
          body: item.body ?? "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          published: !!item.published,
          author: item.author ?? "",
          read_time: item.read_time ?? "",
          pages: item.pages?.toString() ?? "",
          file_size: item.file_size ?? "",
          file_url: item.file_url ?? "",
          client: item.client ?? "",
          industry: item.industry ?? "",
          metric_value: item.metric_value ?? "",
          metric_label: item.metric_label ?? "",
          coverUrl: newsImageUrl(item.cover_image_path),
          image2Url: newsImageUrl(item.image_2_path),
          image3Url: newsImageUrl(item.image_3_path),
        }}
      />
    </div>
  );
}
