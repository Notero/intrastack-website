import { PageHeader } from "../../_components/PageHeader";
import { PersonForm } from "../../_leadership/PersonForm";
import { createLeadershipPerson } from "../../_leadership/actions";

export const metadata = { title: "New advisor · Admin" };

const GROUP_OPTIONS = [{ value: "advisor" as const, label: "Advisor" }];

export default function NewAdvisorPage() {
  const boundCreate = createLeadershipPerson.bind(null, "/admin/advisors");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Advisors"
        title="Add advisor"
        description="Add a member to the public Board of Advisors page."
      />
      <PersonForm
        action={boundCreate}
        submitLabel="Create"
        cancelHref="/admin/advisors"
        groupOptions={GROUP_OPTIONS}
        defaults={{
          name: "",
          title: "Executive Advisor",
          group_name: "advisor",
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
