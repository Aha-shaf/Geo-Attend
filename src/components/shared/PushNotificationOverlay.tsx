import { useNavigate } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import { useAppState } from "@/lib/app-state";

/**
 * Simulated native Android/iOS heads-up notification. It renders above the app
 * chrome to imitate an OS-level banner (not an in-app dialog).
 */
export function PushNotificationOverlay() {
  const { push, dismissPush } = useAppState();
  const navigate = useNavigate();
  const notice = push[0];
  if (!notice) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <div
        role="alert"
        className="pointer-events-auto w-full max-w-[400px] animate-push-in rounded-2xl border border-border/70 bg-card/95 p-3 shadow-[0_18px_40px_-12px_rgb(15_23_42/0.45)] backdrop-blur-md"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MapPin className="size-4" aria-hidden />
          </span>
          <button
            type="button"
            onClick={() => {
              dismissPush(notice.id);
              navigate({ to: "/app/verify", search: { mode: notice.target } });
            }}
            className="min-w-0 flex-1 text-left"
          >
            <p className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
              {notice.title}
              <span className="text-[10px] font-normal">now</span>
            </p>
            <p className="mt-0.5 text-sm leading-snug font-semibold text-foreground">
              {notice.body}
            </p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">{notice.location}</p>
          </button>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissPush(notice.id)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
