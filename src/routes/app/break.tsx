import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CoffeeIcon, Pause, Play, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState, useNow } from "@/lib/app-state";
import { formatDuration, formatShortDuration } from "@/lib/format";

export const Route = createFileRoute("/app/break")({
  head: () => ({
    meta: [
      { title: "Breaks — GeoAttend Employee App" },
      {
        name: "description",
        content: "Start and end breaks with a live break timer and running working-hours counter.",
      },
      { property: "og:title", content: "Breaks — GeoAttend Employee App" },
      {
        property: "og:description",
        content: "Live break timer and running working-hours counter for the day.",
      },
    ],
  }),
  component: BreakScreen,
});

const BREAK_ALLOWANCE_MS = 60 * 60 * 1000;

function BreakScreen() {
  const navigate = useNavigate();
  const now = useNow();
  const {
    status,
    checkInAt,
    checkOutAt,
    breakStartedAt,
    accumulatedBreakMs,
    startBreak,
    endBreak,
  } = useAppState();

  const activeBreakMs = breakStartedAt && now ? now.getTime() - breakStartedAt.getTime() : 0;
  const totalBreakMs = accumulatedBreakMs + activeBreakMs;
  const workedMs =
    checkInAt && now
      ? (checkOutAt ? checkOutAt.getTime() : now.getTime()) - checkInAt.getTime() - totalBreakMs
      : 0;

  if (!checkInAt) {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold tracking-tight">Break management</h1>
        <EmptyState
          icon={CoffeeIcon}
          title="No active working session"
          description="Check in from the home dashboard to start tracking breaks and working hours."
          action={<Button onClick={() => navigate({ to: "/app" })}>Go to check-in</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Break management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track pauses within your shift.</p>
        </div>
        <StatusPill tone={status === "on-break" ? "warning" : "success"}>
          {status === "on-break"
            ? "On break"
            : status === "checked-out"
              ? "Checked out"
              : "Working"}
        </StatusPill>
      </div>

      <section className="card-elevated rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          {status === "on-break" ? "Current break" : "Break time used today"}
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight tabular-nums">
          {formatDuration(status === "on-break" ? activeBreakMs : totalBreakMs)}
        </p>
        <Progress
          value={Math.min(100, (totalBreakMs / BREAK_ALLOWANCE_MS) * 100)}
          className="mt-4 h-2"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          {formatShortDuration(totalBreakMs)} of the 1h daily break allowance used
        </p>

        <div className="mt-5">
          {status === "on-break" ? (
            <Button
              className="h-12 w-full text-sm font-semibold"
              onClick={() => {
                endBreak();
                toast.success("Break ended — clock resumed");
              }}
            >
              <Play className="size-4" aria-hidden /> End break
            </Button>
          ) : (
            <Button
              className="h-12 w-full text-sm font-semibold"
              disabled={status !== "checked-in"}
              onClick={() => {
                startBreak();
                toast.info("Break started");
              }}
            >
              <Pause className="size-4" aria-hidden /> Start break
            </Button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Timer className="size-3.5 text-primary" aria-hidden /> Working hours
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums">{formatDuration(workedMs)}</p>
        </div>
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <CoffeeIcon className="size-3.5 text-primary" aria-hidden /> Total breaks
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums">{formatShortDuration(totalBreakMs)}</p>
        </div>
      </section>

      <section className="card-elevated rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Break policy</p>
        <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
          <li>· Up to 60 minutes of total break time per shift.</li>
          <li>· Breaks longer than 45 minutes are flagged to your manager.</li>
          <li>· You must stay inside the office geofence during a break.</li>
        </ul>
      </section>
    </div>
  );
}
