import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Fingerprint,
  Loader2,
  LockKeyhole,
  MapPinned,
  ScanFace,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — GeoAttend Attendance Suite" },
      {
        name: "description",
        content:
          "Mock sign-in for the GeoAttend geofenced attendance suite. Choose the employee mobile app or the HR manager dashboard.",
      },
      { property: "og:title", content: "Sign in — GeoAttend Attendance Suite" },
      {
        property: "og:description",
        content:
          "Mock sign-in for the GeoAttend geofenced attendance suite. Choose the employee mobile app or the HR manager dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

type Role = "employee" | "manager";

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("employee");
  const [email, setEmail] = useState("aarav.mehta@northgate.co");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || password.trim().length < 4) {
      setError("Enter a work email and a password of at least 4 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: role === "employee" ? "/app" : "/manager" });
    }, 900);
  };

  const pickRole = (next: Role) => {
    setRole(next);
    setEmail(next === "employee" ? "aarav.mehta@northgate.co" : "priya.nair@northgate.co");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="bg-gradient-primary relative hidden flex-col justify-between overflow-hidden p-12 text-primary-foreground lg:flex">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-primary-foreground/10" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <MapPinned className="size-5" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight">GeoAttend</span>
          </div>
          <h2 className="mt-16 max-w-md text-4xl leading-tight font-extrabold tracking-tight">
            Attendance that knows where work actually happens.
          </h2>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/85">
            Geofenced check-ins, liveness-checked face verification, break tracking, client visits
            and remote-work approvals — in one workforce suite.
          </p>
        </div>
        <ul className="relative space-y-4">
          {[
            { icon: MapPinned, text: "Ex: 200m office geofence with live status indicator" },
            { icon: ScanFace, text: "Face verification with liveness instructions" },
            { icon: ShieldCheck, text: "Manager approvals for visits and remote work" },
          ].map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                <f.icon className="size-4" aria-hidden />
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="bg-gradient-primary flex size-10 items-center justify-center rounded-xl text-primary-foreground">
              <MapPinned className="size-5" aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight">GeoAttend</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Sign in to continue</h1>

          <div className="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select role">
            {(
              [
                { key: "employee", icon: UserRound, title: "Employee", sub: "Mobile app" },
                { key: "manager", icon: Building2, title: "HR / Manager", sub: "Web dashboard" },
              ] as const
            ).map((r) => (
              <button
                key={r.key}
                type="button"
                role="radio"
                aria-checked={role === r.key}
                onClick={() => pickRole(r.key)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  role === r.key
                    ? "border-primary bg-primary-soft shadow-sm ring-2 ring-primary/25"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <r.icon
                  className={cn(
                    "size-5",
                    role === r.key ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                <p className="mt-2.5 text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              >
                {error}
              </p>
            )}

            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…
                </>
              ) : (
                <>
                  <Fingerprint className="size-4" aria-hidden /> Sign in as{" "}
                  {role === "employee" ? "Employee" : "HR Manager"}
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
