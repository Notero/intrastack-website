"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { SITE } from "@/lib/seo/site";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";
import { checkRateLimit, getClientKeyFromHeaders } from "@/lib/rateLimit";

export interface RegisterState {
  error?: string;
  fieldErrors?: {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    consent?: string;
  };
  values?: {
    fullName?: string;
    email?: string;
  };
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if (!(await checkRateLimit("register", await getClientKeyFromHeaders()))) {
    return { error: "Too many signup attempts. Please wait an hour and try again." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const consent = formData.get("consent") === "on";

  const values = { fullName, email };
  const fieldErrors: RegisterState["fieldErrors"] = {};

  if (!fullName) fieldErrors.fullName = "Full name is required.";
  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }
  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (!consent) {
    fieldErrors.consent = "You must agree to the Privacy Policy to create an account.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        consent_version: PRIVACY_POLICY_VERSION,
        consent_given_at: new Date().toISOString(),
      },
      emailRedirectTo: `${SITE.url}/confirmation`,
    },
  });

  if (error) {
    return { error: error.message, values };
  }

  redirect("/register?success=1");
}