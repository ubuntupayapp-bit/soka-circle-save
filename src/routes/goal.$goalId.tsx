import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Check, ShoppingBag, Users } from "lucide-react";
import {
  ActionBar,
  MemberAvatars,
  PrimaryButton,
  ProgressBar,
  Screen,
  TopBar,
} from "@/components/soka/primitives";
import { BoostNudge } from "@/components/soka/BoostNudge";
import { useSoka } from "@/lib/soka-store";
import { categoryOf, daysLeft, formatDate, formatZar, funded, percent } from "@/lib/soka-data";

export const Route = createFileRoute("/goal/$goalId")({
  head: () => ({
    meta: [
      { title: "Goal details — SOKA" },
      { name: "description", content: "Track progress, see who contributed and add your share toward this SOKA goal." },
      { property: "og:title", content: "Goal details — SOKA" },
      { property: "og:description", content: "Track contributions and progress toward your circle's goal." },
    ],
  }),
  component: GoalDetail,
});

function GoalDetail() {
  const { goalId } = useParams({ from: "/goal/$goalId" });
  const { getGoal, dismissBoost } = useSoka();
  const goal = getGoal(goalId);

  if (!goal) return <Screen><TopBar title="Goal not found" backTo="/" /></Screen>;

  const raised = funded(goal);
  const pct = percent(goal);
  const remaining = Math.max(0, goal.target - raised);
  const left = daysLeft(goal);
  const fullyFunded = pct >= 100;
  const showBoost = !goal.boostDismissed && !fullyFunded && pct >= 60 && left <= 10;

  return (
    <Screen>
      <TopBar title={goal.title} subtitle={categoryOf(goal.category).label} backTo="/" />

      <div className="surface-card p-5">
        <p className="text-3xl font-extrabold">{formatZar(raised)}</p>
        <p className="text-sm text-muted-foreground">of {formatZar(goal.target)} target</p>
        <div className="mt-4">
          <ProgressBar value={pct} tone={fullyFunded ? "accent" : "primary"} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold">{pct}% funded</span>
          <span className="text-muted-foreground">{left} days left</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {goal.members.length} members
          </span>
          <MemberAvatars members={goal.members} />
        </div>
      </div>

      {showBoost ? (
        <div className="mt-4">
          <BoostNudge
            remaining={remaining}
            suggestion={Math.min(remaining, 50)}
            onDismiss={() => dismissBoost(goal.id)}
            onShare={() => {
              void navigator.clipboard?.writeText(`Join our SOKA goal: ${goal.code}`).catch(() => {});
            }}
          />
        </div>
      ) : null}

      {fullyFunded && !goal.purchase ? (
        <Link to="/buy/$goalId" params={{ goalId: goal.id }} className="mt-4 block">
          <div className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground">
            <ShoppingBag className="h-6 w-6" />
            <div>
              <p className="font-bold">Fully funded — buy essentials</p>
              <p className="text-sm opacity-85">Choose a bundle and pay from the pool</p>
            </div>
          </div>
        </Link>
      ) : null}

      {goal.purchase ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-success p-4 text-success-foreground">
          <Check className="h-6 w-6" />
          <div>
            <p className="font-bold">Purchased: {goal.purchase.bundleName}</p>
            <p className="text-sm opacity-90">{goal.purchase.merchant}</p>
          </div>
        </div>
      ) : null}

      <h2 className="mt-7 text-lg font-bold">Contribution history</h2>
      <ul className="mt-3 space-y-2">
        {goal.contributions.length === 0 ? (
          <li className="surface-card p-4 text-sm text-muted-foreground">
            No contributions yet — be the first.
          </li>
        ) : null}
        {goal.contributions.map((c) => (
          <li key={c.id} className="surface-card flex items-center gap-3 p-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {c.memberName.slice(0, 2).toUpperCase()}
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{c.memberName}</span>
              <span className="block text-xs text-muted-foreground">
                {formatDate(c.date)}
              </span>
            </span>
            <span className="font-bold text-primary">{formatZar(c.amount)}</span>
          </li>
        ))}
      </ul>

      <ActionBar>
        <Link to="/circle/$goalId" params={{ goalId: goal.id }} className="w-24 shrink-0">
          <button className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold">
            Invite
          </button>
        </Link>
        <Link to="/contribute/$goalId" params={{ goalId: goal.id }} className="flex-1">
          <PrimaryButton>Contribute</PrimaryButton>
        </Link>
      </ActionBar>
    </Screen>
  );
}
