"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, History, Briefcase, FilePlus, User, LogOut, ArrowLeft, CalendarClock, Users, Bell } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOutAction } from "../../actions";

const NAV = [
  {
    group: null,
    items: [{ href: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Tickets",
    items: [
      { href: "/customer/tickets", label: "All Tickets", icon: Ticket },
      { href: "/customer/ticket_history", label: "History", icon: History },
    ],
  },
  {
    group: "Jobs",
    items: [
      { href: "/customer/my_job_listings", label: "My Listings", icon: Briefcase },
      { href: "/customer/list_job", label: "List a Job", icon: FilePlus },
    ],
  },
  {
    group: "Meetings",
    items: [{ href: "/customer/meetings", label: "Meetings", icon: CalendarClock }],
  },
  {
    group: "Employees",
    items: [{ href: "/customer/employees", label: "Employees", icon: Users }],
  },
  {
    group: null,
    items: [
      { href: "/customer/notifications", label: "Notifications", icon: Bell },
      { href: "/customer/profile", label: "Profile", icon: User },
    ],
  },
] as const;

interface Props {
  email: string | null;
  fullName: string | null;
  isAdmin?: boolean;
  unreadCount?: number;
}

export function CustomerSidebar({ email, fullName, isAdmin, unreadCount = 0 }: Props) {
  const pathname = usePathname();
  const initials = (fullName ?? email ?? "R").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="none" className="border-r-0">
      {/* Admin back banner — only visible when an admin is viewing this dashboard */}
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 bg-brand-500/20 px-4 py-2.5 text-xs font-semibold text-brand-500 transition-colors hover:bg-brand-500/30"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          Back to Admin Dashboard
        </Link>
      )}

      {/* Logo */}
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4 py-0">
        <Link href="/customer/dashboard" aria-label="Intrastack customer home">
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

      {/* Nav */}
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
                            {item.href === "/customer/notifications" && unreadCount > 0 && (
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

      {/* User footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500 text-xs font-bold uppercase text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-sidebar-foreground">{fullName ?? email ?? "Customer"}</div>
            <div className="text-[11px] text-sidebar-foreground/50">Customer</div>
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
