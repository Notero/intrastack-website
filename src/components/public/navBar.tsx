"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Mail, Menu, Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import NavSearch, { type NavSearchEntry } from "./navSearch";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Cloud Transformation", href: "/services/cloud_transformation" },
      { label: "DevOps Automation", href: "/services/devops_automation" },
      { label: "AI Engineering", href: "/services/ai_engineering" },
      { label: "Cybersecurity", href: "/services/cybersecurity" },
      { label: "Software Development", href: "/services/software_development" },
      { label: "Mobile Development", href: "/services/mobile_development" },
      { label: "IT Services", href: "/services/it_services" },
      { label: "Staff Augmentation", href: "/services/staff_augmentation" },
      { label: "Cloud Migration", href: "/services/cloud_migration" },
      { label: "IT Consulting", href: "/services/it_consulting" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Data Analytics", href: "/solutions/data_analytics" },
      { label: "Security & Compliance", href: "/solutions/security_compliance" },
      { label: "Business Continuity", href: "/solutions/business_continuity" },
      { label: "AWS", href: "/solutions/aws" },
      { label: "Azure", href: "/solutions/azure" },
      { label: "Kubernetes", href: "/solutions/kubernetes" },
      { label: "AI Automation", href: "/solutions/ai_automation" },
      { label: "Enterprise Security", href: "/solutions/enterprise_security" },
      { label: "CI/CD Transformation", href: "/solutions/cicd_transformation" },
      { label: "Hybrid Cloud", href: "/solutions/hybrid_cloud" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Finance", href: "/industries/finance" },
      { label: "Retail", href: "/industries/retail" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Government", href: "/industries/government" },
      { label: "Logistics", href: "/industries/logistics" },
      { label: "Telecom", href: "/industries/telecom" },
      { label: "Education", href: "/industries/education" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "News", href: "/news" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Company", href: "/about" },
      { label: "Life at Intrastack", href: "/about/life_intrastack" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Board of Advisors", href: "/about/advisors" },
      { label: "Mission & Vision", href: "/about/mission_vision" },
      { label: "Delivery Centers", href: "/about/delivery_centers" },
      { label: "Certifications", href: "/about/certifications" },
      { label: "Partners", href: "/about/partners" },
    ],
  },
  { label: "Careers", href: "/careers" },
];

const SEARCH_ENTRIES: NavSearchEntry[] = (() => {
  const out: NavSearchEntry[] = [];
  for (const item of NAV_ITEMS) {
    out.push({ label: item.label, href: item.href, group: item.label });
    if (item.children) {
      for (const child of item.children) {
        out.push({ label: child.label, href: child.href, group: item.label });
      }
    }
  }
  out.push(
    { label: "Login", href: "/login", group: "Account" },
    { label: "Register", href: "/register", group: "Account" },
    { label: "Contact", href: "/contact", group: "Account" },
  );
  return out;
})();

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Increments each time the strip re-opens after being collapsed by scroll,
  // so we can replay the slide-in animation. Stays 0 on initial page load.
  const [stripRevealKey, setStripRevealKey] = useState(0);

  useEffect(() => {
    let wasScrolled = false;
    const onScroll = () => {
      const next = window.scrollY > 8;
      if (next !== wasScrolled) {
        if (wasScrolled && !next) setStripRevealKey((k) => k + 1);
        wasScrolled = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        key={stripRevealKey}
        aria-hidden={scrolled}
        className={`${stripRevealKey > 0 ? "topstrip-slide" : ""} overflow-hidden bg-ink-900 text-white/85 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-10 items-center justify-between gap-6 px-6 text-[12.5px]">
          <div className="flex items-center gap-6">
            <a
              href="tel:8889597868"
              className="inline-flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <Phone className="size-3.5" />
              888-959-7868
            </a>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <a
              href="mailto:info@intrastack.com"
              className="inline-flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <Mail className="size-3.5" />
              info@intrastack.com
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/careers" className="hover:text-orange-400 transition-colors">
              Careers
            </Link>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <Link href="/news" className="hover:text-orange-400 transition-colors">
              News
            </Link>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-medium text-white hover:text-orange-400 transition-colors"
            >
              Get in touch <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-white/70 backdrop-blur-md border-b border-ink-100/60 mx-auto flex h-20 items-center gap-8 px-6">
        <Link href="/" className="flex items-center shrink-0 ml-4" aria-label="Intrastack home">
          <Image
            src="/images/trythisout.png"
            alt="Intrastack"
            width={671}
            height={157}
            priority
            sizes="171px"
            className="h-10 w-auto"
          />
        </Link>

        <NavigationMenu className="hidden lg:flex ml-auto" viewport={false}>
          <NavigationMenuList className="gap-3">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="text-[15px] font-medium text-ink-800 bg-transparent hover:!bg-ink-50 focus:!bg-ink-50 data-open:!bg-ink-50 data-open:hover:!bg-ink-50 data-popup-open:!bg-ink-50 data-popup-open:hover:!bg-ink-50 hover:text-orange-600 focus:text-orange-600 data-open:text-orange-600 data-popup-open:text-orange-600">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:!bg-white group-data-[viewport=false]/navigation-menu:!text-ink-800 group-data-[viewport=false]/navigation-menu:!ring-ink-100">
                    <ul className="grid w-[440px] grid-cols-2 gap-1 p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="block rounded-md px-3 py-2 text-sm text-ink-700 hover:!bg-ink-50 hover:text-orange-600 transition-colors"
                            >
                              {child.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2 mt-1 border-t border-ink-100 pt-2">
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-ink-800 hover:!bg-ink-50 hover:text-orange-600"
                          >
                            View all {item.label.toLowerCase()}
                            <ChevronRight className="size-4" />
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} text-[15px] font-medium text-ink-800 bg-transparent hover:!bg-ink-50 focus:!bg-ink-50 hover:text-orange-600 focus:text-orange-600`}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto lg:ml-0 flex items-center gap-3">
          <NavSearch entries={SEARCH_ENTRIES} />

          <div className="hidden md:flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 px-5 border-ink-300 bg-white text-ink-800 hover:bg-ink-50 hover:text-ink-900 hover:border-ink-400"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="h-10 px-5 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Link href="/contact">
                Contact Us
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-ink-800 hover:bg-ink-50 hover:text-ink-900"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle>
                  <Image
                    src="/images/intrastack-logo-assets/email-print/print-hires-logo-2400x1878.png"
                    alt="Intrastack"
                    width={180}
                    height={141}
                    className="h-16 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="overflow-y-auto px-2 py-4">
                <Accordion type="multiple" className="w-full">
                  {NAV_ITEMS.map((item) =>
                    item.children ? (
                      <AccordionItem
                        key={item.label}
                        value={item.label}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="px-3 py-3 text-[15px] font-medium text-ink-800 hover:no-underline hover:text-orange-600">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <ul className="ml-3 border-l border-border pl-3 space-y-1">
                            <li>
                              <Link
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 text-sm font-semibold text-ink-800 hover:text-orange-600"
                              >
                                View all
                              </Link>
                            </li>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-1.5 text-sm text-ink-600 hover:text-orange-600"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-3 text-[15px] font-medium text-ink-800 hover:text-orange-600 border-b border-border"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </Accordion>

                <div className="mt-4 flex flex-col gap-2 px-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    <Link href="/contact" onClick={() => setMobileOpen(false)}>
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
