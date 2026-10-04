import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "../_components/PageHeader";
import { ProfileCard, type ProfileData } from "./ProfileCard";
import { FlagsCard } from "./FlagsCard";

export const metadata = { title: "Settings · Admin" };

const FLAG_DEFAULTS: Record<string, boolean> = {
  mfa: true, archive: true, careers: true, digest: false,
};

export default async function SettingsPage() {
  const user = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, display_name, phone, timezone, locale, avatar_url, metadata")
    .eq("id", user.id)
    .single();

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("department")
    .eq("id", user.id)
    .single();

  const savedFlags = (profile?.metadata as Record<string, unknown> | null)?.feature_flags;
  const flags: Record<string, boolean> = {
    ...FLAG_DEFAULTS,
    ...(typeof savedFlags === "object" && savedFlags !== null ? savedFlags as Record<string, boolean> : {}),
  };

  const data: ProfileData = {
    email: profile?.email ?? user.email ?? null,
    full_name: profile?.full_name ?? null,
    display_name: profile?.display_name ?? null,
    phone: profile?.phone ?? null,
    timezone: profile?.timezone ?? null,
    locale: profile?.locale ?? null,
    avatar_url: profile?.avatar_url ?? null,
    department: adminProfile?.department ?? null,
  };

  return (
    <div className="w-full">
      <PageHeader eyebrow="System" title="Settings" description="Your profile and platform-wide preferences." />

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="h-auto bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-500 data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 data-[state=active]:shadow-none"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="flags"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-500 data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 data-[state=active]:shadow-none"
          >
            Feature flags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileCard profile={data} />
        </TabsContent>

        <TabsContent value="flags">
          <FlagsCard initialFlags={flags} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
