import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { ActionBar, PrimaryButton, Screen, TopBar } from "@/components/soka/primitives";
import { useSoka } from "@/lib/soka-store";
import { BUNDLES, formatZar, funded } from "@/lib/soka-data";

export const Route = createFileRoute("/buy/$goalId")({
  head: () => ({
    meta: [
      { title: "Buy essentials — SOKA" },
      { name: "description", content: "Spend your funded pool on a grocery, school or electricity bundle from a partner merchant." },
      { property: "og:title", content: "Buy essentials — SOKA" },
      { property: "og:description", content: "Turn your funded pool into real essentials." },
    ],
  }),
  component: BuyEssentials,
});

function BuyEssentials() {
  const { goalId } = useParams({ from: "/buy/$goalId" });
  const navigate = useNavigate();
  const { getGoal, recordPurchase } = useSoka();
  const goal = getGoal(goalId);
  const [selected, setSelected] = useState<string | null>(null);

  if (!goal) return <Screen><TopBar title="Goal not found" backTo="/" /></Screen>;

  const available = funded(goal);
  const bundle = BUNDLES.find((b) => b.id === selected);

  function confirm() {
    if (!bundle || !goal) return;
    recordPurchase(goal.id, {
      bundleId: bundle.id,
      bundleName: bundle.name,
      merchant: bundle.merchant,
      amount: bundle.price,
      date: new Date().toISOString(),
    });
    navigate({ to: "/receipt/$goalId", params: { goalId: goal.id } });
  }

  return (
    <Screen>
      <TopBar
        title="Buy essentials"
        subtitle={`${formatZar(available)} available in ${goal.title}`}
        backTo="/"
      />

      <ul className="space-y-3">
        {BUNDLES.map((b) => {
          const affordable = b.price <= available;
          const active = selected === b.id;
          return (
            <li key={b.id}>
              <button
                onClick={() => affordable && setSelected(b.id)}
                disabled={!affordable}
                className={
                  "w-full rounded-2xl border p-4 text-left transition " +
                  (active ? "border-primary bg-secondary" : "border-border bg-card") +
                  (affordable ? "" : " opacity-50")
                }
              >
                <div className="flex items-start gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{b.name}</span>
                    <span className="block text-xs text-muted-foreground">{b.merchant}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{b.items}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-bold text-primary">{formatZar(b.price)}</span>
                    {active ? (
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : null}
                  </span>
                </div>
                {!affordable ? (
                  <span className="mt-2 block text-xs font-semibold text-destructive">
                    Needs {formatZar(b.price - available)} more
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <ActionBar>
        <PrimaryButton onClick={confirm} disabled={!bundle}>
          Confirm purchase {bundle ? formatZar(bundle.price) : ""}
        </PrimaryButton>
      </ActionBar>
    </Screen>
  );
}
