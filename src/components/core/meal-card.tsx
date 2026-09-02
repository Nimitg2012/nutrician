"use client";

import { mealTypeLabel } from "@/lib/store";
import type { Meal } from "@/lib/types";
import { formatGrams, formatKcal } from "@/lib/utils";
import { useState } from "react";

export function MealCard({ meal, delta }: { meal: Meal; delta?: number }) {
  const [open, setOpen] = useState(false);
  const calories = meal.items.reduce((sum, item) => sum + item.nutrients.calories, 0);
  const protein = meal.items.reduce((sum, item) => sum + item.nutrients.protein, 0);
  const carbs = meal.items.reduce((sum, item) => sum + item.nutrients.carbs, 0);
  const fat = meal.items.reduce((sum, item) => sum + item.nutrients.fat, 0);

  return (
    <article className="rounded-3xl border border-white/8 bg-bg-card p-4">
      <button type="button" className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpen((v) => !v)}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{mealTypeLabel(meal.type)}</p>
          <p className="mt-1 font-medium">{meal.name}</p>
          <p className="mt-1 text-sm text-muted">
            {formatKcal(calories)} · {formatGrams(protein)} P · {formatGrams(carbs)} C · {formatGrams(fat)} F
          </p>
        </div>
        {typeof delta === "number" ? (
          <span className="shrink-0 rounded-full bg-accent/12 px-2.5 py-1 text-[11px] font-semibold text-accent">
            {delta >= 0 ? "+" : ""}
            {delta} score
          </span>
        ) : null}
      </button>
      {open ? (
        <ul className="mt-3 space-y-1 border-t border-white/8 pt-3 text-sm text-muted">
          {meal.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                {item.foodName} · {item.servings}×
              </span>
              <span>{formatKcal(item.nutrients.calories)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
