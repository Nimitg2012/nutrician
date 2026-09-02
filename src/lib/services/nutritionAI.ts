import { FOOD_BY_ID, FOODS } from "@/lib/data/foods";
import { RECIPE_BY_ID, RECIPES, recipeNutrients } from "@/lib/data/recipes";
import { calculateScore, remainingNutrients } from "@/lib/nutrition";
import { dayNutrition, mealsOn, vegetableServings, waterCupsOn } from "@/lib/selectors";
import type {
  ChatMessage,
  Insight,
  Meal,
  MealType,
  Nutrients,
  NutritionTargets,
  Profile,
  Recommendation,
  WaterEntry,
  WeeklyReview,
  WhatIfResult,
} from "@/lib/types";
import { addDays, formatDisplayDate, formatGrams, formatKcal, formatNumber, rangeDays, round, uid, weekdayName } from "@/lib/utils";

export interface AIContext {
  profile: Profile;
  targets: NutritionTargets;
  meals: Meal[];
  water: WaterEntry[];
  date: string;
  plan: "free" | "premium";
}

function day(ctx: AIContext, date = ctx.date) {
  return dayNutrition(ctx.meals, ctx.water, ctx.targets, date);
}

function timeOfDay(now = new Date()): "morning" | "lunch" | "snack" | "dinner" | "evening" {
  const hour = now.getHours();
  if (hour < 11) return "morning";
  if (hour < 14) return "lunch";
  if (hour < 17) return "snack";
  if (hour < 21) return "dinner";
  return "evening";
}

function dietOk(tags: string[], profile: Profile): boolean {
  const avoid = [...profile.allergies, ...profile.foodsToAvoid].map((item) => item.toLowerCase());
  const hay = tags.join(" ").toLowerCase();
  if (avoid.some((item) => item.includes("peanut") && hay.includes("peanut"))) return false;
  if (avoid.some((item) => item.length > 3 && hay.includes(item))) return false;
  if (profile.dietPreference === "vegan") return tags.includes("vegan") || hay.includes("vegan");
  if (profile.dietPreference === "vegetarian") {
    return !["chicken", "salmon", "tuna", "shrimp", "beef", "turkey"].some((meat) => hay.includes(meat));
  }
  return true;
}

export function recommendMeals(ctx: AIContext, count = 3): Recommendation[] {
  const today = day(ctx);
  const remainingCal = Math.max(220, today.remaining.calories);
  const needProtein = today.remaining.protein > 8;
  const needFiber = today.remaining.fiber > 6;

  const scored = RECIPES.filter((recipe) => dietOk(recipe.tags, ctx.profile))
    .map((recipe) => {
      let score = 0;
      if (needProtein) score += recipe.protein;
      if (needFiber) score += recipe.fiber * 2;
      const calFit = 1 - Math.min(1, Math.abs(recipe.calories - Math.min(remainingCal, 520)) / 400);
      score += calFit * 30;
      if (recipe.calories > remainingCal + 180) score -= 40;
      if (ctx.profile.dietPreference === "high-protein") score += recipe.protein * 0.3;
      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  const reason = needProtein
    ? `You still need about ${formatGrams(Math.max(0, today.remaining.protein))} protein with ${formatKcal(Math.max(0, today.remaining.calories))} remaining.`
    : needFiber
      ? `Fiber is still ${formatGrams(Math.max(0, today.remaining.fiber))} short of target.`
      : `These options fit today's remaining ${formatKcal(Math.max(0, today.remaining.calories))}.`;

  return scored.map(({ recipe }) => ({
    id: recipe.id,
    title: recipe.name,
    reason,
    recipeId: recipe.id,
    nutrients: {
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      fiber: recipe.fiber,
    },
  }));
}

export function calculateNextBestAction(ctx: AIContext) {
  const today = day(ctx);
  const slot = timeOfDay();
  const rec = recommendMeals(ctx, 1)[0];

  if (today.waterCups < ctx.targets.waterCups - 3 && slot !== "morning") {
    return {
      title: "Drink water before the next meal",
      body: `Hydration is ${today.waterCups}/${ctx.targets.waterCups} cups. Two cups now will protect your Nutrition Score without adding calories.`,
      href: "/app/water",
      cta: "Add 2 cups",
    };
  }

  if (today.remaining.protein > 20 && rec) {
    return {
      title: `Log a high-protein ${slot === "morning" ? "breakfast" : slot === "evening" ? "dinner" : "meal"}`,
      body: `${rec.reason} ${rec.title} is a strong next move.`,
      href: "/app/meals",
      cta: "Add to Today's Plan",
    };
  }

  if (today.remaining.fiber > 8) {
    return {
      title: "Close the fiber gap at the next meal",
      body: `Fiber is still ${formatGrams(today.remaining.fiber)} below target. A lentil or vegetable-forward plate will move Nutrition Score more than another shake.`,
      href: "/app/recipes",
      cta: "View high-fiber meals",
    };
  }

  if (today.mealCount === 0) {
    return {
      title: "Log your first meal of the day",
      body: "Nutrician Intelligence needs a log before it can recommend the next move.",
      href: "/app/meals",
      cta: "Log a meal",
    };
  }

  return {
    title: "Stay near target through the next meal",
    body: `You're at ${formatKcal(today.totals.calories)} of ${formatKcal(ctx.targets.calories)}. A balanced remaining meal keeps the score in the ${today.score.label.toLowerCase()} range.`,
    href: "/app/what-if",
    cta: "Simulate a meal",
  };
}

export function generateBrief(ctx: AIContext) {
  const today = day(ctx);
  const slot = timeOfDay();
  const proteinGap = today.remaining.protein;
  const waterOk = today.waterCups >= ctx.targets.waterCups - 2;
  const calPct = Math.round((today.totals.calories / ctx.targets.calories) * 100);

  let summary = "";
  if (slot === "morning") {
    summary = today.totals.protein >= 20
      ? "You're off to a strong start with protein. Keep the next meal protein-aware and the day stays easy."
      : "Morning is the cheapest time to bank protein. A yogurt, egg, or smoothie now prevents a scramble at dinner.";
  } else if (slot === "lunch") {
    summary = proteinGap > 25
      ? `You're currently low on protein. There are lunch options that fit today's remaining ${formatKcal(Math.max(0, today.remaining.calories))}.`
      : "Lunch is on a solid track. Watch fiber and leave room for an evening plate.";
  } else if (slot === "snack") {
    summary = `You've used ${calPct}% of today's calorie target. ${proteinGap > 15 ? "Choose a protein-dense snack rather than a grazing plate." : "Lighter snack options will keep dinner flexible."}`;
  } else if (slot === "dinner") {
    summary = today.remaining.fiber > 8
      ? "Your fiber target is still low. Here's a dinner direction that also respects remaining calories."
      : `Dinner can close the day: ${formatGrams(Math.max(0, proteinGap))} protein and ${formatKcal(Math.max(0, today.remaining.calories))} still available.`;
  } else {
    summary = `Nutrition Score: ${today.score.total}/100. ${today.totals.protein >= ctx.targets.protein * 0.85 ? "Protein" : "Calories"} and ${waterOk ? "hydration were strong" : "hydration can improve"}; ${today.remaining.fiber > 5 ? "fiber can improve tomorrow." : "the day is well balanced."}`;
  }

  return { summary, action: calculateNextBestAction(ctx) };
}

export function analyzeDay(ctx: AIContext): Insight[] {
  const today = day(ctx);
  const insights: Insight[] = [];
  const dates = rangeDays(ctx.date, 4);
  const fiberLowDays = dates.filter((date) => day(ctx, date).totals.fiber < ctx.targets.fiber * 0.75);

  if (fiberLowDays.length >= 3) {
    insights.push({
      id: "fiber-streak",
      severity: "attention",
      title: "Fiber has been below target",
      body: `Your fiber intake has been below target for ${fiberLowDays.length} consecutive days. A lentil bowl or extra vegetables at dinner is the fastest correction.`,
      cta: { label: "See high-fiber recipes", href: "/app/recipes?filter=high-fiber" },
    });
  }

  if (today.remaining.protein > 20) {
    insights.push({
      id: "protein-gap",
      severity: "attention",
      title: `You're ${formatGrams(today.remaining.protein)} short of today's protein target`,
      body: `Based on remaining calories (${formatKcal(Math.max(0, today.remaining.calories))}) and your preferences, Nutrician can close the gap without overshooting.`,
      cta: { label: "View meal recommendations", href: "/app/meals" },
    });
  } else {
    insights.push({
      id: "protein-ok",
      severity: "positive",
      title: "Protein is on track",
      body: `${formatGrams(today.totals.protein)} of ${ctx.targets.protein}g is already logged. Hold the line with a balanced remaining meal.`,
    });
  }

  if (today.waterCups >= ctx.targets.waterCups - 1) {
    insights.push({
      id: "water-ok",
      severity: "positive",
      title: "Hydration is in range",
      body: `${today.waterCups}/${ctx.targets.waterCups} cups logged. Keep a glass nearby through the evening.`,
    });
  } else {
    insights.push({
      id: "water-gap",
      severity: "attention",
      title: "Hydration is behind",
      body: `${today.waterCups} of ${ctx.targets.waterCups} cups so far. Two cups now is the cheapest score improvement available.`,
      cta: { label: "Add water", href: "/app/water" },
    });
  }

  return insights;
}

export function detectPatterns(ctx: AIContext): Insight[] {
  const days = rangeDays(ctx.date, 21);
  const weekdayBreakfastSkip: Record<string, { skip: number; total: number }> = {};
  const weekendWater: number[] = [];
  const weekdayWater: number[] = [];
  const fridayTimes: number[] = [];
  const plannedProtein: number[] = [];
  const improvisedProtein: number[] = [];

  days.forEach((date) => {
    if (date === ctx.date) return;
    const weekday = weekdayName(date);
    const dayMeals = mealsOn(ctx.meals, date);
    const breakfast = dayMeals.some((meal) => meal.type === "breakfast");
    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(weekday)) {
      weekdayBreakfastSkip[weekday] ??= { skip: 0, total: 0 };
      weekdayBreakfastSkip[weekday].total += 1;
      if (!breakfast) weekdayBreakfastSkip[weekday].skip += 1;
    }
    const cups = waterCupsOn(ctx.water, date);
    if (weekday === "Saturday" || weekday === "Sunday") weekendWater.push(cups);
    else weekdayWater.push(cups);
    if (weekday === "Friday") {
      const dinner = dayMeals.find((meal) => meal.type === "dinner");
      if (dinner) fridayTimes.push(Number(dinner.time.slice(0, 2)));
    }
    const lunch = dayMeals.find((meal) => meal.type === "lunch");
    const protein = day(ctx, date).totals.protein;
    if (lunch?.notes === "planned") plannedProtein.push(protein);
    if (lunch?.notes === "improvised") improvisedProtein.push(protein);
  });

  const insights: Insight[] = [];
  const skipEntries = Object.entries(weekdayBreakfastSkip).filter(([, value]) => value.total >= 2 && value.skip / value.total >= 0.5);
  if (skipEntries.length >= 2) {
    insights.push({
      id: "skip-breakfast",
      severity: "attention",
      title: "Breakfast is often skipped on weekdays",
      body: "You often skip breakfast on weekdays. That usually shows up as a protein scramble after 4 p.m. An 8-minute yogurt or oat log would change the afternoon.",
      cta: { label: "Plan weekday breakfasts", href: "/app/planner" },
    });
  }

  const avg = (list: number[]) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);
  if (weekendWater.length >= 2 && weekdayWater.length >= 4 && avg(weekendWater) <= avg(weekdayWater) - 1.2) {
    insights.push({
      id: "weekend-water",
      severity: "attention",
      title: "Hydration drops on weekends",
      body: `Your hydration decreases on weekends (${avg(weekendWater).toFixed(1)} cups vs ${avg(weekdayWater).toFixed(1)} on weekdays). A two-cup morning anchor is enough to stop the drift.`,
      cta: { label: "Open water tracker", href: "/app/water" },
    });
  }

  if (plannedProtein.length >= 3 && improvisedProtein.length >= 3 && avg(plannedProtein) >= avg(improvisedProtein) + 8) {
    insights.push({
      id: "planned-lunch",
      severity: "positive",
      title: "Planned lunches protect protein",
      body: "Your protein intake is strongest on days when lunch is planned ahead. Keep two default lunches in the planner.",
      cta: { label: "Open meal planner", href: "/app/planner" },
    });
  }

  if (fridayTimes.length >= 2 && avg(fridayTimes) >= 20.5) {
    insights.push({
      id: "late-friday",
      severity: "info",
      title: "Friday dinners run late",
      body: "You consistently eat later on Fridays. If that's intentional, leave a protein-forward snack at 16:30 so the late meal doesn't have to do all the work.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "building",
      severity: "info",
      title: "Still gathering pattern signal",
      body: "Habit Intelligence needs a few more consistent logs before it can describe a reliable pattern. Keep logging — it will not invent insights.",
    });
  }

  return insights;
}

export function generateWeeklyReview(ctx: AIContext): WeeklyReview {
  const thisWeek = rangeDays(ctx.date, 7);
  const lastWeek = rangeDays(addDays(ctx.date, -7), 7);
  const stats = (dates: string[]) => {
    const days = dates.map((date) => day(ctx, date));
    const avgScore = avgOf(days.map((item) => item.score.total));
    const avgProtein = avgOf(days.map((item) => item.totals.protein));
    const avgWater = avgOf(days.map((item) => item.waterCups));
    const goalHits = days.filter((item) => item.totals.protein >= ctx.targets.protein * 0.9 && item.waterCups >= ctx.targets.waterCups * 0.75).length;
    const strongest = [...days].sort((a, b) => b.score.total - a.score.total)[0];
    const weakest = [...days].sort((a, b) => a.score.total - b.score.total)[0];
    return { avgScore, avgProtein, avgWater, goalHits, strongest, weakest, days };
  };
  const current = stats(thisWeek);
  const previous = stats(lastWeek);
  const proteinChange = percentChange(current.avgProtein, previous.avgProtein);
  const hydrationChange = percentChange(current.avgWater, previous.avgWater);
  const improved: string[] = [];
  const attention: string[] = [];
  const focus: string[] = [];

  if (proteinChange >= 3) improved.push(`Protein averaged ${formatGrams(current.avgProtein)} — ${proteinChange > 0 ? "+" : ""}${proteinChange}% vs last week.`);
  else attention.push("Protein did not move much week over week. Keep a default high-protein lunch.");

  if (hydrationChange >= 0) improved.push("Hydration held or improved compared with last week.");
  else attention.push(`Hydration is ${hydrationChange}% vs last week. Weekend cups are the likely leak.`);

  if (current.avgScore >= 80) improved.push(`Average Nutrition Score landed at ${Math.round(current.avgScore)}.`);
  else attention.push("Score is still being pulled down by fiber or consistency more than calories.");

  focus.push("Lock two weekday lunches in the planner.");
  focus.push("Set a weekend hydration anchor of 2 cups before 11 a.m.");
  if (current.days.some((item) => item.totals.fiber < ctx.targets.fiber * 0.7)) {
    focus.push("Add one high-fiber dinner template for the week.");
  }

  return {
    averageScore: round(current.avgScore, 0),
    proteinChange,
    hydrationChange,
    goalCompletion: round((current.goalHits / 7) * 100, 0),
    improved,
    attention,
    focus,
    strongestDay: current.strongest ? formatDisplayDate(current.strongest.date) : "—",
    weakestDay: current.weakest ? formatDisplayDate(current.weakest.date) : "—",
  };
}

function avgOf(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentChange(current: number, previous: number): number {
  if (!previous) return 0;
  return round(((current - previous) / previous) * 100, 0);
}

export function runWhatIf(ctx: AIContext, add: Nutrients, waterDelta = 0): WhatIfResult {
  const today = day(ctx);
  const afterTotals: Nutrients = {
    ...today.totals,
    calories: today.totals.calories + add.calories,
    protein: today.totals.protein + add.protein,
    carbs: today.totals.carbs + add.carbs,
    fat: today.totals.fat + add.fat,
    fiber: today.totals.fiber + add.fiber,
    sugar: today.totals.sugar + add.sugar,
    sodium: today.totals.sodium + add.sodium,
  };
  const afterWater = today.waterCups + waterDelta;
  const afterScore = calculateScore(afterTotals, afterWater, ctx.targets, Math.max(today.mealCount, 1), vegetableServings(today.meals) + 0.4);
  const overCalories = round(afterTotals.calories - ctx.targets.calories, 0);
  const remainingAfter = remainingNutrients(afterTotals, ctx.targets);

  let explanation = "";
  if (overCalories > 40) {
    explanation = `This would put you approximately ${formatNumber(overCalories)} kcal above today's target. Protein would land at ${formatGrams(afterTotals.protein)}. Consider a lighter plate or a smaller serving.`;
  } else if (overCalories < -80) {
    explanation = `This still leaves about ${formatKcal(Math.abs(remainingAfter.calories))} unused. You could add produce or a protein side without leaving the target band.`;
  } else {
    explanation = `This stays near today's calorie target and moves protein to ${formatGrams(afterTotals.protein)} of ${ctx.targets.protein}g.`;
  }

  return {
    before: { ...today.totals, waterCups: today.waterCups, score: today.score.total },
    after: { ...afterTotals, waterCups: afterWater, score: afterScore.total },
    explanation,
    overCalories,
    alternatives: recommendMeals(ctx, 3),
  };
}

export function generatePlan(ctx: AIContext): { date: string; type: MealType; recipeId: string; name: string }[] {
  const recs = recommendMeals(ctx, 6);
  const week = rangeDays(addDays(ctx.date, 6), 7);
  const types: MealType[] = ["breakfast", "lunch", "dinner"];
  const pool = recs.length
    ? recs
    : RECIPES.slice(0, 6).map((recipe) => ({
        id: recipe.id,
        title: recipe.name,
        reason: "",
        recipeId: recipe.id,
        nutrients: {
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat,
          fiber: recipe.fiber,
        },
      }));
  const out: { date: string; type: MealType; recipeId: string; name: string }[] = [];
  week.forEach((date, dayIndex) => {
    types.forEach((type, typeIndex) => {
      const pick = pool[(dayIndex + typeIndex) % pool.length];
      if (!pick?.recipeId) return;
      out.push({ date, type, recipeId: pick.recipeId, name: pick.title });
    });
  });
  return out;
}

export function answerQuestion(ctx: AIContext, question: string): ChatMessage {
  const today = day(ctx);
  const q = question.toLowerCase();
  const recs = recommendMeals(ctx, 3);
  const review = generateWeeklyReview(ctx);
  let content = "";

  if (q.includes("dinner") || q.includes("what should i eat")) {
    content = `You have about ${formatKcal(Math.max(0, today.remaining.calories))} and ${formatGrams(Math.max(0, today.remaining.protein))} protein left. Strong dinner options:\n\n${recs.map((rec) => `• ${rec.title} — ${rec.nutrients.calories} kcal, ${rec.nutrients.protein}g protein`).join("\n")}\n\nThis is coaching, not a medical diagnosis.`;
  } else if (q.includes("score")) {
    const factors = [...today.score.factors]
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 3)
      .map((factor) => `${factor.delta >= 0 ? "+" : ""}${factor.delta} ${factor.label}`)
      .join(", ");
    content = `Today's Nutrition Score is ${today.score.total}/100 (${today.score.label}). The largest movers: ${factors}. Closing protein and fiber typically lifts the score faster than cutting random snacks.`;
  } else if (q.includes("protein")) {
    content = `Protein is ${formatGrams(today.totals.protein)} / ${ctx.targets.protein}g. ${today.remaining.protein > 0 ? `You still need ~${formatGrams(today.remaining.protein)}.` : "You're at or above target."} High-protein ideas that respect remaining calories: ${recs.map((rec) => rec.title).join(", ")}.`;
  } else if (q.includes("vegetarian") || q.includes("veg")) {
    const veg = recs.filter((rec) => {
      const recipe = RECIPE_BY_ID[rec.recipeId ?? ""];
      return recipe?.diet.includes("vegetarian") || recipe?.diet.includes("vegan");
    });
    content = `Vegetarian direction with remaining targets in mind: ${(veg.length ? veg : recs).map((rec) => `${rec.title} (${rec.nutrients.calories} kcal, ${rec.nutrients.protein}g protein)`).join("; ")}.`;
  } else if (q.includes("500") || q.includes("left") || q.includes("remaining")) {
    content = `Remaining today: ${formatKcal(Math.max(0, today.remaining.calories))}, ${formatGrams(Math.max(0, today.remaining.protein))} protein, ${formatGrams(Math.max(0, today.remaining.fiber))} fiber. Meals near that envelope: ${recs.map((rec) => rec.title).join(", ")}.`;
  } else if (q.includes("missing") || q.includes("week")) {
    content = `This week's snapshot: average score ${review.averageScore}, protein ${review.proteinChange >= 0 ? "+" : ""}${review.proteinChange}%, hydration ${review.hydrationChange >= 0 ? "+" : ""}${review.hydrationChange}%. Watch: ${review.attention[0] ?? "consistency"}. Focus: ${review.focus[0]}`;
  } else {
    content = `${generateBrief(ctx).summary}\n\nRecommended next action: ${calculateNextBestAction(ctx).title}. Ask me about dinner, protein, score, or this week for a more specific answer. Nutrician is not a medical tool.`;
  }

  return {
    id: uid("msg"),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    actions: recs.slice(0, 2).map((rec) => ({
      id: rec.id,
      label: `Add ${rec.title}`,
      kind: "add-to-plan",
      payload: { recipeId: rec.recipeId ?? rec.id },
    })),
  };
}

export function explainNutrition(ctx: AIContext): string {
  const today = day(ctx);
  return `Logged ${formatKcal(today.totals.calories)} of ${formatKcal(ctx.targets.calories)}, protein ${formatGrams(today.totals.protein)} / ${ctx.targets.protein}g, fiber ${formatGrams(today.totals.fiber)} / ${ctx.targets.fiber}g, water ${today.waterCups}/${ctx.targets.waterCups} cups. Score ${today.score.total}/100.`;
}

export function foodForWhatIf(query: string) {
  const q = query.trim().toLowerCase();
  const recipe = RECIPES.find((item) => item.name.toLowerCase().includes(q) || item.id.includes(q.replace(/\s+/g, "-")));
  if (recipe) return { name: recipe.name, nutrients: recipeNutrients(recipe), recipeId: recipe.id };
  const food = FOODS.find((item) => item.name.toLowerCase().includes(q) || item.id.includes(q.replace(/\s+/g, "-")));
  if (food) return { name: food.name, nutrients: food.nutrients, foodId: food.id };
  return { name: "Large Cheese Pizza", nutrients: FOOD_BY_ID["pizza-large"]?.nutrients, foodId: "pizza-large" };
}

export const nutritionAIService = {
  analyzeDay,
  recommendMeals,
  explainNutrition,
  generatePlan,
  generateWeeklyReview,
  detectPatterns,
  calculateNextBestAction,
  answerQuestion,
  runWhatIf,
  generateBrief,
  foodForWhatIf,
};

