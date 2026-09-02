"use client";

import { AppShell } from "@/components/app/shell";
import { DayTimeline } from "@/components/core/day-timeline";
import { MealCard } from "@/components/core/meal-card";
import { MetricDetail } from "@/components/core/metric-detail";
import { NextMove } from "@/components/core/next-move";
import { NutritionCore } from "@/components/core/nutrition-core";
import { WhatIfSheet } from "@/components/core/what-if-sheet";
import { Button } from "@/components/ui";
import { greeting, stateLine, type CoreKey } from "@/lib/experience";
import { useToday } from "@/lib/hooks";
import { mealFromRecommendation, planFromRecommendation } from "@/lib/log-rec";
import { dayNutrition } from "@/lib/selectors";
import { recommendMeals } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { useState } from "react";

export default function DashboardPage() {
  const { meals, water, targets, date, profile, day, ctx } = useToday();
  const logMeal = useNutrician((s) => s.logMeal);
  const addToPlan = useNutrician((s) => s.addToPlan);
  const recs = recommendMeals(ctx, 3);
  const state = stateLine(day, targets);
  const [metric, setMetric] = useState<CoreKey | null>(null);
  const [whatIf, setWhatIf] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Today</p>
        <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight md:text-4xl">{greeting(profile.name)}</h1>
        <p className="mt-2 text-center text-sm text-muted">See your state. Understand the gap. Act on the next move.</p>

        <div className="mt-8">
          <NutritionCore key={day.score.total} day={day} targets={targets} onSelect={setMetric} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg font-medium">{state.mood}</p>
          <p className="mt-1 text-sm text-orange">{state.attention}</p>
          {state.calm ? <p className="mt-1 text-sm text-blue">{state.calm}</p> : null}
        </div>

        <NextMove
          day={day}
          targets={targets}
          recs={recs}
          onLog={(rec) => logMeal(mealFromRecommendation(rec, date))}
          onPlan={(rec) => addToPlan(planFromRecommendation(rec, date))}
        />

        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={() => setWhatIf(true)}>
            What if?
          </Button>
        </div>

        <DayTimeline meals={day.meals} schedule={profile.mealSchedule} />

        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-semibold">Today&apos;s meals</h2>
          </div>
          {day.meals.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-muted">
              Nothing logged yet. Start your day with your first meal.
            </p>
          ) : (
            <div className="grid gap-3">
              {day.meals.map((meal) => {
                const without = meals.filter((item) => item.id !== meal.id);
                const before = dayNutrition(without, water, targets, date);
                return <MealCard key={meal.id} meal={meal} delta={day.score.total - before.score.total} />;
              })}
            </div>
          )}
        </section>
      </div>
      {metric ? <MetricDetail metric={metric} day={day} targets={targets} recs={recs} onClose={() => setMetric(null)} /> : null}
      <WhatIfSheet open={whatIf} onClose={() => setWhatIf(false)} />
    </AppShell>
  );
}
