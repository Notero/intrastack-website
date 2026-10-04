import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { BookingForm } from "./_components/BookingForm";

export const metadata = { title: "Book Meeting · Applicant" };

interface Props {
  searchParams: Promise<{ application?: string }>;
}

export default async function NewMeetingPage({ searchParams }: Props) {
  const user = await requireRole("applicant");
  const params = await searchParams;
  const applicationId = params.application;

  if (!applicationId) redirect("/applicant/applications");

  const supabase = await createSupabaseServerClient();

  // Fetch the application and verify it's in interview status
  const { data: application, error } = await supabase
    .from("applications")
    .select("id, status, job_post_id")
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .single();

  if (error || !application) redirect("/applicant/applications");
  if (application.status !== "interview") redirect("/applicant/applications");

  // Fetch the job post to get the title and customer_id (recruiter_id)
  const { data: jobPost } = await supabase
    .from("job_posts")
    .select("id, title, recruiter_id")
    .eq("id", application.job_post_id)
    .single();

  if (!jobPost || !jobPost.recruiter_id) redirect("/applicant/applications");

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Book a Meeting</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Schedule an interview meeting for{" "}
          <span className="font-medium text-zinc-700">{jobPost.title}</span>
        </p>
      </div>

      <BookingForm applicationId={application.id} />
    </div>
  );
}
