import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CoffeeIcon,
  LogOut,
  MapPin,
  ScanFace,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/StatusPill";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppState, useNow } from "@/lib/app-state";
import { formatShortDuration, formatTime } from "@/lib/format";

export const Route = createFileRoute("/app/checkout")({
  head: () => ({
    meta: [
      { title: "Check out — GeoAttend" },
      {
        name: "description",
        content:
          "Confirm your check-out with today's worked hours, break duration and location summary.",
      },
      { property: "og:title", content: "Check out — GeoAttend" },
      {
        property: "og:description",
        content: "Confirm check-out with worked hours, break duration and location summary.",
      },
    ],
  }),
  component: CheckoutScreen,
});

function CheckoutScreen() {
  const navigate = useNavigate();
  const now = useNow();
  const {
    checkInAt,
    checkOutAt,
    accumulatedBreakMs,
    breakStartedAt,
    status,
    checkOut,
    insideGeofence,
    activeLocation,
    distanceMeters,
  } = useAppState();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const workedMs =
    checkInAt && now
      ? (checkOutAt ? checkOutAt.getTime() : now.getTime()) -
        checkInAt.getTime() -
        accumulatedBreakMs -
        (breakStartedAt ? now.getTime() - breakStartedAt.getTime() : 0)
      : 0;

  const done = status === "checked-out";

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate({ to: "/app" })}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> Back to home
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">
          {done ? "Checked out" : "Check-out confirmation"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {done
            ? "Your working day has been recorded."
            : "Review today's summary before ending your working day."}
        </p>
      </div>

      <div className="card-elevated space-y-3 rounded-2xl border border-border bg-card p-5">
        <Row icon={Clock} label="Check-in time" value={formatTime(checkInAt)} />
        <Row
          icon={LogOut}
          label="Check-out time"
          value={done ? formatTime(checkOutAt) : formatTime(now)}
        />
        <Row
          icon={CoffeeIcon}
          label="Break duration"
          value={formatShortDuration(accumulatedBreakMs)}
        />
        <Row icon={Timer} label="Total working hours" value={formatShortDuration(workedMs)} />
      </div>

      {done ? (
        <>
          <div className="rounded-xl border border-success/25 bg-success/8 p-5 text-center">
            <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden />
            <p className="mt-3 text-lg font-bold">Attendance closed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your working day has been recorded successfully.
            </p>
          </div>

          <div className="card-elevated space-y-3 rounded-2xl border border-border bg-card p-5">
            <Row icon={ScanFace} label="Face verification" value="Verified" tone="success" />
            <Row icon={MapPin} label="Location" value={activeLocation} tone="success" />
            <Row
              icon={ShieldCheck}
              label="Geofence status"
              value={insideGeofence ? "Inside area" : "Outside area"}
              tone={insideGeofence ? "success" : "danger"}
            />
          </div>

          <div className="card-elevated space-y-3 rounded-2xl border border-border bg-card p-5">
            <Row icon={Clock} label="Working hours" value={formatShortDuration(workedMs)} />
            <Row
              icon={CoffeeIcon}
              label="Break duration"
              value={formatShortDuration(accumulatedBreakMs)}
            />
            <Row
              icon={Timer}
              label="Total day hours"
              value={formatShortDuration(workedMs + accumulatedBreakMs)}
            />
          </div>

          <Button
            className="h-12 w-full text-sm font-semibold"
            onClick={() => navigate({ to: "/app/history" })}
          >
            View attendance history
          </Button>
        </>
      ) : (
        <Button
          className="h-12 w-full text-sm font-semibold"
          disabled={!checkInAt || loading}
          onClick={() => setConfirm(true)}
        >
          <LogOut className="size-4" aria-hidden /> Confirm check-out
        </Button>
      )}

      {!checkInAt && !done && (
        <p className="text-center text-xs text-muted-foreground">
          You have not checked in yet today.
        </p>
      )}

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>End your working day?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be checked out at {formatTime(now)} with {formatShortDuration(workedMs)} of
              recorded working time. This cannot be undone from the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  checkOut();
                  setLoading(false);
                  toast.success("Checked out successfully");
                }, 700);
              }}
            >
              Yes, check out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
}) {
  const colorMap = {
    default: "text-primary",
    success: "text-success",
    danger: "text-destructive",
  };

  return (
    <div className="flex items-center justify-between border-b border-border pb-3 text-xs last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`size-4 ${colorMap[tone]}`} /> {label}
      </span>
      <span className={`font-semibold tabular-nums ${colorMap[tone]}`}>{value}</span>
    </div>
  );
}
