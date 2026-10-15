import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/manager/wfh-approvals")({
  head: () => ({
    meta: [
      { title: "WFH Approvals — GeoAttend Manager" },
      {
        name: "description",
        content: "Approve or reject work-from-home requests from team members.",
      },
      { property: "og:title", content: "WFH Approvals — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Manage and approve team member WFH requests.",
      },
    ],
  }),
  component: WfhApprovalsScreen,
});

function WfhApprovalsScreen() {
  const { teamWfh, decideWfh } = useAppState();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDecision = (id: string, status: "Approved" | "Rejected") => {
    setLoading(id);
    setTimeout(() => {
      decideWfh(id, status);
      setLoading(null);
      toast.success(`Request ${status.toLowerCase()}`);
    }, 600);
  };

  const pending = teamWfh.filter((w) => w.status === "Pending");
  const approved = teamWfh.filter((w) => w.status === "Approved");
  const rejected = teamWfh.filter((w) => w.status === "Rejected");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Work from home approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve team member WFH requests.
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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending {pending.length > 0 && `(${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved {approved.length > 0 && `(${approved.length})`}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected {rejected.length > 0 && `(${rejected.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-8 text-muted-foreground opacity-40" aria-hidden />
              <p className="mt-2 text-sm font-medium">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((wfh) => (
                <div
                  key={wfh.id}
                  className="card-elevated rounded-xl border border-border bg-card p-5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{wfh.employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {wfh.employeeId} · {wfh.department}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-200/50 text-orange-700">
                      Pending
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="mt-1 font-medium">{wfh.date}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="mt-1 text-sm">{wfh.reason}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      className="flex-1 text-sm font-semibold"
                      variant="outline"
                      onClick={() => handleDecision(wfh.id, "Approved")}
                      disabled={loading === wfh.id}
                    >
                      {loading === wfh.id && (
                        <Loader2 className="size-3 animate-spin mr-1" aria-hidden />
                      )}
                      {loading === wfh.id ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      className="flex-1 text-sm font-semibold"
                      variant="outline"
                      onClick={() => handleDecision(wfh.id, "Rejected")}
                      disabled={loading === wfh.id}
                    >
                      {loading === wfh.id && (
                        <Loader2 className="size-3 animate-spin mr-1" aria-hidden />
                      )}
                      {loading === wfh.id ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-8 text-muted-foreground opacity-40" aria-hidden />
              <p className="mt-2 text-sm font-medium">No approved requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {approved.map((wfh) => (
                <div key={wfh.id} className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{wfh.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{wfh.employeeId}</p>
                      <p className="text-xs text-muted-foreground mt-1">{wfh.date}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {wfh.reason}
                      </p>
                    </div>
                    <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <XCircle className="size-8 text-muted-foreground opacity-40" aria-hidden />
              <p className="mt-2 text-sm font-medium">No rejected requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rejected.map((wfh) => (
                <div
                  key={wfh.id}
                  className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{wfh.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{wfh.employeeId}</p>
                      <p className="text-xs text-muted-foreground mt-1">{wfh.date}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {wfh.reason}
                      </p>
                    </div>
                    <XCircle className="size-5 text-destructive shrink-0 mt-0.5" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
