"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, MailCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAuthEvent } from "@/lib/audit/logAuthEvent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      await logAuthEvent("password_reset_requested", null, email);
      setSent(true);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-md">

        <div className="rounded-xl border border-base-300 bg-base-200 p-8 shadow-xl">
          {sent ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <MailCheck className="size-12 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Reset email sent</h2>
              <p className="text-sm text-muted-foreground">
                Check <strong className="text-foreground">{email}</strong> for a link to reset
                your password.
              </p>
              <Link href="/login" className="mt-2 text-sm font-medium text-primary hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Reset password</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}