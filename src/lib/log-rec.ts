import { RECIPE_BY_ID, recipeNutrients } from "@/lib/data/recipes";
import { EMPTY_NUTRIENTS } from "@/lib/nutrition";
import type { Meal, MealPlanEntry, Recommendation } from "@/lib/types";

export function mealFromRecommendation(rec: Recommendation, date: string): Omit<Meal, "id"> {
  const recipe = rec.recipeId ? RECIPE_BY_ID[rec.recipeId] : undefined;
  const nutrients = recipe ? recipeNutrients(recipe) : { ...EMPTY_NUTRIENTS, ...rec.nutrients };
  return {
    date,
    type: recipe?.mealTypes[0] ?? "dinner",
    name: rec.title,
    items: [
      {
        id: rec.id,
        foodId: rec.recipeId ?? rec.foodId ?? rec.id,
        foodName: rec.title,
        servings: 1,
        servingSize: "1 serving",
        nutrients,
      },
    ],
    time: new Date().toTimeString().slice(0, 5),
    source: "recipe",
  };
}

export function planFromRecommendation(rec: Recommendation, date: string): Omit<MealPlanEntry, "id"> {
  const recipe = rec.recipeId ? RECIPE_BY_ID[rec.recipeId] : undefined;
  return {
    date,
    type: recipe?.mealTypes[0] ?? "dinner",
    recipeId: rec.recipeId,
    name: rec.title,
    nutrients: recipe ? recipeNutrients(recipe) : { ...EMPTY_NUTRIENTS, ...rec.nutrients },
  };
}
