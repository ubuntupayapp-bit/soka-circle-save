import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, ShoppingBasket, Users, Wallet } from "lucide-react";
import { Screen } from "@/components/soka/primitives";
import { GoalCardLink } from "@/components/soka/GoalCard";
import { CategoryIcon } from "@/components/soka/CategoryIcon";
import { useSoka } from "@/lib/soka-store";
import { CATEGORIES, formatZar, funded } from "@/lib/soka-data";
import sokaLogo from "@/assets/soka-wordmark.jpg.asset.json";

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

const STEPS = [
  {
    icon: Plus,
    title: "1. Start a goal",
    body: "Pick what you need — groceries, school supplies, electricity — set a target in rands and a deadline.",
  },
  {
    icon: Users,
    title: "2. Invite your circle",
    body: "Share a goal code with family, neighbours or a stokvel group. Everyone chips in what they can.",
  },
  {
    icon: Wallet,
    title: "3. Contribute via MoMo",
    body: "Add R20, R50, R100 or your own amount. Watch the progress bar fill as the circle saves.",
  },
  {
    icon: ShoppingBasket,
    title: "4. Buy together",
    body: "At 100% funded, choose a merchant bundle, confirm the purchase and get a shared receipt.",
  },
];

function Dashboard() {
  const { goals } = useSoka();
  const totalPooled = goals.reduce((sum, g) => sum + funded(g), 0);
  const totalMembers = new Set(goals.flatMap((g) => g.members.map((m) => m.id))).size;

  return (
    <Screen>
      <div className="hero-gradient -mx-5 -mt-5 rounded-b-[2rem] px-5 pb-8 pt-8 text-primary-foreground">
        <p className="text-sm/5 opacity-80">Sawubona, Lesley</p>
        <img
          src={sokaLogo.url}
          alt="SOKA — Save, Own, Keep, Accumulate"
          className="mt-3 w-full max-w-[19rem] rounded-2xl bg-card px-4 py-3"
          width={900}
          height={383}
          loading="eager"
        />
        <p className="mt-3 text-sm opacity-90">
          Save together. Buy together. Small contributions from your circle become the essentials
          your home needs.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card/15 p-4">
            <Wallet className="h-5 w-5" />
            <p className="mt-2 text-xs opacity-85">Pooled so far</p>
            <p className="text-xl font-bold">{formatZar(totalPooled)}</p>
          </div>
          <div className="rounded-2xl bg-card/15 p-4">
            <Users className="h-5 w-5" />
            <p className="mt-2 text-xs opacity-85">People saving with you</p>
            <p className="text-xl font-bold">{totalMembers}</p>
          </div>
        </div>
        <Link
          to="/discover"
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-sm font-bold text-accent-foreground"
        >
          Start a new goal <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-7">
        <h2 className="text-lg font-bold">How SOKA works</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Four simple steps from your first R20 to a full basket.
        </p>
        <ol className="mt-4 space-y-3">
          {STEPS.map((s) => (
            <li key={s.title} className="surface-card flex gap-3 p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-bold">What can you save for?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/create"
              search={{ category: c.id }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2.5 text-sm font-semibold"
            >
              <CategoryIcon icon={c.icon} className="h-4 w-4 text-primary" />
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">My goals</h2>
            <p className="text-sm text-muted-foreground">Tap a goal to contribute or see history.</p>
          </div>
          <Link
            to="/discover"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground"
          >
            <Plus className="h-4 w-4" /> New
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          {goals.map((goal) => (
            <GoalCardLink key={goal.id} goal={goal} />
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Demo data — no real money moves. Build today. Secure tomorrow.
      </p>
    </Screen>
  );
}
