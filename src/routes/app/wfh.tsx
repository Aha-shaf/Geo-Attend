import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState } from "@/lib/app-state";
import { currentEmployee, type WfhRequest } from "@/lib/mock-data";

export const Route = createFileRoute("/app/wfh")({
  head: () => ({
    meta: [
      { title: "Work from home request — GeoAttend Employee App" },
      {
        name: "description",
        content: "Submit a work from home (WFH) request with date and reason.",
      },
      { property: "og:title", content: "Work from home request — GeoAttend Employee App" },
      {
        property: "og:description",
        content: "Submit a work from home request with date and reason.",
      },
    ],
  }),
  component: WfhScreen,
});

type ViewState = "form" | "status";

type WfhErrors = { date?: string; reason?: string };

function WfhScreen() {
  const navigate = useNavigate();
  const { addWfh, wfh } = useAppState();

  const [viewState, setViewState] = useState<ViewState>("form");
  const [wfhDate, setWfhDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<WfhErrors>({});
  const [submittedRequest, setSubmittedRequest] = useState<Omit<
    WfhRequest,
    "id" | "status"
  > | null>(null);

  const validateForm = () => {
    const newErrors: WfhErrors = {};

    if (!wfhDate) {
      newErrors.date = "WFH date is required";
    }
    if (!reason || reason.trim().length < 10) {
      newErrors.reason = "Please provide a reason (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      const newRequest = {
        employeeName: currentEmployee.name,
        employeeId: currentEmployee.employeeId,
        department: currentEmployee.department,
        date: wfhDate,
        reason: reason.trim(),
      };

      addWfh(newRequest);
      setSubmittedRequest(newRequest);
      setViewState("status");
      setLoading(false);
      toast.success("WFH request submitted");
    }, 800);
  };

  if (viewState === "status") {
    return (
      <div className="space-y-5">
        <button
          onClick={() => navigate({ to: "/app/requests" })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to requests
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight">Request submitted</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your work from home request has been sent for approval.
          </p>
        </div>

        <div className="rounded-xl border border-success/25 bg-success/8 p-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="size-6 text-success" aria-hidden />
          </div>
          <p className="mt-3 text-sm font-semibold">Awaiting approval</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You will receive a notification once your manager reviews the request.
          </p>
        </div>

        <div className="card-elevated space-y-3 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold">{submittedRequest?.date}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-muted-foreground">Reason</span>
            <span className="text-right font-semibold text-xs">
              {submittedRequest?.reason.substring(0, 30)}...
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-muted-foreground">Status</span>
            <StatusPill tone="warning">Pending</StatusPill>
          </div>
        </div>

        <Button
          className="h-12 w-full text-sm font-semibold"
          onClick={() => navigate({ to: "/app/requests" })}
        >
          View all requests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate({ to: "/app/requests" })}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> Back to requests
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Work from home</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit a request to work from home on a specific date.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wfh-date">Date</Label>
          <Input
            id="wfh-date"
            type="date"
            value={wfhDate}
            onChange={(e) => setWfhDate(e.target.value)}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="Why do you need to work from home today?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`min-h-24 resize-none ${errors.reason ? "border-destructive" : ""}`}
          />
          <div className="flex justify-between">
            <p
              className={`text-xs ${errors.reason ? "text-destructive" : "text-muted-foreground"}`}
            >
              {errors.reason || `${reason.length} characters`}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">
            💡 Tip: Be specific about your reason. Managers are more likely to approve requests with
            clear explanations.
          </p>
        </div>
      </div>

      <Button
        className="h-12 w-full text-sm font-semibold"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {loading ? "Submitting..." : "Submit request"}
      </Button>
    </div>
  );
}
