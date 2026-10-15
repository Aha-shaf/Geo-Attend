import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, TrendingUp, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/manager/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — GeoAttend Manager" },
      {
        name: "description",
        content: "View system alerts for suspicious patterns and attendance anomalies.",
      },
      { property: "og:title", content: "Alerts — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Attendance and behavioral alert dashboard.",
      },
    ],
  }),
  component: AlertsScreen,
});

// Mock alerts
const alerts = [
  {
    id: "a1",
    type: "suspicious-pattern",
    severity: "high",
    title: "Suspicious check-in pattern detected",
    description: "Aarav Mehta checked in from 3 different locations within 15 minutes",
    affected: "1 employee",
    time: "Today 11:34 AM",
    details:
      "Multiple location transitions detected. Possible location spoofing or geofence calibration issue.",
  },
  {
    id: "a2",
    type: "late-arrivals",
    severity: "medium",
    title: "Repeated late arrivals alert",
    description: "Rhea Kapoor has arrived late 5 times in the past 10 days",
    affected: "1 employee",
    time: "Today 09:22 AM",
    details:
      "Pattern indicates potential schedule alignment issues. Consider discussing with employee.",
  },
  {
    id: "a3",
    type: "prolonged-absence",
    severity: "high",
    title: "Prolonged absence without notice",
    description: "Daniel Osei has not checked in for 2 days without approved leave",
    affected: "1 employee",
    time: "Yesterday 05:00 PM",
    details: "Follow up required. No matching leave request or WFH approval found.",
  },
  {
    id: "a4",
    type: "geofence-bypass",
    severity: "medium",
    title: "Geofence boundary anomaly",
    description: "Sofia Marino registered check-out while still within geofence",
    affected: "1 employee",
    time: "26 Aug 04:15 PM",
    details:
      "Employee may have manually triggered check-out while still in office. Verify with employee.",
  },
  {
    id: "a5",
    type: "system",
    severity: "low",
    title: "Location service calibration needed",
    description: "GPS variance detected at Northgate HQ location",
    affected: "1 location",
    time: "24 Aug 02:30 PM",
    details: "Geofence accuracy may need recalibration. Recommend periodic testing.",
  },
];

function AlertsScreen() {
  const highSeverity = alerts.filter((a) => a.severity === "high");
  const mediumSeverity = alerts.filter((a) => a.severity === "medium");
  const lowSeverity = alerts.filter((a) => a.severity === "low");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System alerts for attendance anomalies and suspicious patterns.
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <AlertTriangle className="size-5 text-destructive" aria-hidden />
          <p className="text-xs font-medium text-muted-foreground mt-2">High severity</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{highSeverity.length}</p>
        </div>
        <div className="card-elevated rounded-xl border border-orange-200/50 bg-orange-50/50 dark:bg-orange-950/20 p-4">
          <TrendingUp className="size-5 text-orange-600" aria-hidden />
          <p className="text-xs font-medium text-muted-foreground mt-2">Medium severity</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{mediumSeverity.length}</p>
        </div>
        <div className="card-elevated rounded-xl border border-yellow-200/50 bg-yellow-50/50 dark:bg-yellow-950/20 p-4">
          <Clock className="size-5 text-yellow-600" aria-hidden />
          <p className="text-xs font-medium text-muted-foreground mt-2">Low severity</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{lowSeverity.length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const colorMap = {
            high: {
              bg: "bg-destructive/5",
              border: "border-destructive/20",
              icon: "text-destructive",
              badge: "bg-destructive/20 text-destructive",
            },
            medium: {
              bg: "bg-orange-50/50 dark:bg-orange-950/20",
              border: "border-orange-200/50",
              icon: "text-orange-600",
              badge: "bg-orange-200/50 text-orange-700",
            },
            low: {
              bg: "bg-yellow-50/50 dark:bg-yellow-950/20",
              border: "border-yellow-200/50",
              icon: "text-yellow-600",
              badge: "bg-yellow-200/50 text-yellow-700",
            },
          };

          const colors = colorMap[alert.severity as keyof typeof colorMap];

          return (
            <div
              key={alert.id}
              className={`card-elevated rounded-xl border p-5 space-y-3 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className={`size-5 mt-0.5 shrink-0 ${colors.icon}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{alert.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
                >
                  {alert.severity === "high"
                    ? "High"
                    : alert.severity === "medium"
                      ? "Medium"
                      : "Low"}
                </span>
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">{alert.details}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-3" aria-hidden />
                  <span>{alert.affected}</span>
                </div>
                <span className="text-muted-foreground">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Alerts Empty State */}
      {alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
          <AlertTriangle className="size-8 text-muted-foreground opacity-40" aria-hidden />
          <p className="mt-3 text-sm font-semibold">No active alerts</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your team's attendance patterns look normal.
          </p>
        </div>
      )}
    </div>
  );
}
