"use client";

import { dayNutrition } from "@/lib/selectors";
import type { Meal, NutritionTargets, WaterEntry } from "@/lib/types";
import { addDays, cn, weekdayName } from "@/lib/utils";

export function NutritionGalaxy({
  endDate,
  meals,
  water,
  targets,
  onSelect,
}: {
  endDate: string;
  meals: Meal[];
  water: WaterEntry[];
  targets: NutritionTargets;
  onSelect?: (date: string) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(endDate, i - 6));
  return (
    <div className="flex items-end justify-between gap-1">
      {days.map((date) => {
        const day = dayNutrition(meals, water, targets, date);
        const size = 10 + Math.min(14, day.mealCount * 4);
        const glow = day.score.total / 100;
        return (
          <button key={date} type="button" onClick={() => onSelect?.(date)} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide text-muted">{weekdayName(date).slice(0, 3)}</span>
            <span
              className={cn("rounded-full bg-accent")}
              style={{
                width: size,
                height: size,
                opacity: 0.25 + glow * 0.75,
                boxShadow: `0 0 ${8 + glow * 18}px rgba(61,255,143,${0.15 + glow * 0.35})`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
