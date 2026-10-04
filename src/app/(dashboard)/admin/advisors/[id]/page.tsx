import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { leaderPhotoUrl } from "@/lib/supabase/storage";
import { PageHeader } from "../../_components/PageHeader";
import { PersonForm } from "../../_leadership/PersonForm";
import { updateLeadershipPerson } from "../../_leadership/actions";

export const metadata = { title: "Edit advisor · Admin" };

const GROUP_OPTIONS = [{ value: "advisor" as const, label: "Advisor" }];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdvisorPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: person, error } = await supabase
    .from("leadership_people")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !person) notFound();

  const boundUpdate = updateLeadershipPerson.bind(null, "/admin/advisors", id);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Advisors" title="Edit advisor" description={person.name} />
      <PersonForm
        action={boundUpdate}
        submitLabel="Save changes"
        cancelHref="/admin/advisors"
        groupOptions={GROUP_OPTIONS}
        defaults={{
          id: person.id,
          name: person.name ?? "",
          title: person.title ?? "",
          group_name: "advisor",
          region: person.region ?? "",
          email: person.email ?? "",
          phone: person.phone ?? "",
          linkedin_url: person.linkedin_url ?? "",
          instagram_url: person.instagram_url ?? "",
          twitter_url: person.twitter_url ?? "",
          intro: Array.isArray(person.intro) ? person.intro.join("\n\n") : "",
          highlights: Array.isArray(person.highlights) ? (person.highlights as { title: string; body: string }[]) : [],
          closing: person.closing ?? "",
          certifications: Array.isArray(person.certifications) ? person.certifications : [],
          display_order: person.display_order ?? 0,
          published: !!person.published,
          photoUrl: leaderPhotoUrl(person.photo_path),
        }}
      />
    </div>
  );
}
