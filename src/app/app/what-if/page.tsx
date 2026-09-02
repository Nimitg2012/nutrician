"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { mealFromRecommendation } from "@/lib/log-rec";
import { foodForWhatIf, runWhatIf } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { formatGrams, formatKcal } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function WhatIfPage() {
  const { ctx, date } = useToday();
  const logMeal = useNutrician((s) => s.logMeal);
  const [query, setQuery] = useState("pizza");
  const [applied, setApplied] = useState(false);
  const food = useMemo(() => foodForWhatIf(query), [query]);
  const result = food?.nutrients ? runWhatIf(ctx, food.nutrients) : null;
  const alternative = result?.alternatives[0];

  return (
    <AppShell>
      <PageIntro
        kicker="What-If Nutrition™"
        title="Simulate before you log"
        body="See calories and score move before anything is saved. Apply only when you want it on the log."
      />
      <Card>
        <label className="text-sm">
          What happens if I eat…
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setApplied(false);
            }}
          />
        </label>
        {result && food ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/4 p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Before</p>
              <p className="mt-2 text-2xl font-semibold">{formatKcal(result.before.calories)}</p>
              <p className="text-sm text-muted">Score {result.before.score}</p>
              <p className="text-sm text-muted">{formatGrams(result.before.protein)} protein</p>
            </div>
            <div className="rounded-2xl bg-accent/10 p-4">
              <p className="text-xs uppercase tracking-wide text-accent">After {food.name}</p>
              <p className="mt-2 text-2xl font-semibold">{formatKcal(result.after.calories)}</p>
              <p className="text-sm text-muted">Score {result.after.score}</p>
              <p className="text-sm text-muted">{formatGrams(result.after.protein)} protein</p>
            </div>
            <p className="text-sm md:col-span-2">{result.explanation}</p>
            {result.overCalories > 0 ? (
              <p className="text-sm text-orange md:col-span-2">About {Math.round(result.overCalories)} kcal above today&apos;s target.</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Try “pizza”, “salmon” or a recipe name. Estimates are not a lab analysis.</p>
        )}
      </Card>
      {alternative ? (
        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Better alternative</p>
          <p className="mt-2 text-lg font-medium">{alternative.title}</p>
          <p className="text-sm text-muted">
            {formatKcal(alternative.nutrients.calories)} · {formatGrams(alternative.nutrients.protein)} protein
          </p>
          {result ? (
            <p className="mt-2 text-sm">
              Nutrition Score {result.before.score} → {result.after.score}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                logMeal(mealFromRecommendation(alternative, date));
                setApplied(true);
              }}
            >
              Apply
            </Button>
            <Button variant="secondary" onClick={() => setQuery("chicken bowl")}>
              Try another
            </Button>
            <Button variant="ghost" href="/app/dashboard">
              Cancel
            </Button>
          </div>
          {applied ? <p className="mt-3 text-sm text-accent">Applied. Your log and Core now include this meal.</p> : null}
        </Card>
      ) : null}
    </AppShell>
  );
}
