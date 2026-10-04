"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/public/navBar";
import Footer from "@/components/public/footer";
import ChatWidget from "@/components/ChatWidget";

/**
 * Wraps marketing pages with NavBar + Footer + the chat widget, while
 * keeping the auth / dashboard surfaces (/admin, /customer, /recruiter,
 * /applicant, /unauthorized, /login) chrome-free.
 *
 * Why a client component? Reading `headers()` in the root layout opts
 * the whole tree into dynamic rendering. Using `usePathname()` on the
 * client lets the root layout stay statically renderable, which is the
 * point of the Vercel performance work.
 */
const APP_PATHS = ["/admin", "/customer", "/recruiter", "/applicant", "/unauthorized", "/news"];

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppShell =
    pathname != null &&
    APP_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isAppShell) return <>{children}</>;

  return (
    <>
      <NavBar />
      {children}
      <Footer />
      <ChatWidget />
    </>
  );
}
