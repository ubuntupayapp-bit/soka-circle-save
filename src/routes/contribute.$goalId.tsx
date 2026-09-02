import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import {
  ActionBar,
  GhostButton,
  PrimaryButton,
  ProgressBar,
  Screen,
  TopBar,
} from "@/components/soka/primitives";
import { useSoka } from "@/lib/soka-store";
import { formatZar, funded, percent } from "@/lib/soka-data";

export const Route = createFileRoute("/contribute/$goalId")({
  head: () => ({
    meta: [
      { title: "Contribute via MoMo — SOKA" },
      { name: "description", content: "Add R20, R50, R100 or a custom amount to your circle's goal, paid straight from MoMo." },
      { property: "og:title", content: "Contribute via MoMo — SOKA" },
      { property: "og:description", content: "Add your share to the pool in a few taps." },
    ],
  }),
  component: Contribute,
});

type Status = "idle" | "pending" | "success" | "failed";
const QUICK = [20, 50, 100];

function Contribute() {
  const { goalId } = useParams({ from: "/contribute/$goalId" });
  const navigate = useNavigate();
  const { getGoal, addContribution } = useSoka();
  const goal = getGoal(goalId);

  const [amount, setAmount] = useState("50");
  const [status, setStatus] = useState<Status>("idle");
  const [failCount, setFailCount] = useState(0);

  if (!goal) return <Screen><TopBar title="Goal not found" backTo="/" /></Screen>;

  const value = Number(amount) || 0;
  const raised = funded(goal);

  function pay() {
    if (value <= 0) return;
    setStatus("pending");
    setTimeout(() => {
      // Mock gateway: first attempt on amounts ending in 7 fails, to demo the error state.
      const shouldFail = value % 10 === 7 && failCount === 0;
      if (shouldFail) {
        setFailCount((n) => n + 1);
        setStatus("failed");
        return;
      }
      addContribution(goal!.id, value);
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
    const newTotal = raised;
    return (
      <StateScreen
        icon={
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check className="h-8 w-8" />
          </span>
        }
        title={`${formatZar(value)} added`}
        body={`${goal.title} is now at ${formatZar(newTotal)} of ${formatZar(goal.target)}.`}
      >
        <div className="mt-6 w-full">
          <ProgressBar value={percent(goal)} />
          <p className="mt-2 text-center text-sm font-semibold">{percent(goal)}% funded</p>
        </div>
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton onClick={() => navigate({ to: "/goal/$goalId", params: { goalId: goal.id } })}>
            Back to goal
          </PrimaryButton>
          <GhostButton onClick={() => setStatus("idle")}>Contribute again</GhostButton>
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
      <TopBar title="Contribute" subtitle={goal.title} backTo="/" />

      <div className="surface-card p-5 text-center">
        <p className="text-sm text-muted-foreground">Amount</p>
        <div className="mt-2 flex items-center justify-center gap-1">
          <span className="text-3xl font-bold text-muted-foreground">R</span>
          <input
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            className="w-32 bg-transparent text-center text-5xl font-extrabold outline-none"
            aria-label="Contribution amount in rands"
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
        <button
          onClick={() => setAmount("")}
          className="h-14 rounded-2xl border border-border bg-card text-sm font-bold"
        >
          Custom
        </button>
      </div>

      <div className="mt-6 surface-card p-4">
        <p className="text-sm text-muted-foreground">Goal progress</p>
        <div className="mt-2">
          <ProgressBar value={percent(goal)} />
        </div>
        <p className="mt-2 text-sm font-semibold">
          {formatZar(raised)} / {formatZar(goal.target)} — {percent(goal)}% funded
        </p>
      </div>

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
    <Screen className="flex flex-col items-center justify-center pb-10 text-center">
      {icon}
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">{body}</p>
      {children}
    </Screen>
  );
}
