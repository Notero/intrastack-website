/**
 * Layout for the authenticated app surface (admin / customer / recruiter
 * / applicant / unauthorized). Intentionally bare — the root layout
 * detects these paths via the `x-pathname` header and skips the
 * marketing NavBar/Footer for them.
 */
export default function DashboardGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-white text-zinc-900">{children}</div>;
}
