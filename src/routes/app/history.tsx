import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarX2, ChevronDown, Clock, CoffeeIcon, MapPin, Timer } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Attendance history — GeoAttend" },
      {
        name: "description",
        content:
          "Daily attendance history with check-in, check-out, break duration, total hours, location and status.",
      },
      { property: "og:title", content: "Attendance history — GeoAttend" },
      {
        property: "og:description",
        content: "Check-in, check-out, break duration, total hours and location per day.",
      },
    ],
  }),
  component: HistoryScreen,
});

const filters = ["All", "Present", "Late", "Absent", "Client Visit", "Work From Home"] as const;

function HistoryScreen() {
  const { history } = useAppState();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => (filter === "All" ? history : history.filter((h) => h.status === filter)),
    [history, filter],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Attendance history</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last 30 days of recorded attendance.</p>
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="No records found"
          description={`There are no "${filter}" attendance entries in the selected period.`}
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const open = openId === r.id;
            return (
              <li key={r.id} className="card-elevated rounded-xl border border-border bg-card">
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.date}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {r.checkIn} — {r.checkOut} · {r.totalHours}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusPill>{r.status}</StatusPill>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </div>
                </button>

                {open && (
                  <dl className="grid grid-cols-2 gap-3 border-t border-border p-4 text-xs">
                    <Detail icon={Clock} label="Check-in" value={r.checkIn} />
                    <Detail icon={Clock} label="Check-out" value={r.checkOut} />
                    <Detail icon={CoffeeIcon} label="Break duration" value={r.breakDuration} />
                    <Detail icon={Timer} label="Total hours" value={r.totalHours} />
                    <Detail
                      icon={MapPin}
                      label="Work location"
                      value={r.location}
                      className="col-span-2"
                    />
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-muted px-3 py-2", className)}>
      <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="size-3.5 text-primary" /> {label}
      </dt>
      <dd className="mt-0.5 text-xs font-semibold">{value}</dd>
    </div>
  );
}
