"use client";

import type { Meal, MealType, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLOTS: { type: MealType; label: string }[] = [
  { type: "breakfast", label: "Breakfast" },
  { type: "lunch", label: "Lunch" },
  { type: "snack", label: "Snack" },
  { type: "dinner", label: "Dinner" },
];

export function DayTimeline({ meals, schedule }: { meals: Meal[]; schedule: Profile["mealSchedule"] }) {
  const hour = new Date().getHours();
  const nowSlot: MealType = hour < 11 ? "breakfast" : hour < 15 ? "lunch" : hour < 17 ? "snack" : "dinner";

  return (
    <ol className="mt-10 flex justify-between gap-2">
      {SLOTS.map((slot) => {
        const logged = meals.some((meal) => meal.type === slot.type);
        const time = slot.type === "snack" ? "16:00" : schedule[slot.type];
        const isNow = slot.type === nowSlot;
        return (
          <li key={slot.type} className="flex-1 text-center">
            <p className={cn("text-[10px] font-semibold uppercase tracking-wide text-muted", isNow && "text-accent")}>{isNow ? "Now" : time}</p>
            <div className={cn("mx-auto mt-2 h-2 w-2 rounded-full", logged ? "bg-accent" : isNow ? "bg-orange" : "bg-white/20")} />
            <p className="mt-2 text-[11px] text-muted">{slot.label}</p>
            <p className="text-xs">{logged ? "✓" : isNow ? "?" : "—"}</p>
          </li>
        );
      })}
    </ol>
  );
}
