import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — GeoAttend Employee App" },
      {
        name: "description",
        content: "View and manage your attendance, approval, and HR notifications.",
      },
      { property: "og:title", content: "Notifications — GeoAttend Employee App" },
      {
        property: "og:description",
        content: "View your attendance, approval, and HR notifications.",
      },
    ],
  }),
  component: NotificationsScreen,
});

const typeConfig = {
  reminder: {
    icon: Bell,
    bgColor: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600",
    label: "Reminder",
  },
  approval: {
    icon: CheckCircle2,
    bgColor: "bg-success/10",
    iconColor: "text-success",
    label: "Approval",
  },
  rejection: {
    icon: X,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    label: "Rejection",
  },
  announcement: {
    icon: Bell,
    bgColor: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600",
    label: "Announcement",
  },
};

function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationsRead } = useAppState();

  if (notifications.length === 0) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => navigate({ to: "/app" })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to home
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">You're all caught up.</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
          <Bell className="size-8 text-muted-foreground opacity-40" aria-hidden />
          <p className="mt-3 text-sm font-semibold">No notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You'll see notifications here when your manager approves requests or sends
            announcements.
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/app" })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to home
        </button>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markNotificationsRead()}
            className="text-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={cn(
                "rounded-xl border border-border p-4 transition-colors",
                notification.read ? "bg-card" : "bg-card border-primary/20",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                >
                  <Icon className={`size-5 ${config.iconColor}`} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{notification.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{notification.body}</p>
                    </div>
                    {!notification.read && (
                      <div className="shrink-0">
                        <div className="size-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
