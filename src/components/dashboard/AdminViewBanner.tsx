import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";

export async function AdminViewBanner() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 bg-brand-500 px-5 py-2.5 text-white shadow-sm">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 text-sm font-semibold underline-offset-2 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to Admin Dashboard
      </Link>
      <span className="ml-1 text-xs text-brand-500">— You are viewing as Applicant</span>
    </div>
  );
}
