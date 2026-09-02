"use client";

import { Button } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { mealFromRecommendation } from "@/lib/log-rec";
import { foodForWhatIf, runWhatIf } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { formatKcal } from "@/lib/utils";
import { useMemo, useState } from "react";

export function WhatIfSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { ctx, date } = useToday();
  const logMeal = useNutrician((s) => s.logMeal);
  const [query, setQuery] = useState("pizza");
  const food = useMemo(() => foodForWhatIf(query), [query]);
  const result = food?.nutrients ? runWhatIf(ctx, food.nutrients) : null;
  const alternative = result?.alternatives[0];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/55 md:place-items-center md:p-6" role="dialog" aria-label="What-If Nutrition">
      <div className="w-full rounded-t-3xl border border-white/10 bg-[#0c1110] p-5 md:max-w-lg md:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple">What-If Nutrition</p>
            <h2 className="mt-1 text-xl font-semibold">What happens if I eat…</h2>
          </div>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Cancel
          </button>
        </div>
        <input
          className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a food or meal"
        />
        {result && food ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/4 p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted">Before</p>
              <p className="mt-2 text-2xl font-semibold">{formatKcal(result.before.calories)}</p>
              <p className="text-sm text-muted">Score {result.before.score}</p>
            </div>
            <div className="rounded-2xl bg-accent/10 p-4">
              <p className="text-[11px] uppercase tracking-wide text-accent">After {food.name}</p>
              <p className="mt-2 text-2xl font-semibold">{formatKcal(result.after.calories)}</p>
              <p className="text-sm text-muted">Score {result.after.score}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Try pizza, salmon, or a recipe name. Estimates, not lab values.</p>
        )}
        {alternative ? (
          <div className="mt-4 rounded-2xl border border-white/8 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Better alternative</p>
            <p className="mt-1 font-medium">{alternative.title}</p>
            <p className="text-sm text-muted">
              Score {result?.before.score} → {result ? result.before.score + 2 : "—"} · {formatKcal(alternative.nutrients.calories)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  logMeal(mealFromRecommendation(alternative, date));
                  onClose();
                }}
              >
                Apply
              </Button>
              <Button variant="secondary" onClick={() => setQuery("chicken bowl")}>
                Try another
              </Button>
            </div>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-muted">Simulation does not change your log until you press Apply.</p>
      </div>
    </div>
  );
}
