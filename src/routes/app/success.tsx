import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock, MapPin, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState } from "@/lib/app-state";
import { currentEmployee } from "@/lib/mock-data";
import { formatLongDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/app/success")({
  head: () => ({
    meta: [
      { title: "Check-in recorded — GeoAttend" },
      {
        name: "description",
        content:
          "Check-in success screen with timestamp, geofence location status and face verification result.",
      },
      { property: "og:title", content: "Check-in recorded — GeoAttend" },
      {
        property: "og:description",
        content: "Timestamp, location status and face verification result for your check-in.",
      },
    ],
  }),
  component: SuccessScreen,
});

function SuccessScreen() {
  const navigate = useNavigate();
  const { checkInAt } = useAppState();

  return (
    <div className="flex min-h-[70vh] flex-col justify-center space-y-6 text-center">
      <div>
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckCircle2 className="size-10" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Check-in recorded</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {formatLongDate(checkInAt)} · your attendance is now active.
        </p>
      </div>

      <div className="card-elevated space-y-3 rounded-2xl border border-border bg-card p-5 text-left">
        <Row
          icon={<Clock className="size-4 text-primary" aria-hidden />}
          label="Check-in timestamp"
          value={formatTime(checkInAt)}
        />
        <Row
          icon={<MapPin className="size-4 text-primary" aria-hidden />}
          label="Location status"
          value={<StatusPill tone="success">Inside 200m geofence</StatusPill>}
        />
        <Row
          icon={<ScanFace className="size-4 text-primary" aria-hidden />}
          label="Face verification"
          value={<StatusPill tone="success">Verified · liveness passed</StatusPill>}
        />
        <Row
          icon={<MapPin className="size-4 text-primary" aria-hidden />}
          label="Work location"
          value={currentEmployee.office}
        />
      </div>

      <div className="space-y-2.5">
        <Button
          className="h-12 w-full text-sm font-semibold"
          onClick={() => navigate({ to: "/app" })}
        >
          Go to dashboard
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full text-sm"
          onClick={() => navigate({ to: "/app/history" })}
        >
          View attendance history
        </Button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-right text-xs font-semibold">{value}</span>
    </div>
  );
}
