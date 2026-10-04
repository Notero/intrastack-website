"use client";

import { useState } from "react";
import { BellOff, CheckCheck, Briefcase, Info, AlertCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "./actions";

type NotifKind = "info" | "job" | "alert" | "application";

type Notification = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

const KIND_CONFIG: Record<NotifKind, { icon: React.ElementType; color: string }> = {
  info:        { icon: Info,          color: "text-blue-500" },
  job:         { icon: Briefcase,     color: "text-violet-500" },
  alert:       { icon: AlertCircle,   color: "text-red-500" },
  application: { icon: ClipboardList, color: "text-emerald-500" },
};

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function NotificationsFeed({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  async function handleClick(id: string) {
    const notif = notifications.find((n) => n.id === id);
    if (!notif || notif.read) return;
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await markNotificationReadAction(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsReadAction();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up."}
        </p>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2"
          >
            <CheckCheck className="size-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-300 py-20 text-center">
          <BellOff className="size-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => {
            const { icon: Icon, color } = KIND_CONFIG[n.kind];
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n.id)}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors",
                  n.read
                    ? "border-zinc-200 bg-white opacity-70"
                    : "border-zinc-300 bg-zinc-50 hover:border-zinc-400",
                )}
              >
                <div className={cn("mt-0.5 shrink-0", color)}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("font-medium text-sm", n.read ? "text-zinc-500" : "text-zinc-900")}>
                      {n.title}
                    </p>
                    {!n.read && <span className="inline-block size-2 shrink-0 rounded-full bg-zinc-900" />}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-zinc-400">{timeAgo(n.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
