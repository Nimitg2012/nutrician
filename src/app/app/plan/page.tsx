"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { RECIPES, recipeNutrients } from "@/lib/data/recipes";
import { useToday } from "@/lib/hooks";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import type { MealType } from "@/lib/types";
import { addDays, formatKcal, weekdayName } from "@/lib/utils";
import Link from "next/link";

const SLOTS: MealType[] = ["breakfast", "lunch", "dinner"];

export default function PlanHubPage() {
  const { date } = useToday();
  const plan = useNutrician((s) => s.plan);
  const generateWeekPlan = useNutrician((s) => s.generateWeekPlan);
  const rebuildGroceries = useNutrician((s) => s.rebuildGroceries);
  const addToPlan = useNutrician((s) => s.addToPlan);
  const days = Array.from({ length: 7 }, (_, i) => addDays(date, i));
  const recipes = RECIPES.slice(0, 3);

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <PageIntro kicker="Decide ahead" title="Plan" body="A week of meals, recipes that fit remaining macros, and a grocery list that follows the plan." />
        <div className="flex flex-wrap gap-2">
          <Button onClick={generateWeekPlan}>Generate AI plan</Button>
          <Button variant="secondary" href="/app/grocery" onClick={rebuildGroceries}>
            Build grocery list
          </Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {days.map((day) => (
          <div key={day} className="rounded-3xl border border-white/8 bg-bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{weekdayName(day)}</p>
            <div className="mt-3 space-y-2">
              {SLOTS.map((slot) => {
                const entry = plan.find((item) => item.date === day && item.type === slot);
                return (
                  <div key={slot} className="rounded-2xl bg-white/4 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted">{mealTypeLabel(slot)}</p>
                    {entry ? (
                      <p className="text-sm font-medium">{entry.name}</p>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-accent"
                        onClick={() => {
                          const recipe = RECIPES.find((item) => item.mealTypes.includes(slot)) ?? RECIPES[0];
                          addToPlan({
                            date: day,
                            type: slot,
                            recipeId: recipe.id,
                            name: recipe.name,
                            nutrients: recipeNutrients(recipe),
                          });
                        }}
                      >
                        Add {slot}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Recipes</h2>
        <Link href="/app/recipes" className="text-sm text-accent">
          View all
        </Link>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <p className="font-medium">{recipe.name}</p>
            <p className="mt-1 text-sm text-muted">
              {formatKcal(recipe.calories)} · {recipe.protein}g protein · {recipe.prepMinutes} min
            </p>
            <Button href={`/app/recipes/${recipe.id}`} variant="secondary" className="mt-3">
              View
            </Button>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        Open the full <Link href="/app/planner" className="text-accent">week planner</Link> to swap, save, or generate a complete AI week.
      </p>
    </AppShell>
  );
}
