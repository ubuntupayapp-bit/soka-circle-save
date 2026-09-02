import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Share2, UserPlus } from "lucide-react";
import { ActionBar, PrimaryButton, Screen, TopBar } from "@/components/soka/primitives";
import { useSoka } from "@/lib/soka-store";
import { formatZar } from "@/lib/soka-data";

export const Route = createFileRoute("/circle/$goalId")({
  head: () => ({
    meta: [
      { title: "Invite your circle — SOKA" },
      { name: "description", content: "Share your SOKA goal code so friends, family and neighbours can join and contribute." },
      { property: "og:title", content: "Invite your circle — SOKA" },
      { property: "og:description", content: "Share a code and pool contributions toward essentials." },
    ],
  }),
  component: Circle,
});

function Circle() {
  const { goalId } = useParams({ from: "/circle/$goalId" });
  const { getGoal, joinRandomMember } = useSoka();
  const goal = getGoal(goalId);
  const [copied, setCopied] = useState(false);

  if (!goal) return <Screen><TopBar title="Goal not found" backTo="/" /></Screen>;

  const link = `https://soka.app/join/${goal.code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard unavailable in some webviews */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Screen>
      <TopBar title="Invite your circle" subtitle={`${goal.title} · ${formatZar(goal.target)}`} backTo="/" />

      <div className="surface-card p-5 text-center">
        <p className="text-sm text-muted-foreground">Your goal code</p>
        <p className="mt-2 text-3xl font-extrabold tracking-wider text-primary">{goal.code}</p>
        <p className="mt-3 break-all rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground">
          {link}
        </p>
        <button
          onClick={copy}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-base font-bold text-accent-foreground"
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          {copied ? "Copied!" : "Copy invite link"}
        </button>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-lg font-bold">Members ({goal.members.length})</h2>
        <button
          onClick={() => joinRandomMember(goal.id)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-semibold"
        >
          <UserPlus className="h-4 w-4" /> Simulate join
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {goal.members.map((m) => (
          <li key={m.id} className="surface-card flex items-center gap-3 p-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {m.initials}
            </span>
            <span className="flex-1 font-semibold">{m.name}</span>
            <span className="text-xs text-muted-foreground">Joined</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
        <Share2 className="h-4 w-4 shrink-0" />
        Share the code on WhatsApp — members contribute straight from MoMo.
      </div>

      <ActionBar>
        <Link to="/goal/$goalId" params={{ goalId: goal.id }} className="w-full">
          <PrimaryButton>Go to goal</PrimaryButton>
        </Link>
      </ActionBar>
    </Screen>
  );
}
