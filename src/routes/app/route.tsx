import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarClock, CoffeeIcon, History, Home, UserRound } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { currentEmployee } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PushNotificationOverlay } from "@/components/shared/PushNotificationOverlay";

export const Route = createFileRoute("/app")({
  component: EmployeeShell,
});

const navItems = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/break", label: "Break", icon: CoffeeIcon },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/requests", label: "Requests", icon: CalendarClock },
  { to: "/app/profile", label: "Profile", icon: UserRound },
];

function EmployeeShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { notifications } = useAppState();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen justify-center bg-secondary py-0 sm:py-8">
      <div className="relative flex w-full max-w-[430px] flex-col overflow-hidden bg-background sm:surface-float sm:min-h-[860px] sm:rounded-[2rem] sm:border sm:border-border">
        <PushNotificationOverlay />
        <header className="bg-gradient-primary sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold">
              {currentEmployee.initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{currentEmployee.name}</p>
              <p className="text-[11px] text-primary-foreground/80">
                {currentEmployee.employeeId} · {currentEmployee.department}
              </p>
            </div>
          </div>
          <Link
            to="/app/notifications"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            className="relative flex size-10 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
          >
            <Bell className="size-4.5" aria-hidden />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
          <Outlet />
        </main>

        <nav
          aria-label="Primary"
          className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-2 pt-2 pb-3 backdrop-blur"
        >
          <ul className="flex items-center justify-between">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg transition-colors",
                        active && "bg-primary-soft",
                      )}
                    >
                      <item.icon className="size-4.5" aria-hidden />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
