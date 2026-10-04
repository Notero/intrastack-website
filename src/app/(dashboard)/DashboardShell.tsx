import { signOutAction } from "./actions";

interface Props {
  title: string;
  email: string | null;
  role: string;
  viewingAs?: string;
  children?: React.ReactNode;
}

/**
 * Minimal shared shell for the role dashboards. Replaced later with the
 * real UI; here just so each dashboard has a place to render and an obvious
 * sign-out button.
 */
export function DashboardShell({ title, email, role, viewingAs, children }: Props) {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6 p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-zinc-500">
              {email} · role: <span className="font-mono">{role}</span>
              {viewingAs ? (
                <> · viewing as <span className="font-mono">{viewingAs}</span></>
              ) : null}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
            >
              Sign out
            </button>
          </form>
        </header>
        <section>{children}</section>
      </div>
    </main>
  );
}
