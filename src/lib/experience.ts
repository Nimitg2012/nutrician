import type { DayNutrition, NutritionTargets } from "@/lib/types";

export function greeting(name: string, now = new Date()) {
  const hour = now.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${hello}, ${name}`;
}

export function pctOf(used: number, target: number) {
  if (!target) return 0;
  return Math.round((used / target) * 100);
}

export type CoreKey = "protein" | "fiber" | "water" | "energy" | "calories";
export type CoreTone = "good" | "watch" | "needs" | "high";

export function toneFor(pct: number): CoreTone {
  if (pct < 55) return "needs";
  if (pct < 85) return "watch";
  if (pct <= 112) return "good";
  return "high";
}

export function coreMetrics(day: DayNutrition, targets: NutritionTargets) {
  const calories = pctOf(day.totals.calories, targets.calories);
  return {
    protein: { pct: pctOf(day.totals.protein, targets.protein), used: day.totals.protein, target: targets.protein, unit: "g" },
    fiber: { pct: pctOf(day.totals.fiber, targets.fiber), used: day.totals.fiber, target: targets.fiber, unit: "g" },
    water: { pct: pctOf(day.waterCups, targets.waterCups), used: day.waterCups, target: targets.waterCups, unit: "cups" },
    calories: { pct: calories, used: day.totals.calories, target: targets.calories, unit: "kcal" },
    energy: { pct: calories, used: day.totals.calories, target: targets.calories, unit: "kcal" },
  };
}

export function stateLine(day: DayNutrition, targets: NutritionTargets) {
  const protein = pctOf(day.totals.protein, targets.protein);
  const fiber = pctOf(day.totals.fiber, targets.fiber);
  const water = pctOf(day.waterCups, targets.waterCups);
  const score = day.score.total;
  const mood = score >= 80 ? "You're doing well." : score >= 60 ? "The day is still recoverable." : "Today needs a clear next move.";
  const attention =
    protein < 75 ? "Protein needs attention." : fiber < 70 ? "Fiber needs attention." : water < 70 ? "Hydration needs attention." : "Nothing urgent.";
  const calm = water >= 75 ? "Hydration is on track." : protein >= 80 ? "Protein is holding." : null;
  return { mood, attention, calm, score };
}

export function nextMoveCopy(day: DayNutrition, targets: NutritionTargets) {
  const proteinLeft = Math.max(0, day.remaining.protein);
  const fiberLeft = Math.max(0, day.remaining.fiber);
  const kcalLeft = Math.max(0, day.remaining.calories);
  if (day.mealCount === 0) {
    return {
      title: "Log your first meal",
      body: "The Core stays quiet until there is something to understand. Start with breakfast or a protein plate.",
    };
  }
  if (proteinLeft > 20 && fiberLeft > 8) {
    return {
      title: "Have a high-protein, high-fiber dinner.",
      body: `You still need about ${Math.round(proteinLeft)}g protein and ${Math.round(fiberLeft)}g fiber, with ~${Math.round(kcalLeft)} kcal left.`,
    };
  }
  if (proteinLeft > 20) {
    return {
      title: "Close the protein gap at the next meal.",
      body: `${Math.round(proteinLeft)}g protein remaining, without exceeding ~${Math.round(kcalLeft)} kcal.`,
    };
  }
  if (fiberLeft > 8) {
    return {
      title: "Add fiber before the day closes.",
      body: `Fiber is ${Math.round(fiberLeft)}g short. Lentils, greens or a vegetable-forward plate will move the score more than another snack.`,
    };
  }
  if (day.waterCups < targets.waterCups - 2) {
    return {
      title: "Drink water before the next meal.",
      body: `${day.waterCups} of ${targets.waterCups} cups so far. Two cups now is the cheapest improvement.`,
    };
  }
  return {
    title: "Stay near target through the next meal.",
    body: `Score ${day.score.total}. A balanced remaining plate keeps the Core calm.`,
  };
}
