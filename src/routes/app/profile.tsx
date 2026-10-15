import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, Lock, LogOut, MapPin, Radar, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { StatusPill } from "@/components/shared/StatusPill";
import { useAppState } from "@/lib/app-state";
import { currentEmployee } from "@/lib/mock-data";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — GeoAttend Employee App" },
      {
        name: "description",
        content: "Manage your profile, location permissions, notifications and privacy settings.",
      },
      { property: "og:title", content: "Profile & Settings — GeoAttend Employee App" },
      {
        property: "og:description",
        content: "Manage your profile, permissions, notifications and settings.",
      },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const navigate = useNavigate();
  const { insideGeofence, setInsideGeofence, reset } = useAppState();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    reset();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate({ to: "/app" })}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> Back to home
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Profile Summary */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {currentEmployee.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{currentEmployee.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{currentEmployee.employeeId}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentEmployee.department} · {currentEmployee.designation}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Office</p>
            <p className="mt-1 text-xs font-semibold">{currentEmployee.office}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Shift</p>
            <p className="mt-1 text-xs font-semibold">{currentEmployee.shift}</p>
          </div>
        </div>
      </section>

      {/* Location Permissions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Location & Device</h2>
        <div className="card-elevated rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <MapPin className="size-4 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-medium">Location permissions</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Allow geofence check-ins</p>
              </div>
            </div>
            <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Current status</p>
            <StatusPill tone={insideGeofence ? "success" : "danger"}>
              {insideGeofence ? "Inside authorized area" : "Outside authorized area"}
            </StatusPill>
          </div>
        </div>
      </section>

      {/* Simulate Geofence */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Prototype Tools</h2>
        <div className="card-elevated rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Radar className="size-4 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-medium">Simulate geofence entry</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Preview how check-in works when inside the office geofence
                </p>
              </div>
            </div>
            <Switch
              checked={insideGeofence}
              onCheckedChange={(v) => {
                setSimulating(true);
                setTimeout(() => {
                  setInsideGeofence(v);
                  setSimulating(false);
                }, 500);
              }}
              disabled={simulating}
              aria-label="Simulate geofence entry"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This simulates being inside the 200m authorized office area for demonstration purposes.
          </p>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <div className="card-elevated rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Bell className="size-4 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-medium">Push notifications</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Attendance reminders, approvals, announcements
                </p>
              </div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Notification types</p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <input type="checkbox" id="n1" defaultChecked className="size-3 rounded" />
                <Label htmlFor="n1" className="cursor-pointer">
                  Attendance reminders
                </Label>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" id="n2" defaultChecked className="size-3 rounded" />
                <Label htmlFor="n2" className="cursor-pointer">
                  Request approvals/rejections
                </Label>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" id="n3" defaultChecked className="size-3 rounded" />
                <Label htmlFor="n3" className="cursor-pointer">
                  HR announcements
                </Label>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Privacy & Security</h2>
        <div className="card-elevated rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="size-4 text-primary mt-0.5" aria-hidden />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Data privacy</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your attendance, location, and face verification data is encrypted and stored
                securely.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
              View privacy policy
            </Button>
          </div>
        </div>
      </section>

      {/* Logout */}
      <Button
        variant="destructive"
        className="h-12 w-full text-sm font-semibold"
        onClick={() => setShowLogoutDialog(true)}
      >
        <LogOut className="size-4" aria-hidden /> Logout
      </Button>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of the GeoAttend employee app. You can sign back in anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Yes, logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
