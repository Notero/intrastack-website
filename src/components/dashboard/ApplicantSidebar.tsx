"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCircle, FileText, Bookmark, ClipboardList, Bell, LogOut, ArrowLeft, Briefcase, Sparkles, CalendarClock, FileCheck } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOutAction } from "@/app/(dashboard)/actions";

const NAV = [
  {
    group: null,
    items: [{ href: "/applicant/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "My Profile",
    items: [
      { href: "/applicant/profile",          label: "Profile",          icon: UserCircle },
      { href: "/applicant/resumes",          label: "Resumes",          icon: FileText },
      { href: "/applicant/resume-assistant", label: "Resume Assistant", icon: Sparkles },
      { href: "/applicant/saved-jobs",       label: "Saved Jobs",       icon: Bookmark },
    ],
  },
  {
    group: "Activity",
    items: [
      { href: "/applicant/jobs",          label: "Browse Jobs",   icon: Briefcase },
      { href: "/applicant/applications",  label: "Applications",  icon: ClipboardList },
      { href: "/applicant/meetings",      label: "Meetings",      icon: CalendarClock },
      { href: "/applicant/hire-docs",     label: "Hire Docs",     icon: FileCheck },
      { href: "/applicant/notifications", label: "Notifications", icon: Bell },
    ],
  },
] as const;

interface Props {
  email: string | null;
  fullName: string | null;
  isAdmin?: boolean;
  unreadCount?: number;
}

export function ApplicantSidebar({ email, fullName, isAdmin, unreadCount = 0 }: Props) {
  const pathname = usePathname();
  const initials = (fullName ?? email ?? "A").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="none" className="border-r-0">
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 bg-brand-500/20 px-4 py-2.5 text-xs font-semibold text-brand-500 transition-colors hover:bg-brand-500/30"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          Back to Admin Dashboard
        </Link>
      )}

      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4 py-0">
        <Link href="/applicant/dashboard" aria-label="Intrastack applicant home">
          <Image
            src="/images/trythisout.png"
            alt="Intrastack"
            width={671}
            height={157}
            priority
            className="h-7 w-auto"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((section, si) => (
          <div key={si}>
            {si > 0 && <SidebarSeparator />}
            <SidebarGroup>
              {section.group && (
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                  {section.group}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={active} size="lg" className="text-sm [&_svg]:size-4">
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                            {item.href === "/applicant/notifications" && unreadCount > 0 && (
                              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 9 ? "9+" : unreadCount}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500 text-xs font-bold uppercase text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-sidebar-foreground">{fullName ?? email ?? "Applicant"}</div>
            <div className="text-[11px] text-sidebar-foreground/50">Applicant</div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-7 w-7 place-items-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
