import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Users, AlertTriangle, Home, FileText } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { employeeRows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [
      { title: "Manager Dashboard — GeoAttend" },
      {
        name: "description",
        content: "Overview of team attendance, approvals, and work-from-home requests.",
      },
      { property: "og:title", content: "Manager Dashboard — GeoAttend" },
      {
        property: "og:description",
        content: "Team attendance overview and pending approvals.",
      },
    ],
  }),
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const { teamVisits, teamWfh } = useAppState();

  const total = employeeRows.length;
  const present = employeeRows.filter((e) => e.status === "Present").length;
  const absent = employeeRows.filter((e) => e.status === "Absent").length;
  const onBreak = employeeRows.filter((e) => e.status === "On Break").length;
  const clientVisit = employeeRows.filter((e) => e.status === "Client Visit").length;
  const wfh = employeeRows.filter((e) => e.status === "Work From Home").length;
  const pendingApprovals =
    teamVisits.filter((v) => v.status === "Pending").length +
    teamWfh.filter((w) => w.status === "Pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team overview for{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard
          label="Total employees"
          value={total.toString()}
          icon={Users}
          bgColor="bg-blue-50 dark:bg-blue-950"
          iconColor="text-blue-600"
        />
        <OverviewCard
          label="Present"
          value={present.toString()}
          icon={Home}
          bgColor="bg-success/10"
          iconColor="text-success"
        />
        <OverviewCard
          label="Absent"
          value={absent.toString()}
          icon={AlertTriangle}
          bgColor="bg-destructive/10"
          iconColor="text-destructive"
        />
        <OverviewCard
          label="On break"
          value={onBreak.toString()}
          icon={Clock}
          bgColor="bg-yellow-50 dark:bg-yellow-950"
          iconColor="text-yellow-600"
        />
        <OverviewCard
          label="Client visit"
          value={clientVisit.toString()}
          icon={MapPin}
          bgColor="bg-purple-50 dark:bg-purple-950"
          iconColor="text-purple-600"
        />
        <OverviewCard
          label="Work from home"
          value={wfh.toString()}
          icon={FileText}
          bgColor="bg-teal-50 dark:bg-teal-950"
          iconColor="text-teal-600"
        />
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Pending approvals</h2>
            <span className="flex size-8 items-center justify-center rounded-full bg-destructive/20 text-sm font-bold text-destructive">
              {pendingApprovals}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {pendingApprovals === 0
              ? "All requests have been reviewed."
              : `${teamVisits.filter((v) => v.status === "Pending").length} client visits, ${teamWfh.filter((w) => w.status === "Pending").length} WFH requests`}
          </p>
          <div className="space-y-2">
            {teamVisits.filter((v) => v.status === "Pending").length > 0 && (
              <a
                href="/manager/client-visits"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <span>Client visit requests</span>
                <span className="font-semibold text-primary">
                  {teamVisits.filter((v) => v.status === "Pending").length}
                </span>
              </a>
            )}
            {teamWfh.filter((w) => w.status === "Pending").length > 0 && (
              <a
                href="/manager/wfh-approvals"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <span>WFH requests</span>
                <span className="font-semibold text-primary">
                  {teamWfh.filter((w) => w.status === "Pending").length}
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Recent activity</h2>
          <div className="space-y-3">
            {employeeRows.slice(0, 4).map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.employeeId}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold",
                    emp.status === "Present"
                      ? "bg-success/20 text-success"
                      : emp.status === "Absent"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  icon: Icon,
  bgColor,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="card-elevated rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${bgColor}`}>
          <Icon className={`size-5 ${iconColor}`} aria-hidden />
        </div>
      </div>
    </div>
  );
}
