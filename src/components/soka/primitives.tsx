import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/soka-data";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-5", className)}>
      {children}
    </div>
  );
}

export function TopBar({
  title,
  subtitle,
  backTo,
  backParams,
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
  backParams?: Record<string, string>;
}) {
  return (
    <header className="mb-5 flex items-start gap-3">
      {backTo ? (
        <Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ to: backTo, ...(backParams ? { params: backParams } : {}) } as any)}
          aria-label="Go back"
          className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : null}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    </header>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "accent" }) {
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          tone === "primary" ? "bg-primary" : "bg-accent",
        )}
        style={{ width: `${Math.min(100, Math.max(2, value))}%` }}
      />
    </div>
  );
}

const AVATAR_TONES = ["bg-primary text-primary-foreground", "bg-accent text-accent-foreground", "bg-success text-success-foreground", "bg-secondary text-secondary-foreground"];

export function MemberAvatars({ members, max = 4 }: { members: Member[]; max?: number }) {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  return (
    <div className="flex flex-row items-center gap-1.5">
      {shown.map((m, i) => (
        <span
          key={m.id}
          title={m.name}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold",
            AVATAR_TONES[i % AVATAR_TONES.length],
          )}
        >
          {m.initials}
        </span>
      ))}
      {rest > 0 ? (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[11px] font-bold text-muted-foreground">
          +{rest}
        </span>
      ) : null}
    </div>
  );
}

export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md gap-3 px-5 py-4">{children}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-base font-semibold text-primary-foreground transition active:scale-[0.99] disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-base font-semibold text-foreground transition active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
}
