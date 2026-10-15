import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  CheckCircle2,
  Clock,
  CoffeeIcon,
  LogOut,
  MapPin,
  Radar,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { StatusPill } from "@/components/shared/StatusPill";
import { OfficeMap } from "@/components/shared/OfficeMap";
import { useAppState, useNow } from "@/lib/app-state";
import { currentEmployee } from "@/lib/mock-data";
import { formatClock, formatLongDate, formatShortDuration, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Today — GeoAttend Employee App" },
      {
        name: "description",
        content:
          "Employee home dashboard with live geofence status, attendance state, working hours and one-tap check-in.",
      },
      { property: "og:title", content: "Today — GeoAttend Employee App" },
      {
        property: "og:description",
        content: "Live geofence status, attendance state and one-tap check-in for employees.",
      },
    ],
  }),
  component: EmployeeHome,
});

const statusLabel: Record<string, string> = {
  "not-checked-in": "Not checked in",
  "checked-in": "Checked in",
  "on-break": "On break",
  "checked-out": "Checked out",
};

function EmployeeHome() {
  const navigate = useNavigate();
  const now = useNow();
  const {
    status,
    checkInAt,
    checkOutAt,
    breakStartedAt,
    accumulatedBreakMs,
    insideGeofence,
    distanceMeters,
  } = useAppState();

  const workedMs =
    checkInAt && now
      ? (checkOutAt ? checkOutAt.getTime() : now.getTime()) -
        checkInAt.getTime() -
        accumulatedBreakMs -
        (breakStartedAt ? now.getTime() - breakStartedAt.getTime() : 0)
      : 0;

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-medium text-muted-foreground">
          {now ? formatLongDate(now) : "Loading date…"}
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums">
          {formatClock(now)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Shift {currentEmployee.shift} · {currentEmployee.designation}
        </p>
      </section>

      <section className="card-elevated rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Geofence status</p>
          <StatusPill tone={insideGeofence ? "success" : "danger"}>
            <Radar className="size-3" aria-hidden />
            {insideGeofence ? "Inside area" : "Outside area"}
          </StatusPill>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="relative flex size-40 items-center justify-center">
            {insideGeofence && (
              <span className="absolute size-40 rounded-full bg-success/20 animate-geo-pulse" />
            )}
            <span
              className={cn(
                "absolute size-40 rounded-full border-4",
                insideGeofence ? "border-success/30" : "border-destructive/30",
              )}
            />
            <span
              className={cn(
                "flex size-30 flex-col items-center justify-center rounded-full text-center",
                insideGeofence
                  ? "bg-success/12 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              <MapPin className="size-6" aria-hidden />
              <span className="mt-1 text-xl font-extrabold tabular-nums">{distanceMeters}m</span>
              <span className="text-[10px] font-medium opacity-80">from centre</span>
            </span>
          </div>

          <p
            className={cn(
              "mt-4 rounded-lg px-3 py-2 text-center text-xs font-semibold",
              insideGeofence ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {insideGeofence
              ? "You are within the authorized 200m office area"
              : "You are outside the authorized 200m office area"}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{currentEmployee.office}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Attendance status</p>
          <div className="mt-2">
            <StatusPill
              tone={
                status === "not-checked-in"
                  ? "neutral"
                  : status === "on-break"
                    ? "warning"
                    : status === "checked-out"
                      ? "info"
                      : "success"
              }
            >
              {statusLabel[status]}
            </StatusPill>
          </div>
          <p className="mt-2.5 text-[11px] text-muted-foreground">
            Check-in {formatTime(checkInAt)}
          </p>
        </div>
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Working hours today</p>
          <p className="mt-2 text-xl font-bold tabular-nums">{formatShortDuration(workedMs)}</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Break {formatShortDuration(accumulatedBreakMs)}
          </p>
        </div>
      </section>

      <OfficeMap
        label={currentEmployee.office}
        sublabel="1 Northgate Boulevard, Central District"
        radiusMeters={200}
        active={insideGeofence}
        center={[12.9066, 80.23]}
        className="h-44"
      />

      <section className="space-y-2.5">
        {status === "not-checked-in" && (
          <div className="rounded-xl border border-dashed border-border bg-muted/60 p-4 text-center">
            <ShieldCheck className="mx-auto size-5 text-primary" aria-hidden />
            <p className="mt-2 text-xs font-semibold">Attendance runs in the background</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {insideGeofence
                ? "A device notification was sent — tap it to record your attendance."
                : "You will get a device notification when you enter the authorized 200m area."}
            </p>
          </div>
        )}

        {(status === "checked-in" || status === "on-break") && (
          <>
            <Button
              variant="secondary"
              className="h-12 w-full text-sm font-semibold"
              onClick={() => navigate({ to: "/app/break" })}
            >
              <CoffeeIcon className="size-4" aria-hidden />
              {status === "on-break" ? "Manage active break" : "Start a break"}
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full text-sm font-semibold"
              onClick={() => navigate({ to: "/app/checkout" })}
            >
              <LogOut className="size-4" aria-hidden /> Check out
            </Button>
          </>
        )}

        {status === "checked-out" && (
          <div className="rounded-xl border border-success/25 bg-success/8 p-4 text-center">
            <CheckCircle2 className="mx-auto size-6 text-success" aria-hidden />
            <p className="mt-2 text-sm font-semibold">Day completed</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Checked out at {formatTime(checkOutAt)} · {formatShortDuration(workedMs)} logged
            </p>
          </div>
        )}
      </section>

      <section className="card-elevated rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Today at a glance</p>
        <ul className="mt-3 space-y-2.5 text-xs">
          <li className="flex items-center gap-2.5 text-muted-foreground">
            <Clock className="size-4 text-primary" aria-hidden /> Shift window{" "}
            <span className="ml-auto font-semibold text-foreground">{currentEmployee.shift}</span>
          </li>
          <li className="flex items-center gap-2.5 text-muted-foreground">
            <Timer className="size-4 text-primary" aria-hidden /> Breaks taken
            <span className="ml-auto font-semibold text-foreground">
              {formatShortDuration(accumulatedBreakMs)}
            </span>
          </li>
          <li className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden /> Work location
            <span className="ml-auto font-semibold text-foreground">Northgate HQ</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
