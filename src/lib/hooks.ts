"use client";

import { dayNutrition } from "@/lib/selectors";
import type { AIContext } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";

export function useToday() {
  const meals = useNutrician((s) => s.meals);
  const water = useNutrician((s) => s.water);
  const targets = useNutrician((s) => s.targets);
  const date = useNutrician((s) => s.selectedDate);
  const profile = useNutrician((s) => s.profile);
  const session = useNutrician((s) => s.session);
  const day = dayNutrition(meals, water, targets, date);
  const ctx: AIContext = {
    profile,
    targets,
    meals,
    water,
    date,
    plan: session?.plan === "premium" ? "premium" : "free",
  };
  return { meals, water, targets, date, profile, session, day, ctx };
}
