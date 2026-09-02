import { FOODS } from "@/lib/data/foods";
import { RECIPES } from "@/lib/data/recipes";
import { addNutrients, calculateScore, remainingNutrients } from "@/lib/nutrition";
import type { DayNutrition, Meal, Nutrients, NutritionTargets, WaterEntry } from "@/lib/types";
import { formatDateISO } from "@/lib/utils";

export function mealsOn(meals: Meal[], date: string): Meal[] {
  return meals.filter((meal) => meal.date === date).sort((a, b) => a.time.localeCompare(b.time));
}

export function waterCupsOn(entries: WaterEntry[], date: string): number {
  return entries.filter((entry) => entry.date === date).reduce((sum, entry) => sum + entry.cups, 0);
}

export function sumMeals(meals: Meal[]): Nutrients {
  return addNutrients(...meals.flatMap((meal) => meal.items.map((item) => item.nutrients)));
}

export function vegetableServings(meals: Meal[]): number {
  const ids = new Set(
    meals.flatMap((meal) =>
      meal.items
        .filter((item) => {
          const name = item.foodName.toLowerCase();
          return (
            name.includes("salad") ||
            name.includes("spinach") ||
            name.includes("broccoli") ||
            name.includes("kale") ||
            name.includes("carrot") ||
            name.includes("pepper") ||
            name.includes("tomato") ||
            name.includes("berry") ||
            name.includes("apple") ||
            name.includes("orange") ||
            name.includes("mango") ||
            name.includes("avocado") ||
            name.includes("edamame") ||
            name.includes("lentil") ||
            name.includes("chana") ||
            name.includes("dal") ||
            name.includes("veg")
          );
        })
        .map((item) => item.id),
    ),
  );
  return ids.size;
}

export function dayNutrition(
  meals: Meal[],
  water: WaterEntry[],
  targets: NutritionTargets,
  date = formatDateISO(),
): DayNutrition {
  const dayMeals = mealsOn(meals, date);
  const totals = sumMeals(dayMeals);
  const waterCups = waterCupsOn(water, date);
  const remaining = remainingNutrients(totals, targets);
  remaining.waterCups = targets.waterCups - waterCups;
  const score = calculateScore(totals, waterCups, targets, dayMeals.length, vegetableServings(dayMeals));
  return {
    date,
    totals,
    waterCups,
    meals: dayMeals,
    remaining,
    score,
    mealCount: dayMeals.length,
  };
}

export function loggingStreak(meals: Meal[], from = formatDateISO()): number {
  const dates = new Set(meals.map((meal) => meal.date));
  let streak = 0;
  const cursor = new Date(`${from}T12:00:00`);
  while (dates.has(formatDateISO(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function foodCatalogSize() {
  return FOODS.length + RECIPES.length;
}

export type DayStatus = "not-started" | "active" | "complete" | "incomplete";

export function dayStatus(day: DayNutrition, targets: NutritionTargets): DayStatus {
  if (day.mealCount === 0 && day.waterCups === 0) return "not-started";
  const mealsOk = day.mealCount >= 3;
  const caloriesOk = day.totals.calories >= targets.calories * 0.85;
  const proteinOk = day.totals.protein >= targets.protein * 0.85;
  if (mealsOk && caloriesOk && proteinOk) return "complete";
  if (day.mealCount >= 1) return "active";
  return "incomplete";
}

export function loggedDates(meals: Meal[], water: WaterEntry[]): string[] {
  return [...new Set([...meals.map((meal) => meal.date), ...water.map((entry) => entry.date)])].sort();
}

export function compareDays(left: DayNutrition, right: DayNutrition) {
  return {
    score: left.score.total - right.score.total,
    calories: Math.round(left.totals.calories - right.totals.calories),
    protein: Math.round((left.totals.protein - right.totals.protein) * 10) / 10,
    carbs: Math.round((left.totals.carbs - right.totals.carbs) * 10) / 10,
    fat: Math.round((left.totals.fat - right.totals.fat) * 10) / 10,
    fiber: Math.round((left.totals.fiber - right.totals.fiber) * 10) / 10,
    water: left.waterCups - right.waterCups,
  };
}

export const mealsOnDate = mealsOn;
export const waterCupsOnDate = waterCupsOn;

