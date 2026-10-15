import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Home,
  MapPin,
  Settings,
  Users,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { currentManager } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager")({
  component: ManagerShell,
});

const navItems = [
  { to: "/manager", label: "Overview", icon: Home, exact: true },
  { to: "/manager/attendance", label: "Attendance", icon: Clock },
  { to: "/manager/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/manager/absences", label: "Absences", icon: AlertTriangle },
  { to: "/manager/client-visits", label: "Client Visits", icon: MapPin },
  { to: "/manager/wfh-approvals", label: "WFH Approvals", icon: FileText },
  { to: "/manager/locations", label: "Locations", icon: MapPin },
  { to: "/manager/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/manager/profile", label: "Settings", icon: Settings },
];

function ManagerShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { teamVisits, teamWfh } = useAppState();

  const pendingVisits = teamVisits.filter((v) => v.status === "Pending").length;
  const pendingWfh = teamWfh.filter((w) => w.status === "Pending").length;

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {currentManager.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentManager.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">Manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    <span>{item.label}</span>
                    {item.label === "Client Visits" && pendingVisits > 0 && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {pendingVisits}
                      </span>
                    )}
                    {item.label === "WFH Approvals" && pendingWfh > 0 && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {pendingWfh}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="flex-1 flex flex-col md:hidden">
        <header className="bg-gradient-primary sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold">
              {currentManager.initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{currentManager.name}</p>
              <p className="text-[11px] text-primary-foreground/80">Manager</p>
            </div>
          </div>
        </header>

        <nav
          aria-label="Primary"
          className="border-t border-border bg-card/95 px-2 py-2 backdrop-blur overflow-x-auto"
        >
          <ul className="flex gap-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <item.icon className="size-4" aria-hidden />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

      {/* Desktop main */}
      <main className="hidden md:flex md:flex-1 md:flex-col md:overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
