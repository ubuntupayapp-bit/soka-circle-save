import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Screen, TopBar } from "@/components/soka/primitives";
import { CategoryIcon } from "@/components/soka/CategoryIcon";
import { CATEGORIES } from "@/lib/soka-data";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Start a savings goal — SOKA" },
      { name: "description", content: "Pick what your circle is saving for: groceries, school supplies, electricity, household or something else." },
      { property: "og:title", content: "Start a savings goal — SOKA" },
      { property: "og:description", content: "Pick a category and start pooling with your circle." },
    ],
  }),
  component: Discover,
});

function Discover() {
  return (
    <Screen>
      <TopBar title="What are we saving for?" subtitle="Pick a category to start a goal" backTo="/" />
      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to="/create"
            search={{ category: cat.id }}
            className="surface-card flex items-center gap-4 p-4 active:scale-[0.99]"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
              <CategoryIcon icon={cat.icon} className="h-7 w-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold">{cat.label}</span>
              <span className="block text-sm text-muted-foreground">{cat.blurb}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </Screen>
  );
}
