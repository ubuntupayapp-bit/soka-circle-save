import { Share2, Sparkles, X } from "lucide-react";
import { formatZar } from "@/lib/soka-data";

export function BoostNudge({
  remaining,
  suggestion,
  onDismiss,
  onShare,
}: {
  remaining: number;
  suggestion: number;
  onDismiss: () => void;
  onShare: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-accent p-4 text-accent-foreground">
      <button
        onClick={onDismiss}
        aria-label="Dismiss boost"
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/30"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
        <Sparkles className="h-4 w-4" /> SOKA Boost
      </p>
      <p className="mt-2 pr-8 text-base font-bold">
        You&apos;re {formatZar(remaining)} away — invite someone to add {formatZar(suggestion)}
      </p>
      <p className="mt-1 text-sm opacity-85">Almost there. One more person can close the gap today.</p>
      <button
        onClick={onShare}
        className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-accent-foreground px-4 text-sm font-bold text-accent"
      >
        <Share2 className="h-4 w-4" /> Share invite
      </button>
    </div>
  );
}
