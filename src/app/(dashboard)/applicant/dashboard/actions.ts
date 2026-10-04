"use server";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { upsertApplicantProfile } from "@/lib/db/applicantProfiles";

export interface ProfileData {
  // profiles table
  fullName: string;
  displayName: string;
  phone: string;
  timezone: string;
  // applicant_profiles table
  headline: string;
  bio: string;
  location: string;
  yearsExperience: number | null;
  currentTitle: string;
  currentCompany: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  openToWork: boolean;
  skills: string[];
}

export async function updateProfileAction(data: ProfileData) {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const [profileResult, apResult] = await Promise.all([
    supabase
      .from("profiles")
      .update({
        full_name:    data.fullName    || null,
        display_name: data.displayName || null,
        phone:        data.phone       || null,
        timezone:     data.timezone    || "UTC",
      })
      .eq("id", user.id),

    upsertApplicantProfile(supabase, {
      id:               user.id,
      headline:         data.headline       || null,
      bio:              data.bio            || null,
      location:         data.location       || null,
      years_experience: data.yearsExperience ?? null,
      current_title:    data.currentTitle   || null,
      current_company:  data.currentCompany || null,
      linkedin_url:     data.linkedinUrl    || null,
      github_url:       data.githubUrl      || null,
      portfolio_url:    data.portfolioUrl   || null,
      open_to_work:     data.openToWork,
      skills:           data.skills,
    }),
  ]);

  if (profileResult.error) console.error("[profile] update profiles failed:", profileResult.error.message);
  if (apResult.error)      console.error("[profile] upsert applicant_profiles failed:", apResult.error.message);
}
