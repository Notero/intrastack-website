export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-md space-y-3 p-8">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="text-sm text-zinc-500">
          Your account doesn’t have access to that area. If you think this is a
          mistake, contact an administrator.
        </p>
        <a href="/login" className="text-sm underline">Back to sign in</a>
      </div>
    </main>
  );
}
