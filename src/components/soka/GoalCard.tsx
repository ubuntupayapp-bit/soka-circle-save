import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { MemberAvatars, ProgressBar } from "./primitives";
import { CategoryIcon } from "./CategoryIcon";
import { categoryOf, daysLeft, formatZar, funded, percent, type Goal } from "@/lib/soka-data";

export function GoalCardBody({ goal }: { goal: Goal }) {
  const raised = funded(goal);
  const pct = percent(goal);
  const cat = categoryOf(goal.category);

  return (
    <div className="surface-card p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <CategoryIcon icon={cat.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold">{goal.title || "Untitled goal"}</h3>
          <p className="text-xs text-muted-foreground">{cat.label}</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
          {pct}%
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar value={pct} tone={pct >= 100 ? "accent" : "primary"} />
        <p className="mt-2 text-sm font-semibold">
          {formatZar(raised)} / {formatZar(goal.target)}{" "}
          <span className="font-normal text-muted-foreground">— {pct}% funded</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {daysLeft(goal)} days left
        </span>
        <MemberAvatars members={goal.members} />
      </div>
    </div>
  );
}

export function GoalCardLink({ goal }: { goal: Goal }) {
  return (
    <Link to="/goal/$goalId" params={{ goalId: goal.id }} className="block active:scale-[0.99]">
      <GoalCardBody goal={goal} />
    </Link>
  );
}
