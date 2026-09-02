"use client";

import { AppShell } from "@/components/app/shell";
import { HydrationDots } from "@/components/core/hydration-dots";
import { MealCard } from "@/components/core/meal-card";
import { Button, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import { formatKcal } from "@/lib/utils";

export default function TrackPage() {
  const { day, targets } = useToday();
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const addWater = useNutrician((s) => s.addWater);
  const deleteMeal = useNutrician((s) => s.deleteMeal);

  return (
    <AppShell>
      <PageIntro kicker="What happened?" title="Track" body="Meals and water in one place. Logging here updates the Core, score, and next move." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Meals</h2>
            <Button onClick={() => setLogOpen(true)}>Log</Button>
          </div>
          {day.meals.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-muted">
              Nothing logged yet. Start your day with your first meal.
            </p>
          ) : (
            <div className="space-y-3">
              {day.meals.map((meal) => (
                <div key={meal.id} className="relative">
                  <MealCard meal={meal} />
                  <button type="button" className="absolute right-4 top-4 text-xs text-muted" onClick={() => deleteMeal(meal.id)}>
                    Remove
                  </button>
                  <p className="sr-only">
                    {mealTypeLabel(meal.type)} {formatKcal(meal.items.reduce((sum, item) => sum + item.nutrients.calories, 0))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-3xl border border-white/8 bg-bg-card p-5">
          <h2 className="text-lg font-semibold">Hydration</h2>
          <p className="mt-1 text-sm text-muted">Tap an empty cup to add water.</p>
          <div className="mt-4">
            <HydrationDots current={day.waterCups} target={targets.waterCups} onAdd={() => addWater(1)} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
