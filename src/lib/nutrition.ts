import type { Micros, Nutrients, NutritionTargets, Profile, ScoreBreakdown } from "./types";
import { clamp, round } from "./utils";

export const EMPTY_MICROS: Micros = {
  vitaminA: 0,
  vitaminB: 0,
  vitaminC: 0,
  vitaminD: 0,
  vitaminE: 0,
  vitaminK: 0,
  iron: 0,
  calcium: 0,
  magnesium: 0,
  zinc: 0,
  potassium: 0,
};

export const EMPTY_NUTRIENTS: Nutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  ...EMPTY_MICROS,
};

export const MICRO_META: { key: keyof Micros; label: string; unit: string; group: "vitamin" | "mineral" }[] = [
  { key: "vitaminA", label: "Vitamin A", unit: "%DV", group: "vitamin" },
  { key: "vitaminB", label: "Vitamin B", unit: "%DV", group: "vitamin" },
  { key: "vitaminC", label: "Vitamin C", unit: "%DV", group: "vitamin" },
  { key: "vitaminD", label: "Vitamin D", unit: "%DV", group: "vitamin" },
  { key: "vitaminE", label: "Vitamin E", unit: "%DV", group: "vitamin" },
  { key: "vitaminK", label: "Vitamin K", unit: "%DV", group: "vitamin" },
  { key: "iron", label: "Iron", unit: "%DV", group: "mineral" },
  { key: "calcium", label: "Calcium", unit: "%DV", group: "mineral" },
  { key: "magnesium", label: "Magnesium", unit: "%DV", group: "mineral" },
  { key: "zinc", label: "Zinc", unit: "%DV", group: "mineral" },
  { key: "potassium", label: "Potassium", unit: "%DV", group: "mineral" },
];

export function nutrients(partial: Partial<Nutrients>): Nutrients {
  return { ...EMPTY_NUTRIENTS, ...partial };
}

export function scaleNutrients(base: Nutrients, servings: number): Nutrients {
  const out = { ...EMPTY_NUTRIENTS };
  (Object.keys(base) as (keyof Nutrients)[]).forEach((key) => {
    out[key] = round(base[key] * servings, 2);
  });
  return out;
}

export function addNutrients(...list: Nutrients[]): Nutrients {
  return list.reduce((acc, item) => {
    const next = { ...acc };
    (Object.keys(item) as (keyof Nutrients)[]).forEach((key) => {
      next[key] = round(acc[key] + item[key], 2);
    });
    return next;
  }, { ...EMPTY_NUTRIENTS });
}

export function remainingNutrients(consumed: Nutrients, targets: NutritionTargets): Nutrients & { waterCups: number } {
  const remaining = { ...EMPTY_NUTRIENTS, waterCups: 0 };
  remaining.calories = round(targets.calories - consumed.calories, 0);
  remaining.protein = round(targets.protein - consumed.protein, 1);
  remaining.carbs = round(targets.carbs - consumed.carbs, 1);
  remaining.fat = round(targets.fat - consumed.fat, 1);
  remaining.fiber = round(targets.fiber - consumed.fiber, 1);
  remaining.sugar = round(targets.sugar - consumed.sugar, 1);
  remaining.sodium = round(targets.sodium - consumed.sodium, 0);
  remaining.waterCups = 0;
  (Object.keys(EMPTY_MICROS) as (keyof Micros)[]).forEach((key) => {
    remaining[key] = round(targets.micros[key] - consumed[key], 0);
  });
  return remaining;
}

export function bmr(profile: Profile): number {
  const { weightKg, heightCm, age, sex } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === "male") return base + 5;
  if (sex === "female") return base - 161;
  return base - 78;
}

const ACTIVITY_FACTOR: Record<Profile["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function computeTargets(profile: Profile): NutritionTargets {
  const tdee = bmr(profile) * ACTIVITY_FACTOR[profile.activityLevel];
  let calories = tdee;
  if (profile.mainGoal === "weight-management") calories -= 350;
  if (profile.mainGoal === "muscle-gain") calories += 250;
  calories = round(clamp(calories, 1400, 3800), 0);

  let proteinPerKg = 1.4;
  if (profile.mainGoal === "muscle-gain" || profile.mainGoal === "increase-protein") proteinPerKg = 1.8;
  if (profile.mainGoal === "fitness") proteinPerKg = 1.6;
  const protein = round(profile.weightKg * proteinPerKg, 0);
  const fat = round((calories * 0.28) / 9, 0);
  const carbs = round((calories - protein * 4 - fat * 9) / 4, 0);
  const waterCups = profile.mainGoal === "improve-hydration" ? 10 : 8;

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber: 30,
    sugar: 40,
    sodium: 2300,
    waterCups,
    micros: {
      vitaminA: 100,
      vitaminB: 100,
      vitaminC: 100,
      vitaminD: 100,
      vitaminE: 100,
      vitaminK: 100,
      iron: 100,
      calcium: 100,
      magnesium: 100,
      zinc: 100,
      potassium: 100,
    },
  };
}

function closeness(value: number, target: number, overPenalty = true): number {
  if (!target) return 0;
  const ratio = value / target;
  if (ratio <= 1) return ratio;
  if (!overPenalty) return 1;
  return clamp(1 - (ratio - 1) * 0.7, 0, 1);
}

export function scoreLabel(total: number): ScoreBreakdown["label"] {
  if (total >= 90) return "Excellent";
  if (total >= 80) return "Great";
  if (total >= 68) return "Good";
  if (total >= 50) return "Building";
  return "Needs work";
}

export function calculateScore(
  totals: Nutrients,
  waterCups: number,
  targets: NutritionTargets,
  mealCount: number,
  vegetableServings = 0,
): ScoreBreakdown {
  const factors: ScoreBreakdown["factors"] = [];
  let total = 52;

  const proteinPts = round(closeness(totals.protein, targets.protein) * 14, 0);
  factors.push({
    label: "Protein target",
    delta: proteinPts - 7,
    detail: `${round(totals.protein, 0)}g of ${targets.protein}g`,
  });
  total += proteinPts - 7;

  const caloriePts = round(closeness(totals.calories, targets.calories) * 10, 0);
  factors.push({
    label: "Calorie alignment",
    delta: caloriePts - 5,
    detail: `${round(totals.calories, 0)} of ${targets.calories} kcal`,
  });
  total += caloriePts - 5;

  const fiberPts = round(closeness(totals.fiber, targets.fiber, false) * 8, 0);
  factors.push({
    label: "Fiber",
    delta: fiberPts - 4,
    detail: `${round(totals.fiber, 0)}g of ${targets.fiber}g`,
  });
  total += fiberPts - 4;

  const waterPts = round(closeness(waterCups, targets.waterCups, false) * 8, 0);
  factors.push({
    label: "Hydration",
    delta: waterPts - 4,
    detail: `${waterCups} of ${targets.waterCups} cups`,
  });
  total += waterPts - 4;

  const vegPts = round(clamp(vegetableServings / 3, 0, 1) * 6, 0);
  factors.push({
    label: "Produce",
    delta: vegPts - 3,
    detail: `${round(vegetableServings, 1)} vegetable/fruit servings`,
  });
  total += vegPts - 3;

  const sugarDelta = totals.sugar > targets.sugar ? -Math.min(8, Math.round((totals.sugar - targets.sugar) / 6)) : 2;
  factors.push({
    label: "Sugar",
    delta: sugarDelta,
    detail: `${round(totals.sugar, 0)}g vs ${targets.sugar}g target`,
  });
  total += sugarDelta;

  const sodiumDelta = totals.sodium > targets.sodium ? -Math.min(6, Math.round((totals.sodium - targets.sodium) / 250)) : 2;
  factors.push({
    label: "Sodium",
    delta: sodiumDelta,
    detail: `${round(totals.sodium, 0)}mg vs ${targets.sodium}mg`,
  });
  total += sodiumDelta;

  const mealPts = mealCount >= 3 ? 6 : mealCount === 2 ? 2 : mealCount === 1 ? -2 : -6;
  factors.push({
    label: "Meal consistency",
    delta: mealPts - 2,
    detail: `${mealCount} meals logged`,
  });
  total += mealPts - 2;

  const clamped = round(clamp(total, 0, 100), 0);
  return { total: clamped, label: scoreLabel(clamped), factors };
}

export function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inch = round(totalIn - ft * 12, 0);
  return { ft, inch };
}

export function kgToLb(kg: number): number {
  return round(kg * 2.20462, 1);
}

export function lbToKg(lb: number): number {
  return round(lb / 2.20462, 1);
}

export function ftInToCm(ft: number, inch: number): number {
  return round((ft * 12 + inch) * 2.54, 0);
}

