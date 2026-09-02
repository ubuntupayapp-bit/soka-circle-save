import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, LifeBuoy, Loader2, Users } from "lucide-react";
import {
  ActionBar,
  GhostButton,
  MemberAvatars,
  PrimaryButton,
  ProgressBar,
  Screen,
  TopBar,
} from "@/components/soka/primitives";
import { useSoka } from "@/lib/soka-store";
import { emergencyBalance, emergencyPercent, formatDate, formatZar } from "@/lib/soka-data";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Fund — SOKA" },
      {
        name: "description",
        content:
          "Build a shared safety net with your circle. Contribute any amount via MoMo and keep money ready for unexpected costs.",
      },
      { property: "og:title", content: "Emergency Fund — SOKA" },
      { property: "og:description", content: "A shared safety net your circle can top up any time." },
    ],
  }),
  component: EmergencyFundScreen,
});

type Status = "idle" | "pending" | "success" | "failed";
const QUICK = [20, 50, 100, 200];

function EmergencyFundScreen() {
  const navigate = useNavigate();
  const { emergency, addEmergencyContribution } = useSoka();

  const [amount, setAmount] = useState("50");
  const [status, setStatus] = useState<Status>("idle");
  const [failCount, setFailCount] = useState(0);

  const value = Number(amount) || 0;
  const balance = emergencyBalance(emergency);
  const pct = emergencyPercent(emergency);

  function pay() {
    if (value <= 0) return;
    setStatus("pending");
    setTimeout(() => {
      const shouldFail = value % 10 === 7 && failCount === 0;
      if (shouldFail) {
        setFailCount((n) => n + 1);
        setStatus("failed");
        return;
      }
      addEmergencyContribution(value);
      setStatus("success");
    }, 1600);
  }

  if (status === "pending") {
    return (
      <StateScreen
        icon={<Loader2 className="h-10 w-10 animate-spin text-primary" />}
        title="Waiting for MoMo…"
        body={`Approve the ${formatZar(value)} payment request on your phone.`}
      />
    );
  }

  if (status === "success") {
    return (
      <StateScreen
        icon={
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check className="h-8 w-8" />
          </span>
        }
        title={`${formatZar(value)} added to the safety net`}
        body={`The emergency fund is now at ${formatZar(balance)} of ${formatZar(emergency.target)}.`}
      >
        <div className="mt-6 w-full">
          <ProgressBar value={pct} tone="accent" />
          <p className="mt-2 text-center text-sm font-semibold">{pct}% of the safety net saved</p>
        </div>
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton onClick={() => setStatus("idle")}>Contribute again</PrimaryButton>
          <GhostButton onClick={() => navigate({ to: "/" })}>Back to dashboard</GhostButton>
        </div>
      </StateScreen>
    );
  }

  if (status === "failed") {
    return (
      <StateScreen
        icon={
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <AlertTriangle className="h-8 w-8" />
          </span>
        }
        title="Payment didn't go through"
        body="MoMo couldn't complete this request. No money left your wallet."
      >
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton onClick={pay}>Retry {formatZar(value)}</PrimaryButton>
          <GhostButton onClick={() => setStatus("idle")}>Change amount</GhostButton>
        </div>
      </StateScreen>
    );
  }

  return (
    <Screen>
      <TopBar
        title="Emergency Fund"
        subtitle="A shared safety net for unexpected costs"
        backTo="/"
      />

      <div className="surface-card p-5">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <LifeBuoy className="h-5 w-5" />
        </span>
        <p className="mt-3 text-3xl font-extrabold">{formatZar(balance)}</p>
        <p className="text-sm text-muted-foreground">of {formatZar(emergency.target)} safety-net target</p>
        <div className="mt-4">
          <ProgressBar value={pct} tone="accent" />
        </div>
        <p className="mt-2 text-sm font-semibold">{pct}% saved</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {emergency.members.length} members
          </span>
          <MemberAvatars members={emergency.members} />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        No deadline — the fund stays open. Anyone in your circle can top it up, and the pool is there
        when a member faces a sudden bill, a funeral, transport or medicine.
      </p>

      <div className="surface-card mt-6 p-5 text-center">
        <p className="text-sm text-muted-foreground">Amount</p>
        <div className="mt-2 flex items-center justify-center gap-1">
          <span className="text-3xl font-bold text-muted-foreground">R</span>
          <input
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            className="w-32 bg-transparent text-center text-5xl font-extrabold outline-none"
            aria-label="Emergency fund contribution amount in rands"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => setAmount(String(q))}
            className={
              "h-14 rounded-2xl border text-base font-bold " +
              (value === q
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card")
            }
          >
            R{q}
          </button>
        ))}
      </div>

      <h2 className="mt-7 text-lg font-bold">Fund activity</h2>
      <ul className="mt-3 space-y-2">
        {emergency.contributions.length === 0 ? (
          <li className="surface-card p-4 text-sm text-muted-foreground">
            No contributions yet — be the first.
          </li>
        ) : null}
        {emergency.contributions.map((c) => (
          <li key={c.id} className="surface-card flex items-center gap-3 p-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {c.memberName.slice(0, 2).toUpperCase()}
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{c.memberName}</span>
              <span className="block text-xs text-muted-foreground">{formatDate(c.date)}</span>
            </span>
            <span className="font-bold text-primary">{formatZar(c.amount)}</span>
          </li>
        ))}
      </ul>

      <ActionBar>
        <PrimaryButton onClick={pay} disabled={value <= 0}>
          Contribute {value > 0 ? formatZar(value) : ""} via MoMo
        </PrimaryButton>
      </ActionBar>
    </Screen>
  );
}

function StateScreen({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <Screen className="flex flex-col items-center justify-center text-center">
      {icon}
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {children}
    </Screen>
  );
}
