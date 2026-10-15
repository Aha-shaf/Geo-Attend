import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Lock, LogOut, Settings, Mail, Phone } from "lucide-react";
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
import { useAppState } from "@/lib/app-state";
import { currentManager } from "@/lib/mock-data";

export const Route = createFileRoute("/manager/profile")({
  head: () => ({
    meta: [
      { title: "Settings — GeoAttend Manager" },
      {
        name: "description",
        content: "Manage manager profile and notification settings.",
      },
      { property: "og:title", content: "Settings — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Manager profile settings and preferences.",
      },
    ],
  }),
  component: ManagerProfileScreen,
});

function ManagerProfileScreen() {
  const navigate = useNavigate();
  const { reset } = useAppState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    reset();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      {/* Profile Summary */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Profile</h2>
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {currentManager.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold">{currentManager.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{currentManager.employeeId}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentManager.department} · {currentManager.designation}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="mt-1 flex items-center gap-1.5 font-medium">
                  <Mail className="size-3.5" aria-hidden />
                  priya.nair@company.com
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                <p className="mt-1 flex items-center gap-1.5 font-medium">
                  <Phone className="size-3.5" aria-hidden />
                  +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="size-5" aria-hidden />
          Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push notifications</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Receive in-app alerts and system notifications
              </p>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email alerts</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Daily or weekly email summaries
                </p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </div>

          {notificationsEnabled && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Alert types</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 rounded" />
                  Pending approvals
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 rounded" />
                  High severity alerts
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 rounded" />
                  Attendance anomalies
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 rounded" />
                  System announcements
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* General Settings */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="size-5" aria-hidden />
          General
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Theme</p>
            <p className="mt-2 text-sm font-medium">Dark mode (system)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Automatically switches between light and dark based on system settings
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Language</p>
              <p className="mt-2 text-sm font-medium">English (US)</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Time zone</p>
              <p className="mt-2 text-sm font-medium">IST (UTC+05:30)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lock className="size-5" aria-hidden />
          Security
        </h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full text-sm font-semibold">
            Change password
          </Button>
          <Button variant="outline" className="w-full text-sm font-semibold">
            Two-factor authentication
          </Button>
          <Button variant="outline" className="w-full text-sm font-semibold">
            Active sessions
          </Button>
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
              You will be signed out of the GeoAttend manager dashboard. You can sign back in
              anytime.
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
