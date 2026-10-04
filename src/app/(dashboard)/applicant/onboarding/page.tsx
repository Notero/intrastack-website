import { requireRole } from "@/lib/auth/session";
import { RtrFormClient } from "./RtrFormClient";

export const metadata = { title: "Onboarding · Intrastack" };

export default async function OnboardingPage() {
  const user = await requireRole("applicant");

  return (
    <RtrFormClient
      initialFullName={""}
      initialEmail={user.email ?? ""}
    />
  );
}
