import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../../_components/PageHeader";
import { JobForm } from "../JobForm";
import { updateJob, type EmploymentType, type JobFormState } from "../actions";

export const metadata = { title: "Edit job · Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: job, error } = await supabase.from("job_posts").select("*").eq("id", id).single();
  if (error || !job) notFound();

  const boundUpdate = async (state: JobFormState, formData: FormData) => {
    "use server";
    return updateJob(id, state, formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Jobs" title="Edit job" description={job.title} />
      <JobForm
        action={boundUpdate}
        submitLabel="Save changes"
        defaults={{
          id: job.id,
          title: job.title ?? "",
          slug: job.slug ?? "",
          team: job.team ?? "",
          location: job.location ?? "",
          remote: !!job.remote,
          employment_type: (job.employment_type as EmploymentType) ?? "full_time",
          seniority: job.seniority ?? "",
          salary_range: job.salary_range ?? "",
          short_description: job.short_description ?? "",
          description: job.description ?? "",
          responsibilities: job.responsibilities ?? [],
          requirements: job.requirements ?? [],
          nice_to_have: job.nice_to_have ?? [],
          tags: job.tags ?? [],
          published: !!job.published,
        }}
      />
    </div>
  );
}
