import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ActionBar, PrimaryButton, Screen, TopBar } from "@/components/soka/primitives";
import { GoalCardBody } from "@/components/soka/GoalCard";
import { CATEGORIES, type CategoryId, type Goal } from "@/lib/soka-data";
import { useSoka } from "@/lib/soka-store";

const searchSchema = z.object({
  category: z
    .enum(["groceries", "school", "electricity", "household", "other"])
    .catch("groceries"),
});

export const Route = createFileRoute("/create")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Create a goal — SOKA" },
      { name: "description", content: "Name your goal, set a target in rands and a deadline, then invite your circle to pool contributions." },
      { property: "og:title", content: "Create a goal — SOKA" },
      { property: "og:description", content: "Set a target, a deadline and start pooling with your circle." },
    ],
  }),
  component: CreateGoal,
});

function defaultDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function CreateGoal() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const { createGoal } = useSoka();

  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<CategoryId>(category);
  const [target, setTarget] = useState("1500");
  const [deadline, setDeadline] = useState(defaultDeadline());

  const targetNumber = Number(target) || 0;
  const valid = title.trim().length > 1 && targetNumber > 0 && !!deadline;

  const preview: Goal = {
    id: "preview",
    title: title.trim(),
    category: cat,
    target: targetNumber || 1,
    deadline,
    code: "SOKA-••••",
    members: [{ id: "m0", name: "You", initials: "YO" }],
    contributions: [],
  };

  function submit() {
    if (!valid) return;
    const goal = createGoal({ title: title.trim(), category: cat, target: targetNumber, deadline });
    navigate({ to: "/circle/$goalId", params: { goalId: goal.id } });
  }

  return (
    <Screen>
      <TopBar title="Create a goal" subtitle="Your circle can join right after" backTo="/discover" />

      <div className="space-y-5">
        <Field label="Goal title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. October Food Basket"
            className="input-base"
          />
        </Field>

        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={
                  "h-11 rounded-full border px-4 text-sm font-semibold " +
                  (cat === c.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Target amount (ZAR)">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
              R
            </span>
            <input
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ""))}
              className="input-base pl-9"
            />
          </div>
        </Field>

        <Field label="Deadline">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input-base"
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-muted-foreground">Preview</p>
          <GoalCardBody goal={preview} />
        </div>
      </div>

      <ActionBar>
        <PrimaryButton onClick={submit} disabled={!valid}>
          Create goal & invite
        </PrimaryButton>
      </ActionBar>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
