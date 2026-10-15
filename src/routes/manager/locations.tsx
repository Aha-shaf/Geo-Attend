import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Users, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/manager/locations")({
  head: () => ({
    meta: [
      { title: "Office Locations — GeoAttend Manager" },
      {
        name: "description",
        content: "View and manage authorized office locations and geofence settings.",
      },
      { property: "og:title", content: "Office Locations — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Manage office locations and 200m geofence boundaries.",
      },
    ],
  }),
  component: LocationsScreen,
});

// Mock office locations
const officeLocations = [
  {
    id: "l1",
    name: "Capgemini",
    address: "Cyber tower, Karapakkam, Chennai",
    geofenceRadius: "150m",
    status: "active",
    employees: 45,
    coordinates: "12.9066, 80.2300",
  },
  {
    id: "l2",
    name: "Accenture Solution Pvt Ltd",
    address: "Divyasree point OMR Chennai",
    geofenceRadius: "250m",
    status: "active",
    employees: 18,
    coordinates: "12.9900, 80.2430",
  },
  {
    id: "l3",
    name: "Gradtwin",
    address: "Tech meadows, Bangalore",
    geofenceRadius: "200m",
    status: "inactive",
    employees: 0,
    coordinates: "12.9784, 77.6408",
  },
];

function LocationsScreen() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Office locations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage authorized office locations and geofence settings.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex gap-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 p-4">
        <AlertCircle className="size-4 text-blue-600 shrink-0 mt-0.5" aria-hidden />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          All active locations have a 200-meter geofence radius for automatic attendance check-in.
        </p>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {officeLocations.map((location) => {
          const [latitudeValue, longitudeValue] = location.coordinates
            .split(",")
            .map((value) => Number.parseFloat(value.trim())) as [number?, number?];

          const safeLatitude = Number.isFinite(latitudeValue) ? (latitudeValue ?? 0) : 0;
          const safeLongitude = Number.isFinite(longitudeValue) ? (longitudeValue ?? 0) : 0;

          return (
            <div
              key={location.id}
              className={`card-elevated rounded-2xl border p-6 space-y-4 ${
                location.status === "active"
                  ? "border-border bg-card"
                  : "border-border/40 bg-muted/30"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{location.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{location.address}</p>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    location.status === "active"
                      ? "bg-success/20 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {location.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Coordinates */}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Coordinates</p>
                <p className="mt-1 text-sm font-mono">{location.coordinates}</p>
              </div>

              {/* Geofence Info */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-primary mt-0.5" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Geofence radius</p>
                    <p className="text-sm font-semibold">{location.geofenceRadius}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Employees within this radius can check-in automatically
                    </p>
                  </div>
                </div>
              </div>

              {/* Employee Count */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Users className="size-4 text-primary" aria-hidden />
                <span className="text-sm font-medium">
                  {location.employees} {location.employees === 1 ? "employee" : "employees"}{" "}
                  assigned
                </span>
              </div>

              {/* Map */}
              <div className="relative w-full h-48 rounded-lg border border-border/50 overflow-hidden bg-muted/30">
                <iframe
                  title={`${location.name} map`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${safeLongitude - 0.003},${safeLatitude - 0.002},${safeLongitude + 0.003},${safeLatitude + 0.002}&layer=mapnik&marker=${safeLatitude},${safeLongitude}`}
                  className="absolute inset-0 size-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5 dark:ring-white/10" />
                <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
                  {location.geofenceRadius} geofence zone
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Geofence Summary */}
      <div className="card-elevated rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Geofence summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Total locations</p>
            <p className="mt-2 text-2xl font-bold">{officeLocations.length}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Active locations</p>
            <p className="mt-2 text-2xl font-bold text-success">
              {officeLocations.filter((l) => l.status === "active").length}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Total employees</p>
            <p className="mt-2 text-2xl font-bold">
              {officeLocations.reduce((sum, l) => sum + l.employees, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
