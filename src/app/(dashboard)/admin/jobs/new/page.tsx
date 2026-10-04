import { PageHeader } from "../../_components/PageHeader";
import { JobForm } from "../JobForm";
import { createJob } from "../actions";

export const metadata = { title: "New job · Admin" };

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Jobs" title="New job" description="Post a new role to the public careers page." />
      <JobForm
        action={createJob}
        submitLabel="Create"
        defaults={{
          title: "",
          slug: "",
          team: "",
          location: "",
          remote: false,
          employment_type: "full_time",
          seniority: "",
          salary_range: "",
          short_description: "",
          description: "",
          responsibilities: [],
          requirements: [],
          nice_to_have: [],
          tags: [],
          published: true,
        }}
      />
    </div>
  );
}
