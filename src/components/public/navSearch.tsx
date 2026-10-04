"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";

export type NavSearchEntry = {
  label: string;
  href: string;
  group: string;
};

export default function NavSearch({ entries }: { entries: NavSearchEntry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const wrapRef = useRef<HTMLDivElement>(null);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setActiveIdx(0);
  }

  const q = query.trim().toLowerCase();
  const matches = !q ? [] : entries
    .map((e) => {
      const label = e.label.toLowerCase();
      const group = e.group.toLowerCase();
      let score = 0;
      if (label === q) score = 100;
      else if (label.startsWith(q)) score = 80;
      else if (label.includes(q)) score = 60;
      else if (group.includes(q)) score = 30;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.e);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = matches[activeIdx];
      if (target) go(target.href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 rounded-md border border-ink-300 bg-white px-3 py-1.5 text-ink-500 focus-within:border-brand-500 focus-within:text-ink-800 focus-within:ring-2 focus-within:ring-brand-500/30 transition-colors">
        <Search className="size-4" />
        <input
          id="nav-search"
          name="search"
          type="search"
          aria-label="Search"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="bg-transparent text-sm placeholder:text-ink-400 focus:outline-none w-32 text-ink-800"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-popover text-popover-foreground border border-border rounded-lg shadow-xl py-2 z-50">
          {matches.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No matches. Try &ldquo;cloud&rdquo;, &ldquo;security&rdquo;, &ldquo;careers&rdquo;…
            </p>
          ) : (
            <ul>
              {matches.map((m, i) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex items-center justify-between gap-3 px-4 py-2 text-sm ${
                      i === activeIdx
                        ? "bg-muted text-brand-500"
                        : "text-foreground hover:bg-muted hover:text-brand-500"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span>{m.label}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {m.group}
                      </span>
                    </span>
                    {i === activeIdx && (
                      <CornerDownLeft className="size-3.5 text-muted-foreground" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
