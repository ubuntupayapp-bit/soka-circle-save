import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { ActionBar, PrimaryButton, Screen, TopBar } from "@/components/soka/primitives";
import { useSoka } from "@/lib/soka-store";
import { formatZar } from "@/lib/soka-data";

export const Route = createFileRoute("/receipt/$goalId")({
  head: () => ({
    meta: [
      { title: "Purchase confirmed — SOKA" },
      { name: "description", content: "Receipt for essentials bought with your SOKA circle's pooled savings." },
      { property: "og:title", content: "Purchase confirmed — SOKA" },
      { property: "og:description", content: "Your circle's savings just became real essentials." },
    ],
  }),
  component: Receipt,
});

function Receipt() {
  const { goalId } = useParams({ from: "/receipt/$goalId" });
  const navigate = useNavigate();
  const { getGoal } = useSoka();
  const goal = getGoal(goalId);
  const purchase = goal?.purchase;

  if (!goal || !purchase) {
    return <Screen><TopBar title="No purchase found" backTo="/" /></Screen>;
  }

  return (
    <Screen className="pt-10">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Purchase confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your circle turned {formatZar(purchase.amount)} of savings into essentials.
        </p>
      </div>

      <div className="surface-card mt-8 p-5">
        <Row label="Goal" value={goal.title} />
        <Row label="Merchant" value={purchase.merchant} />
        <Row label="Bundle" value={purchase.bundleName} />
        <Row
          label="Date"
          value={new Date(purchase.date).toLocaleString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
        <Row label="Members" value={`${goal.members.length} contributors`} />
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
          <span className="font-bold">Total paid</span>
          <span className="text-xl font-extrabold text-primary">{formatZar(purchase.amount)}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Reference {goal.code}-{purchase.bundleId.toUpperCase()}
      </p>

      <ActionBar>
        <PrimaryButton onClick={() => navigate({ to: "/" })}>Done — back to MoMo</PrimaryButton>
      </ActionBar>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
