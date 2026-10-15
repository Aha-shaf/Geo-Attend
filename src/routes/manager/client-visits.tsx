import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MapPin, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/client-visits")({
  head: () => ({
    meta: [
      { title: "Client Visit Approvals — GeoAttend Manager" },
      {
        name: "description",
        content: "Approve or reject client visit requests from team members.",
      },
      { property: "og:title", content: "Client Visit Approvals — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Manage and approve team member client visit requests.",
      },
    ],
  }),
  component: ClientVisitsScreen,
});

function ClientVisitsScreen() {
  const { teamVisits, decideVisit } = useAppState();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDecision = (id: string, status: "Approved" | "Rejected") => {
    setLoading(id);
    setTimeout(() => {
      decideVisit(id, status);
      setLoading(null);
      toast.success(`Request ${status.toLowerCase()}`);
    }, 600);
  };

  const pending = teamVisits.filter((v) => v.status === "Pending");
  const approved = teamVisits.filter((v) => v.status === "Approved");
  const rejected = teamVisits.filter((v) => v.status === "Rejected");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client visit approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve team member client visit requests.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Pending</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">{pending.length}</p>
        </div>
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Approved</p>
          <p className="mt-2 text-2xl font-bold text-success">{approved.length}</p>
        </div>
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-destructive">{rejected.length}</p>
        </div>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Pending requests</h2>
          <div className="space-y-3">
            {pending.map((visit) => (
              <div
                key={visit.id}
                className="card-elevated rounded-xl border border-border bg-card p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{visit.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {visit.employeeId} · {visit.department}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-200/50 text-orange-700">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="mt-1 font-medium">{visit.client}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date & time</p>
                    <p className="mt-1 font-medium">
                      {visit.date} {visit.time}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="mt-1 flex items-center gap-1.5 font-medium">
                      <MapPin className="size-3" aria-hidden />
                      {visit.address}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Purpose</p>
                    <p className="mt-1 text-sm">{visit.purpose}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    className="flex-1 text-sm font-semibold"
                    variant="outline"
                    onClick={() => handleDecision(visit.id, "Approved")}
                    disabled={loading === visit.id}
                  >
                    {loading === visit.id && (
                      <Loader2 className="size-3 animate-spin mr-1" aria-hidden />
                    )}
                    {loading === visit.id ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    className="flex-1 text-sm font-semibold"
                    variant="outline"
                    onClick={() => handleDecision(visit.id, "Rejected")}
                    disabled={loading === visit.id}
                  >
                    {loading === visit.id && (
                      <Loader2 className="size-3 animate-spin mr-1" aria-hidden />
                    )}
                    {loading === visit.id ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved & Rejected */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {approved.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Approved</h2>
            <div className="space-y-2">
              {approved.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3 rounded-lg bg-success/5 border border-success/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{visit.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{visit.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {visit.date} at {visit.time}
                      </p>
                    </div>
                    <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rejected.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Rejected</h2>
            <div className="space-y-2">
              {rejected.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{visit.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{visit.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {visit.date} at {visit.time}
                      </p>
                    </div>
                    <XCircle className="size-5 text-destructive shrink-0 mt-0.5" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
