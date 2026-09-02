"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, EmptyState, PageIntro } from "@/components/ui";
import { scaleNutrients } from "@/lib/nutrition";
import { dayNutrition } from "@/lib/selectors";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import { formatKcal } from "@/lib/utils";

export default function MealsPage() {
  const meals = useNutrician((s) => s.meals);
  const water = useNutrician((s) => s.water);
  const targets = useNutrician((s) => s.targets);
  const date = useNutrician((s) => s.selectedDate);
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const deleteMeal = useNutrician((s) => s.deleteMeal);
  const updateMeal = useNutrician((s) => s.updateMeal);
  const day = dayNutrition(meals, water, targets, date);
  const groups = ["breakfast", "lunch", "dinner", "snack", "drinks"] as const;

  return (
    <AppShell>
      <PageIntro kicker="Log" title="Meal log" body="Every meal you save updates calories, macros, score and the next recommendation." />
      <Button onClick={() => setLogOpen(true)}>Log meal</Button>
      <div className="mt-6 space-y-4">
        {groups.map((type) => {
          const list = day.meals.filter((meal) => meal.type === type);
          return (
            <Card key={type}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{mealTypeLabel(type)}</h2>
              {list.length === 0 ? (
                <p className="text-sm text-muted">No {type} logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {list.map((meal) => {
                    const kcal = meal.items.reduce((sum, item) => sum + item.nutrients.calories, 0);
                    return (
                      <div key={meal.id} className="flex items-center justify-between rounded-2xl bg-white/4 px-3 py-3">
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-xs text-muted">
                            {meal.time} · {formatKcal(kcal)} · {meal.source}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {meal.items[0] ? (
                            <button
                              type="button"
                              className="text-xs text-muted"
                              onClick={() => {
                                const nextServings = Math.max(0.5, (meal.items[0]?.servings ?? 1) - 0.5);
                                updateMeal(meal.id, {
                                  items: meal.items.map((item, index) => {
                                    if (index !== 0) return item;
                                    const per = item.servings ? 1 / item.servings : 1;
                                    return { ...item, servings: nextServings, nutrients: scaleNutrients(item.nutrients, nextServings * per) };
                                  }),
                                });
                              }}
                            >
                              −
                            </button>
                          ) : null}
                          <button type="button" className="text-xs text-muted" onClick={() => deleteMeal(meal.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {day.meals.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No meals logged yet." body="Log breakfast to start Nutrician Intelligence for today." action={<Button onClick={() => setLogOpen(true)}>Log first meal</Button>} />
        </div>
      ) : null}
    </AppShell>
  );
}
