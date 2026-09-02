"use client";

import type { CoreKey } from "@/lib/experience";
import { coreMetrics } from "@/lib/experience";
import type { DayNutrition, Meal, NutritionTargets, Recommendation } from "@/lib/types";
import { formatGrams } from "@/lib/utils";

export function MetricDetail({
  metric,
  day,
  targets,
  recs,
  onClose,
}: {
  metric: CoreKey;
  day: DayNutrition;
  targets: NutritionTargets;
  recs: Recommendation[];
  onClose: () => void;
}) {
  const data = coreMetrics(day, targets)[metric];
  const byMeal = (["breakfast", "lunch", "snack", "dinner"] as const).map((type) => ({
    type,
    grams: day.meals.filter((meal) => meal.type === type).reduce((sum, meal) => sum + mealValue(meal, metric), 0),
  }));
  const left = Math.max(0, data.target - data.used);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 md:place-items-center md:p-6" role="dialog" aria-label={`${metric} detail`}>
      <div className="w-full rounded-t-3xl border border-white/10 bg-[#0c1110] p-5 md:max-w-md md:rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{metric}</p>
            <p className="mt-1 text-3xl font-semibold">
              {Math.round(data.used)} / {data.target}
              <span className="ml-1 text-base text-muted">{data.unit}</span>
            </p>
          </div>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {byMeal.map((row) => (
            <li key={row.type} className="flex justify-between capitalize text-muted">
              <span>{row.type}</span>
              <span>{metric === "calories" || metric === "energy" ? Math.round(row.grams) : formatGrams(row.grams)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">{Math.round(left)} remaining.</p>
        {recs.length ? <p className="mt-3 text-sm text-muted">Suggested: {recs.map((rec) => rec.title).join(" · ")}</p> : null}
      </div>
    </div>
  );
}

function mealValue(meal: Meal, metric: CoreKey) {
  return meal.items.reduce((sum, item) => {
    if (metric === "water") return sum;
    if (metric === "calories" || metric === "energy") return sum + item.nutrients.calories;
    if (metric === "protein") return sum + item.nutrients.protein;
    return sum + item.nutrients.fiber;
  }, 0);
}
