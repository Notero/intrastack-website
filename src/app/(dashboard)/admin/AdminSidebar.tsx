"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase, LayoutDashboard, LogOut, Newspaper,
  Settings, Users, Ticket, UserCheck, ChevronUp,
  User, BriefcaseBusiness, Inbox, UserSquare2, Users2, FileText, ClipboardList,ShieldCheck,
  CalendarClock
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "../actions";

const NAV = [
  {
    group: null,
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Platform",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/customers", label: "Customers", icon: UserCheck },
      { href: "/admin/tickets", label: "Tickets", icon: Ticket },
      { href: "/admin/audit-log", label: "Audit Log", icon: ShieldCheck },
      { href: "/admin/talent", label: "Applications", icon: ClipboardList },
      { href: "/admin/meetings", label: "Meetings", icon: CalendarClock },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/news", label: "Manage News", icon: Newspaper },
      { href: "/admin/jobs", label: "Manage Jobs", icon: Briefcase },
      { href: "/admin/leadership", label: "Manage Leadership", icon: UserSquare2 },
      { href: "/admin/advisors", label: "Manage Advisors", icon: Users2 },
      { href: "/admin/hire-docs", label: "Hire Docs", icon: FileText },
      { href: "/admin/leads", label: "Leads", icon: Inbox },
    ],
  },
  {
    group: null,
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
] as const;

const VIEW_AS = [
  { href: "/customer/dashboard", label: "Customer", icon: BriefcaseBusiness },
  { href: "/applicant/dashboard", label: "Applicant", icon: User },
] as const;

interface Props {
  email: string | null;
}

export function AdminSidebar({ email }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = (email ?? "A").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="none" className="border-r-0">
      {/* Logo */}
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4 py-0">
        <Link href="/admin" aria-label="Intrastack admin home">
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

      {/* Footer */}
      <SidebarFooter className="gap-1 border-t border-sidebar-border">

        {/* View As dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <span>Switch dashboard view</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              View As
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {VIEW_AS.map((v) => (
              <DropdownMenuItem key={v.href} onClick={() => router.push(v.href)} className="gap-2 text-sm">
                <v.icon className="h-4 w-4 text-muted-foreground" />
                {v.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User row */}
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500 text-xs font-bold uppercase text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-sidebar-foreground">{email ?? "Admin"}</div>
            <div className="text-[11px] text-sidebar-foreground/50">Platform Admin</div>
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