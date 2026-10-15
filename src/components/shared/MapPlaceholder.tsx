import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapPlaceholder({
  label,
  sublabel,
  radius = "200m geofence",
  className,
  active = true,
}: {
  label: string;
  sublabel?: string;
  radius?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Static map placeholder for ${label}`}
      className={cn("map-grid relative overflow-hidden rounded-xl border border-border", className)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <span
            className={cn(
              "absolute size-28 rounded-full",
              active ? "bg-primary/15 animate-geo-pulse" : "bg-muted-foreground/10",
            )}
          />
          <span
            className={cn(
              "size-24 rounded-full border-2 border-dashed",
              active ? "border-primary/50 bg-primary/10" : "border-muted-foreground/40 bg-muted/40",
            )}
          />
          <span className="absolute flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <MapPin className="size-4" aria-hidden />
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-card/85 p-3 backdrop-blur-sm">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{label}</p>
          {sublabel && <p className="truncate text-xs text-muted-foreground">{sublabel}</p>}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
          <Navigation className="size-3" aria-hidden />
          {radius}
        </span>
      </div>
    </div>
  );
}
