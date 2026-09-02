"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { RECIPES, recipeNutrients } from "@/lib/data/recipes";
import { useToday } from "@/lib/hooks";
import { generatePlan } from "@/lib/services/nutritionAI";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import type { MealType } from "@/lib/types";
import { addDays, formatKcal } from "@/lib/utils";

const SLOTS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export default function PlannerPage() {
  const { date, ctx } = useToday();
  const plan = useNutrician((s) => s.plan);
  const addToPlan = useNutrician((s) => s.addToPlan);
  const removeFromPlan = useNutrician((s) => s.removeFromPlan);
  const swapPlanMeal = useNutrician((s) => s.swapPlanMeal);
  const generateWeekPlan = useNutrician((s) => s.generateWeekPlan);
  const rebuildGroceries = useNutrician((s) => s.rebuildGroceries);
  const days = Array.from({ length: 7 }, (_, i) => addDays(date, i));
  const suggestion = generatePlan(ctx)[0];

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <PageIntro
          kicker="Week view"
          title="Meal planner"
          body="Plan breakfast, lunch and dinner, then rebuild the grocery list. Totals stay tied to the same recipe nutrients as logging."
        />
        <div className="flex gap-2">
          <Button onClick={generateWeekPlan}>AI week plan</Button>
          <Button variant="secondary" onClick={rebuildGroceries}>
            Rebuild groceries
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => (
            <div key={day} className="space-y-2">
              <p className="text-xs font-semibold text-muted">{day.slice(5)}</p>
              {SLOTS.map((slot) => {
                const entry = plan.find((item) => item.date === day && item.type === slot);
                return (
                  <Card key={slot} className="min-h-[110px] p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted">{mealTypeLabel(slot)}</p>
                    {entry ? (
                      <>
                        <p className="mt-1 text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted">{formatKcal(entry.nutrients.calories)}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {RECIPES.slice(0, 2).map((recipe) => (
                            <button
                              key={recipe.id}
                              className="text-[10px] text-accent"
                              onClick={() => swapPlanMeal(entry.id, recipe.id)}
                            >
                              Swap {recipe.name.split(" ")[0]}
                            </button>
                          ))}
                          <button className="text-[10px] text-muted" onClick={() => removeFromPlan(entry.id)}>
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        className="mt-2 text-xs text-accent"
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
                  </Card>
                );
              })}
            </div>
          ))}
      </div>
      {suggestion ? (
        <p className="mt-4 text-sm text-muted">
          Autopilot next fill: {suggestion.name} for {suggestion.type} on {suggestion.date}.
        </p>
      ) : null}
    </AppShell>
  );
}
