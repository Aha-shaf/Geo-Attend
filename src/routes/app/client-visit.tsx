import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/lib/app-state";
import { currentEmployee, clientOptions } from "@/lib/mock-data";

export const Route = createFileRoute("/app/client-visit")({
  head: () => ({
    meta: [
      { title: "New client visit request — GeoAttend" },
      {
        name: "description",
        content: "Submit a client visit request with client, date, time and purpose.",
      },
      { property: "og:title", content: "New client visit request — GeoAttend" },
      {
        property: "og:description",
        content: "Submit a client visit request for manager approval.",
      },
    ],
  }),
  component: ClientVisitScreen,
});

function ClientVisitScreen() {
  const navigate = useNavigate();
  const { addVisit } = useAppState();

  const [clientId, setClientId] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedClientName =
    clientOptions.find((c) => c.id === clientId)?.name || "Selected client";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!clientId) {
      newErrors["client"] = "Please select a client";
    }
    if (!date) {
      newErrors["date"] = "Visit date is required";
    }
    if (!time) {
      newErrors["time"] = "Visit time is required";
    }
    if (!purpose || purpose.trim().length < 10) {
      newErrors["purpose"] = "Please provide a purpose (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      const selectedClient = clientOptions.find((c) => c.id === clientId);

      addVisit({
        employeeName: currentEmployee.name,
        employeeId: currentEmployee.employeeId,
        department: currentEmployee.department,
        client: selectedClient?.name || "Unknown Client",
        address: address || selectedClient?.address || "",
        date,
        time,
        purpose: purpose.trim(),
      });

      setLoading(false);
      toast.success("Client visit request submitted");
      navigate({ to: "/app/requests" });
    }, 800);
  };

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate({ to: "/app/requests" })}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> Back to requests
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">New client visit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request approval to visit a client site.
        </p>
      </div>

      <div className="space-y-4">
        {/* Client Selection */}
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select
            value={clientId}
            onValueChange={(v) => {
              setClientId(v);
              const selected = clientOptions.find((c) => c.id === v);
              if (selected) {
                setAddress(selected.address);
                setErrors((prev) => ({ ...prev, client: "" }));
              }
            }}
          >
            <SelectTrigger id="client" className={errors["client"] ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clientOptions.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-muted-foreground" aria-hidden />
                    {client.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors["client"] && <p className="text-xs text-destructive">{errors["client"]}</p>}
        </div>

        {/* Address (auto-filled but editable) */}
        <div className="space-y-2">
          <Label htmlFor="address">Location</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Client address"
            className="text-sm"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors["date"] ? "border-destructive" : ""}
            />
            {errors["date"] && <p className="text-xs text-destructive">{errors["date"]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={errors["time"] ? "border-destructive" : ""}
            />
            {errors["time"] && <p className="text-xs text-destructive">{errors["time"]}</p>}
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            placeholder="Why are you visiting this client? (e.g., maintenance, audit, meeting)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={`min-h-24 resize-none ${errors["purpose"] ? "border-destructive" : ""}`}
          />
          <div className="flex justify-between">
            <p className="text-xs">{errors["purpose"] || purpose.length + " characters"}</p>
            {errors["purpose"] && <p className="text-xs text-destructive">{errors["purpose"]}</p>}
          </div>
        </div>

        {/* Summary card */}
        {clientId && date && time && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Request summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" aria-hidden />
                <span className="font-medium">{selectedClientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-primary" aria-hidden />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-primary" aria-hidden />
                <span className="font-medium">{time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">
            {" "}
            💡 Tip: Include specific details about your visit purpose. Managers are more likely to
            approve requests with clear explanations.
          </p>
        </div>
      </div>

      <Button
        className="h-12 w-full text-sm font-semibold"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading && <Plus className="size-4 animate-spin" aria-hidden />}
        {loading ? "Submitting..." : "Submit request"}
      </Button>
    </div>
  );
}
