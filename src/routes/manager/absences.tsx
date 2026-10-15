import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calendar } from "lucide-react";
import { employeeRows } from "@/lib/mock-data";

export const Route = createFileRoute("/manager/absences")({
  head: () => ({
    meta: [
      { title: "Absence Monitoring — GeoAttend Manager" },
      {
        name: "description",
        content: "Track frequent and continuous absences with alert levels.",
      },
      { property: "og:title", content: "Absence Monitoring — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Monitor employee absences and alert on unusual patterns.",
      },
    ],
  }),
  component: AbsencesScreen,
});

// Mock absence data
const frequentAbsenceEmployees = [
  {
    id: "e1",
    name: "Raj Kumar",
    employeeId: "EMP-2001",
    department: "Sales",
    absenceDays: 8,
    severity: "high",
    lastAbsence: "26 Aug",
  },
  {
    id: "e2",
    name: "Priya Singh",
    employeeId: "EMP-2045",
    department: "Support",
    absenceDays: 5,
    severity: "medium",
    lastAbsence: "23 Aug",
  },
  {
    id: "e3",
    name: "Mark Johnson",
    employeeId: "EMP-1998",
    department: "Field Operations",
    absenceDays: 3,
    severity: "low",
    lastAbsence: "21 Aug",
  },
];

const continuousAbsenceEmployees = [
  {
    id: "c1",
    name: "Neha Patel",
    employeeId: "EMP-2089",
    department: "Design",
    absenceStart: "27 Aug",
    days: 2,
    reason: "Medical leave (approved)",
  },
  {
    id: "c2",
    name: "Alex Rodriguez",
    employeeId: "EMP-1876",
    department: "Engineering",
    absenceStart: "24 Aug",
    days: 5,
    reason: "Personal leave (approved)",
  },
];

function AbsencesScreen() {
  const absentEmployees = employeeRows.filter((e) => e.status === "Absent");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Absence monitoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track frequent and continuous absences.
        </p>
      </div>

      {/* Today's Absences */}
      <div className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Today's absences</h2>
        {absentEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="size-8 text-muted-foreground opacity-40" aria-hidden />
            <p className="mt-2 text-sm font-medium">No absences reported</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {emp.employeeId} · {emp.department}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-destructive/20 text-destructive">
                  Absent
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequent Absences */}
      <div className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Frequent absence pattern</h2>
        <div className="space-y-3">
          {frequentAbsenceEmployees.map((emp) => (
            <div
              key={emp.id}
              className={`p-3 rounded-lg border ${
                emp.severity === "high"
                  ? "bg-destructive/5 border-destructive/30"
                  : emp.severity === "medium"
                    ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50"
                    : "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {emp.employeeId} · {emp.department}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full ${
                    emp.severity === "high"
                      ? "bg-destructive/20 text-destructive"
                      : emp.severity === "medium"
                        ? "bg-orange-200/50 text-orange-700"
                        : "bg-yellow-200/50 text-yellow-700"
                  }`}
                >
                  {emp.severity.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {emp.absenceDays} days in last 30 days · Last absent {emp.lastAbsence}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Absences */}
      <div className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Continuous absences</h2>
        <div className="space-y-3">
          {continuousAbsenceEmployees.map((emp) => (
            <div
              key={emp.id}
              className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {emp.employeeId} · {emp.department}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-200/50 text-blue-700">
                  {emp.days} days
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Calendar className="size-3.5 text-muted-foreground" aria-hidden />
                <span className="text-xs text-muted-foreground">
                  Started {emp.absenceStart} — {emp.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
