"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { isRole, roleToDashboard } from "@/lib/auth/roles";
import { logAuthEvent } from "@/lib/audit/logAuthEvent";
import { checkRateLimit, getClientKeyFromHeaders } from "@/lib/rateLimit";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!(await checkRateLimit("login", await getClientKeyFromHeaders()))) {
    return { error: "Too many login attempts. Please wait a few minutes and try again." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    await logAuthEvent("login_failure", null, email);
    return { error: error?.message ?? "Could not sign in." };
  }

  await logAuthEvent("login_success", data.user.id, email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, signed_for_representation")
    .eq("id", data.user.id)
    .single();

  if (!profile || !isRole(profile.role)) {
    return { error: "Your account is missing a profile. Contact an admin." };
  }

  if (profile.role === "applicant" && !profile.signed_for_representation) {
    redirect("/applicant/onboarding");
  }

  redirect(roleToDashboard(profile.role));
}