import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneMap: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/15 text-warning-foreground border-warning/35",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
  info: "bg-primary/10 text-primary border-primary/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function toneForStatus(status: string): Tone {
  switch (status) {
    case "Present":
    case "Approved":
    case "checked-in":
      return "success";
    case "Late":
    case "On Break":
    case "on-break":
    case "Pending":
      return "warning";
    case "Absent":
    case "Rejected":
      return "danger";
    case "Client Visit":
    case "Work From Home":
      return "info";
    default:
      return "neutral";
  }
}

export function StatusPill({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const resolved = tone ?? toneForStatus(String(children));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneMap[resolved],
        className,
      )}
    >
      {children}
    </span>
  );
}
