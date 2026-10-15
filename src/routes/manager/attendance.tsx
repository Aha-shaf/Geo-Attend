import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employeeRows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Monitoring — GeoAttend Manager" },
      {
        name: "description",
        content:
          "Monitor team attendance with check-in/out times, work hours, and location status.",
      },
      { property: "og:title", content: "Attendance Monitoring — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Real-time team attendance monitoring dashboard.",
      },
    ],
  }),
  component: AttendanceMonitoringScreen,
});

function AttendanceMonitoringScreen() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const selectedEmp = employeeRows.find((e) => e.id === selectedEmployee);

  const statusColors = {
    Present: "text-success",
    Absent: "text-destructive",
    "On Break": "text-yellow-600",
    "Client Visit": "text-purple-600",
    "Work From Home": "text-teal-600",
    Late: "text-orange-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance monitoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track employee check-ins, check-outs, and work hours.
        </p>
      </div>

      {/* Table */}
      <div className="card-elevated rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">Employee</th>
                <th className="px-4 py-3 text-left font-semibold">Department</th>
                <th className="px-4 py-3 text-left font-semibold">Check-in</th>
                <th className="px-4 py-3 text-left font-semibold">Check-out</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Hours</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
              </tr>
            </thead>
            <tbody>
              {employeeRows.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(emp.id)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{emp.department}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" aria-hidden />
                      {emp.checkIn}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{emp.checkOut}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-semibold",
                        statusColors[emp.status as keyof typeof statusColors],
                      )}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{emp.totalHours}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3" aria-hidden />
                      {emp.location}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Drawer */}
      {selectedEmployee && selectedEmp && (
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">{selectedEmp.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedEmp.employeeId} · {selectedEmp.department}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmployee(null)}
              className="text-muted-foreground"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Check-in time</p>
              <p className="mt-1 text-sm font-semibold">{selectedEmp.checkIn}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Check-out time</p>
              <p className="mt-1 text-sm font-semibold">{selectedEmp.checkOut}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Total work hours</p>
              <p className="mt-1 text-sm font-semibold">{selectedEmp.totalHours}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Current status</p>
              <p
                className={cn(
                  "mt-1 text-sm font-semibold",
                  statusColors[selectedEmp.status as keyof typeof statusColors],
                )}
              >
                {selectedEmp.status}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Location</p>
              <p className="mt-1 text-sm font-semibold flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {selectedEmp.location}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-3">Attendance timeline (mock)</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">09:28 AM</span>
                <span className="font-medium">Checked in at Northgate HQ</span>
                <span className="text-muted-foreground">✓</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">12:45 PM</span>
                <span className="font-medium">Started break</span>
                <span className="text-muted-foreground">☕</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">01:15 PM</span>
                <span className="font-medium">Resumed work</span>
                <span className="text-muted-foreground">↩️</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
