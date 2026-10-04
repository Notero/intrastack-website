"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";

export async function verifyCustomer(id: string): Promise<void> {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("customer_profiles")
    .update({ verified: true, verified_at: new Date().toISOString(), verified_by: null })
    .eq("id", id);
  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
}

export async function unverifyCustomer(id: string): Promise<void> {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("customer_profiles")
    .update({ verified: false, verified_at: null, verified_by: null })
    .eq("id", id);
  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
}
