import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ProfileCard } from "../dashboard/_components/ProfileCard";

export const metadata = { title: "Profile · Applicant" };

export default async function ProfilePage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const [{ data: profile }, { data: ap }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, display_name, phone, timezone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("applicant_profiles")
      .select("headline, bio, location, years_experience, current_title, current_company, linkedin_url, github_url, portfolio_url, open_to_work, skills")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your personal and professional details.</p>
      </div>

      <ProfileCard
        email={user.email}
        initialData={{
          fullName:        profile?.full_name      ?? "",
          displayName:     profile?.display_name   ?? "",
          phone:           profile?.phone          ?? "",
          timezone:        profile?.timezone        ?? "UTC",
          headline:        ap?.headline             ?? "",
          bio:             ap?.bio                  ?? "",
          location:        ap?.location             ?? "",
          yearsExperience: ap?.years_experience     ?? null,
          currentTitle:    ap?.current_title        ?? "",
          currentCompany:  ap?.current_company      ?? "",
          linkedinUrl:     ap?.linkedin_url         ?? "",
          githubUrl:       ap?.github_url           ?? "",
          portfolioUrl:    ap?.portfolio_url        ?? "",
          openToWork:      ap?.open_to_work         ?? true,
          skills:          ap?.skills               ?? [],
        }}
      />
    </div>
  );
}
