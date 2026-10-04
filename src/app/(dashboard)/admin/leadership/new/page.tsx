import { PageHeader } from "../../_components/PageHeader";
import { PersonForm } from "../../_leadership/PersonForm";
import { createLeadershipPerson } from "../../_leadership/actions";

export const metadata = { title: "New leadership entry · Admin" };

const GROUP_OPTIONS = [
  { value: "founder" as const, label: "Founder" },
  { value: "executive" as const, label: "Executive" },
  { value: "vp" as const, label: "VP" },
  { value: "director" as const, label: "Director" },
];

export default function NewLeadershipPage() {
  const boundCreate = createLeadershipPerson.bind(null, "/admin/leadership");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Leadership"
        title="Add person"
        description="Add an executive, VP, or director to the public leadership page."
      />
      <PersonForm
        action={boundCreate}
        submitLabel="Create"
        cancelHref="/admin/leadership"
        groupOptions={GROUP_OPTIONS}
        defaults={{
          name: "",
          title: "",
          group_name: "executive",
          region: "",
          email: "",
          phone: "",
          linkedin_url: "",
          instagram_url: "",
          twitter_url: "",
          intro: "",
          highlights: [],
          closing: "",
          certifications: [],
          display_order: 0,
          published: true,
          photoUrl: null,
        }}
      />
    </div>
  );
}
