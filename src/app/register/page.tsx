"use client";

import { useActionState, useState, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { registerAction, type RegisterState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const initialState: RegisterState = {};

function SuccessScreen() {
  const searchParams = useSearchParams();
  return searchParams.get("success") === "1" ? (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="size-16 text-primary" />
        </div>
        <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Check your email</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to your inbox. Click it to activate your account,
          then sign in.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </main>
  ) : null;
}

function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-base-300 bg-base-200 p-8 shadow-xl">
          <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Create account</h1>
          <p className="mb-6 text-sm text-muted-foreground">Join the Intrastack candidate portal</p>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName" name="fullName" type="text" placeholder="Jane Smith"
                required autoComplete="name" aria-invalid={!!errors.fullName}
                defaultValue={values.fullName ?? ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email" name="email" type="email" placeholder="you@example.com"
                required autoComplete="email" aria-invalid={!!errors.email}
                defaultValue={values.email ?? ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters" required autoComplete="new-password"
                  className="pr-10" aria-invalid={!!errors.password}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword" name="confirmPassword" type="password"
                placeholder="Re-enter password" required autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox name="consent" required aria-invalid={!!errors.consent} className="mt-0.5" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/privacy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.consent && (
              <p className="text-sm text-destructive -mt-2">{errors.consent}</p>
            )}

            {state.error ? (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
            ) : null}

            <Button type="submit" disabled={pending} className="mt-1 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterForm />}>
      <SuccessScreenOrForm />
    </Suspense>
  );
}

function SuccessScreenOrForm() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  if (success) return <SuccessScreen />;
  return <RegisterForm />;
}