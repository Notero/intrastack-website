import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { leaderPhotoUrl } from "@/lib/supabase/storage";
import { PageHeader } from "../../_components/PageHeader";
import { PersonForm } from "../../_leadership/PersonForm";
import { updateLeadershipPerson } from "../../_leadership/actions";

export const metadata = { title: "Edit leadership entry · Admin" };

const GROUP_OPTIONS = [
  { value: "founder" as const, label: "Founder" },
  { value: "executive" as const, label: "Executive" },
  { value: "vp" as const, label: "VP" },
  { value: "director" as const, label: "Director" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadershipPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: person, error } = await supabase
    .from("leadership_people")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !person) notFound();

  const boundUpdate = updateLeadershipPerson.bind(null, "/admin/leadership", id);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Leadership" title="Edit person" description={person.name} />
      <PersonForm
        action={boundUpdate}
        submitLabel="Save changes"
        cancelHref="/admin/leadership"
        groupOptions={GROUP_OPTIONS}
        defaults={{
          id: person.id,
          name: person.name ?? "",
          title: person.title ?? "",
          group_name: person.group_name === "advisor" ? "executive" : person.group_name,
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
