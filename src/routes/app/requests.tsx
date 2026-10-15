import { Link, createFileRoute } from "@tanstack/react-router";
import { Briefcase, CalendarPlus, House, Inbox, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusPill } from "@/components/shared/StatusPill";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/app/requests")({
  head: () => ({
    meta: [
      { title: "My requests — GeoAttend" },
      {
        name: "description",
        content:
          "Track client visit and work-from-home requests with pending, approved and rejected statuses.",
      },
      { property: "og:title", content: "My requests — GeoAttend" },
      {
        property: "og:description",
        content: "Client visit and work-from-home request statuses in one place.",
      },
    ],
  }),
  component: RequestsScreen,
});

function RequestsScreen() {
  const { visits, wfh } = useAppState();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">My requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Client visits and remote-work approvals.
        </p>
      </div>

      <Tabs defaultValue="visits">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visits">Client visits</TabsTrigger>
          <TabsTrigger value="wfh">Work from home</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4 space-y-3">
          <Button asChild className="h-11 w-full text-sm font-semibold">
            <Link to="/app/client-visit">
              <Plus className="size-4" aria-hidden /> New client visit request
            </Link>
          </Button>

          {visits.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No client visit requests"
              description="Submit a request to get a temporary geofence at the client site."
            />
          ) : (
            visits.map((v) => (
              <article
                key={v.id}
                className="card-elevated rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{v.client}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                      <MapPin className="size-3" aria-hidden /> {v.address}
                    </p>
                  </div>
                  <StatusPill>{v.status}</StatusPill>
                </div>

                <p className="mt-2.5 text-xs text-muted-foreground">{v.purpose}</p>

                <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                  <CalendarPlus className="size-3.5 text-primary" aria-hidden /> {v.date} · {v.time}
                </div>

                {v.status === "Approved" && (
                  <MapPlaceholder
                    label={v.client}
                    sublabel="Temporary geofence active on visit day"
                    radius="200m temp geofence"
                    className="mt-3 h-36"
                  />
                )}
                {v.status === "Rejected" && (
                  <p className="mt-3 rounded-lg bg-destructive/8 px-3 py-2 text-[11px] font-medium text-destructive">
                    Rejected by Priya Nair — overlapping with a scheduled maintenance window.
                  </p>
                )}
                {v.status === "Pending" && (
                  <p className="mt-3 rounded-lg bg-warning/12 px-3 py-2 text-[11px] font-medium text-warning-foreground">
                    Awaiting manager approval — a temporary geofence is created once approved.
                  </p>
                )}
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="wfh" className="mt-4 space-y-3">
          <Button asChild className="h-11 w-full text-sm font-semibold">
            <Link to="/app/wfh">
              <Plus className="size-4" aria-hidden /> New work from home request
            </Link>
          </Button>

          {wfh.length === 0 ? (
            <EmptyState
              icon={House}
              title="No remote-work requests"
              description="Request a work-from-home day and track its approval status here."
            />
          ) : (
            wfh.map((w) => (
              <article
                key={w.id}
                className="card-elevated rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{w.date}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Briefcase className="size-3" aria-hidden /> {w.department}
                    </p>
                  </div>
                  <StatusPill>{w.status}</StatusPill>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground">{w.reason}</p>
              </article>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
