"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerTopbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    const handler = () => {
      setHidden(el.scrollTop > lastY && el.scrollTop > 64);
      lastY = el.scrollTop;
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`shrink-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-[#F5F7FA] px-6 text-zinc-800 transition-[margin-top] duration-300 ${hidden ? "-mt-16" : "mt-0"}`}
    >
      <Link href="/customer/dashboard" className="flex items-center" aria-label="Intrastack customer home">
        <Image
          src="/images/trythisout.png"
          alt="Intrastack"
          width={671}
          height={157}
          priority
          className="h-8 w-auto"
        />
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
