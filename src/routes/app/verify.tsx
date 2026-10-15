import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CameraOff,
  CheckCircle2,
  Eye,
  Glasses,
  LogIn,
  LogOut,
  MapPin,
  ScanFace,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type Mode = "checkin" | "checkout";

export const Route = createFileRoute("/app/verify")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "checkout" ? "checkout" : "checkin",
  }),
  head: () => ({
    meta: [
      { title: "Attendance verification — GeoAttend" },
      {
        name: "description",
        content:
          "Geofence confirmation and simulated liveness face verification before attendance is recorded.",
      },
      { property: "og:title", content: "Attendance verification — GeoAttend" },
      {
        property: "og:description",
        content: "Confirm your authorized location and verify your identity to mark attendance.",
      },
    ],
  }),
  component: VerifyScreen,
});

type Step = "location" | "confirm" | "scanning" | "error";

const stages = ["Detecting face", "Performing liveness check", "Verifying identity"];

const guidelines = [
  { icon: UserRound, text: "Keep your face inside the frame." },
  { icon: Eye, text: "Look directly at the camera." },
  { icon: Sun, text: "Ensure sufficient lighting." },
  { icon: Glasses, text: "Remove mask, sunglasses or face obstructions." },
  { icon: ScanFace, text: "Blink twice or turn your head slightly for liveness verification." },
];

function VerifyScreen() {
  const navigate = useNavigate();
  const { mode } = Route.useSearch();
  const { checkIn, checkOut, activeLocation, distanceMeters, insideGeofence } = useAppState();
  const [step, setStep] = useState<Step>("location");
  const [progress, setProgress] = useState(0);
  const [failNext, setFailNext] = useState(false);

  const isCheckout = mode === "checkout";

  useEffect(() => {
    if (step !== "scanning") return;
    const timer = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 4)), 70);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "scanning" || progress < 100) return;
    const t = setTimeout(() => {
      if (failNext) {
        setStep("error");
        setProgress(0);
      } else if (isCheckout) {
        checkOut();
        navigate({ to: "/app/checkout" });
      } else {
        checkIn();
        navigate({ to: "/app/success" });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [step, progress, failNext, isCheckout, checkIn, checkOut, navigate]);

  const activeStage = Math.min(stages.length - 1, Math.floor(progress / 34));

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
          {isCheckout ? "Check-out verification" : "Attendance verification"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isCheckout
            ? "Verify your identity to complete today's check-out."
            : "Confirm your authorized location and verify your identity."}
        </p>
      </div>

      {/* Step 1 — authorized location + geofence status */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground">Authorized location</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{activeLocation}</span>
            </p>
          </div>
          <StatusPill tone={insideGeofence ? "success" : "danger"}>{distanceMeters}m</StatusPill>
        </div>
        <p
          className={cn(
            "mt-3 rounded-lg px-3 py-2 text-xs font-semibold",
            insideGeofence ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {insideGeofence
            ? "You are within the 200m authorized geofence"
            : "You are outside the 200m authorized geofence"}
        </p>
      </section>

      {/* Step 2 — Check In / Check Out call to action */}
      {step === "location" && (
        <Button className="h-12 w-full text-sm font-semibold" onClick={() => setStep("confirm")}>
          {isCheckout ? (
            <>
              <LogOut className="size-4" aria-hidden /> Check Out
            </>
          ) : (
            <>
              <LogIn className="size-4" aria-hidden /> Check In
            </>
          )}
        </Button>
      )}

      {/* Step 3 — identity confirmation */}
      {step === "confirm" && (
        <section className="card-elevated rounded-2xl border border-border bg-card p-5 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <p className="mt-3 text-base font-bold">Are you ready to verify your identity?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A short face scan with a liveness check records your{" "}
            {isCheckout ? "check-out" : "check-in"} at {activeLocation}.
          </p>
          <Button
            className="mt-4 h-12 w-full text-sm font-semibold"
            onClick={() => {
              setProgress(0);
              setFailNext(false);
              setStep("scanning");
            }}
          >
            <ScanFace className="size-4" aria-hidden /> Start Face Verification
          </Button>
          <Button
            variant="ghost"
            className="mt-2 h-10 w-full text-xs"
            onClick={() => setStep("location")}
          >
            Not now
          </Button>
        </section>
      )}

      {/* Steps 5–7 — camera preview, guidelines and progress */}
      {(step === "scanning" || step === "error") && (
        <>
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-border bg-secondary-foreground/90">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground/60">
              <CameraOff className="size-6" aria-hidden />
              <p className="mt-2 text-[11px] font-medium">Camera preview placeholder</p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  "h-64 w-48 rounded-[50%] border-2 border-dashed transition-colors",
                  step === "error" ? "border-destructive" : "border-success",
                )}
              />
            </div>

            {step === "scanning" && (
              <div className="absolute inset-x-8 h-0.5 animate-scan-line bg-success/80 shadow-[0_0_16px_2px_var(--success)]" />
            )}

            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-background/92 px-3 py-2.5 text-center backdrop-blur">
              <p className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                <Eye className="size-3.5 text-primary" aria-hidden /> Blink twice and look straight
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Keep your device at eye level in good light
              </p>
            </div>
          </div>

          <ul className="card-elevated space-y-2 rounded-xl border border-border bg-card p-4">
            {guidelines.map((g) => (
              <li key={g.text} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <g.icon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                {g.text}
              </li>
            ))}
          </ul>
        </>
      )}

      {step === "scanning" && (
        <div className="card-elevated rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>{stages[activeStage]}</span>
            <span className="tabular-nums text-muted-foreground">{Math.min(progress, 100)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="mt-2.5 h-2" />
          <ul className="mt-3 space-y-1.5">
            {stages.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "flex items-center gap-2 text-[11px]",
                  i <= activeStage ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {i < activeStage ? (
                  <CheckCircle2 className="size-3.5 text-success" aria-hidden />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      i === activeStage ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === "error" && (
        <>
          <div
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/8 p-4 text-center"
          >
            <ShieldAlert className="mx-auto size-6 text-destructive" aria-hidden />
            <p className="mt-2 text-sm font-semibold">Verification failed</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Liveness check timed out. Make sure your face is fully inside the outline and try
              again.
            </p>
          </div>
          <Button
            className="h-12 w-full text-sm font-semibold"
            onClick={() => {
              setProgress(0);
              setFailNext(false);
              setStep("scanning");
            }}
          >
            <ScanFace className="size-4" aria-hidden /> Retry verification
          </Button>
        </>
      )}

      {step !== "scanning" && (
        <Button
          variant="ghost"
          className="h-10 w-full text-xs"
          onClick={() => {
            setProgress(0);
            setFailNext(true);
            setStep("scanning");
          }}
        >
          <Sparkles className="size-3.5" aria-hidden /> Simulate a failed scan
        </Button>
      )}
    </div>
  );
}
