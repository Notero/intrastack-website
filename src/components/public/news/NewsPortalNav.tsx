"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LogIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SECTIONS = [
  { label: "Home", href: "/news" },
  { label: "Blogs", href: "/news/blogs" },
  { label: "Trends & Tech", href: "/news/trends" },
  { label: "Whitepapers", href: "/news/whitepaper" },
  { label: "Client Stories", href: "/news/client_stories" },
  { label: "Intrastack", href: "/news/intrastack" },
];

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsPortalNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-40 shadow-md">
      {/* ── Utility strip (full-bleed dark bar) ── */}
      <div
        className={`w-full bg-ink-900 text-ink-300 overflow-hidden transition-all duration-300 ease-in-out ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-9 flex items-center justify-between font-sans text-[12px]">
          <div className="flex items-center gap-5">
            <span className="text-accent-400 font-bold tracking-wide hidden sm:block">
              {formatDate()}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-ink-300 hover:text-white transition-colors"
            >
              <LogIn className="w-3 h-3" />
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-brand-600 text-white font-bold px-3 py-1 text-[11px] uppercase tracking-wide hover:bg-brand-600 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* ── Masthead: logo | search ── */}
      <div className="w-full bg-white border-b border-ink-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/news" className="flex items-center shrink-0">
            <Image
              src="/images/trythisout.png"
              alt="Intrastack"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search + back link */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="hidden md:flex items-center gap-2 border border-ink-300 px-3 h-9 text-ink-400 w-44 hover:border-brand-500 transition-colors cursor-text">
              <Search className="w-4 h-4 shrink-0" />
              <span className="font-sans text-[13px]">Search…</span>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold text-white bg-brand-600 hover:bg-brand-600 transition-colors px-4 h-9 whitespace-nowrap"
            >
              Corporate site
            </Link>
          </div>
        </div>
      </div>

      {/* ── Primary nav (full-bleed brand bar) ── */}
      <nav className="w-full bg-brand-600 text-ink-800 overflow-x-auto">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center">
          <ul className="flex items-stretch font-sans font-bold text-[13px] uppercase tracking-[0.08em] whitespace-nowrap">
            {SECTIONS.map((s) => {
              const isActive =
                s.href === "/news"
                  ? pathname === "/news"
                  : pathname?.startsWith(s.href);
              return (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className={`flex items-center h-[46px] px-5 border-b-[3px] transition-colors ${
                      isActive
                        ? "bg-brand-600 border-accent-400 text-ink-800"
                        : "border-transparent text-brand-400 hover:bg-brand-600 hover:text-ink-800"
                    }`}
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
