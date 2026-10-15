import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfficeMapProps {
  /** Office / location name shown in the overlay bar. */
  label: string;
  /** Address shown under the name in the overlay bar. */
  sublabel?: string;
  /** Geofence radius in meters. */
  radiusMeters: number;
  /** Whether the employee is currently inside the geofence. */
  active: boolean;
  /** Placeholder center coordinate [latitude, longitude]. */
  center: [number, number];
  /** Additional Tailwind classes (commonly used to set the map height). */
  className?: string;
}

export function OfficeMap({
  label,
  sublabel,
  radiusMeters,
  active,
  center,
  className,
}: OfficeMapProps) {
  const [lat, lon] = center;
  void lat; // center passed for future real-coordinate use; not needed for the static decorative map
  void lon;

  // aria-label summarizes the scene for assistive tech.
  const ariaLabel = [
    `Static map of ${label}.`,
    sublabel ? ` Address: ${sublabel}.` : "",
    ` Geofence radius ${radiusMeters} meters.`,
    ` Office marker at the center.`,
    active
      ? " The employee is inside the geofence boundary."
      : " The employee is outside the geofence boundary.",
  ]
    .filter(Boolean)
    .join("");

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("map-grid relative overflow-hidden rounded-xl border border-border", className)}
    >
      {/* Static, non-interactive map frame. The `map-grid` utility (styles.css) gives a faint road-grid texture. */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Concentric geofence rings: outer "scale" rings + the authoritative boundary ring. */}
        <div className="absolute flex items-center justify-center">
          {/* Outermost helper ring (visual scale only). */}
          <span className="absolute size-52 rounded-full border border-primary/10" />
          {/* Middle helper ring. */}
          <span className="absolute size-44 rounded-full border border-primary/15" />
          {/* Authoritative geofence boundary. Dashed when outside; filled tint when inside. */}
          <span
            className={cn(
              "absolute size-36 rounded-full border-2",
              active
                ? "border-success/40 bg-success/8"
                : "border-dashed border-primary/50 bg-transparent",
            )}
          />
          {/* Active pulse ring (only when inside the geofence). Reuses the existing geo-pulse animation. */}
          {active && (
            <span className="absolute size-36 rounded-full bg-success/20 animate-geo-pulse" />
          )}
        </div>

        {/* Office marker at the center of the geofence. */}
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full shadow-md",
            active ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground",
          )}
          aria-hidden
        >
          <MapPin className="size-4" aria-hidden />
        </span>
      </div>

      {/* Compass rose — decorative, purely for map feel. Non-interactive. */}
      <span
        className="pointer-events-none absolute top-2 right-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm"
        aria-hidden
      >
        <Navigation className="inline size-3 mr-0.5" aria-hidden />N
      </span>

      {/* Bottom overlay label bar — same treatment as manager/locations.tsx. */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-card/85 p-3 backdrop-blur-sm">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{label}</p>
          {sublabel && <p className="truncate text-xs text-muted-foreground">{sublabel}</p>}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
          <Navigation className="size-3" aria-hidden />
          {radiusMeters}m geofence
        </span>
      </div>
    </div>
  );
}
