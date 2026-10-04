"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAuthEvent } from "@/lib/audit/logAuthEvent";

type Status = "loading" | "ready" | "invalid" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });
    const timer = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "invalid" : prev));
    }, 3000);
    return () => { subscription.unsubscribe(); clearTimeout(timer); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); } else {
      await logAuthEvent("password_reset_completed", data.user?.id ?? null, data.user?.email ?? null);
      setStatus("success");
      setTimeout(() => router.replace("/login"), 3000);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-md">

        <div className="rounded-xl border border-base-300 bg-base-200 p-8 shadow-xl">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <XCircle className="size-12 text-destructive" />
              <h2 className="font-heading text-xl font-bold text-foreground">Link invalid or expired</h2>
              <p className="text-sm text-muted-foreground">
                This password reset link has expired or already been used.
              </p>
              <Button
                onClick={() => router.push("/forgot-password")}
                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request a new link
              </Button>
            </div>
          )}

          {status === "ready" && (
            <>
              <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Set new password</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Update Password"}
                </Button>
              </form>
            </>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="size-12 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Password updated</h2>
              <p className="text-sm text-muted-foreground">
                Your password has been changed. Redirecting you to login…
              </p>
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Go to login now
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}