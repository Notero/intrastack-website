import { PageHeader } from "../../_components/PageHeader";
import { NewsForm } from "../NewsForm";
import { createNewsItem } from "../actions";

export const metadata = { title: "New article · Admin" };

export default function NewNewsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="News"
        title="New article"
        description="Create a blog, trend, whitepaper or client story for the public site."
      />
      <NewsForm
        action={createNewsItem}
        submitLabel="Create"
        defaults={{
          kind: "blog",
          title: "",
          excerpt: "",
          body: "",
          tags: [],
          published: true,
          author: "",
          read_time: "",
          pages: "",
          file_size: "",
          file_url: "",
          client: "",
          industry: "",
          metric_value: "",
          metric_label: "",
          coverUrl: null,
          image2Url: null,
          image3Url: null,
        }}
      />
    </div>
  );
}
