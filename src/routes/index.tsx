import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wallet } from "lucide-react";
import { Screen } from "@/components/soka/primitives";
import { GoalCardLink } from "@/components/soka/GoalCard";
import { useSoka } from "@/lib/soka-store";
import { formatZar, funded } from "@/lib/soka-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SOKA — Save together, buy essentials together" },
      {
        name: "description",
        content:
          "SOKA lets your circle pool small contributions toward groceries, school supplies and electricity — then pay for them together.",
      },
      { property: "og:title", content: "SOKA — Save together, buy essentials together" },
      {
        property: "og:description",
        content: "Pool small contributions with your circle and buy everyday essentials together.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { goals } = useSoka();
  const totalPooled = goals.reduce((sum, g) => sum + funded(g), 0);

  return (
    <Screen>
      <div className="hero-gradient -mx-5 -mt-5 rounded-b-[2rem] px-5 pb-8 pt-8 text-primary-foreground">
        <p className="text-sm/5 opacity-80">Sawubona, Lesley</p>
        <h1 className="mt-1 text-3xl font-extrabold">SOKA</h1>
        <p className="mt-1 text-sm opacity-90">Save together. Buy together.</p>
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-card/15 p-4">
          <Wallet className="h-6 w-6" />
          <div>
            <p className="text-xs opacity-85">Pooled across your circles</p>
            <p className="text-2xl font-bold">{formatZar(totalPooled)}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-lg font-bold">My goals</h2>
        <Link
          to="/discover"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> New goal
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {goals.map((goal) => (
          <GoalCardLink key={goal.id} goal={goal} />
        ))}
      </div>
    </Screen>
  );
}
