import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="size-16 text-primary" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
          Account confirmed
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Your email has been verified and your account is ready to go.
        </p>
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </main>
  );
}