"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { RECIPE_BY_ID, recipeNutrients } from "@/lib/data/recipes";
import { useToday } from "@/lib/hooks";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import { formatKcal } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipe = RECIPE_BY_ID[id];
  const { date } = useToday();
  const addToPlan = useNutrician((s) => s.addToPlan);
  const logMeal = useNutrician((s) => s.logMeal);

  if (!recipe) {
    return (
      <AppShell>
        <p>Recipe not found.</p>
        <Link href="/app/recipes" className="mt-4 inline-block text-sm text-accent">
          Back to recipes
        </Link>
      </AppShell>
    );
  }

  const nutrients = recipeNutrients(recipe);

  return (
    <AppShell>
      <PageIntro kicker={mealTypeLabel(recipe.mealTypes[0] ?? "lunch")} title={recipe.name} body={recipe.description} />
      <Card>
        <p className="text-sm text-muted">
          {formatKcal(recipe.calories)} · {recipe.protein}g protein · {recipe.carbs}g carbs · {recipe.fat}g fat · {recipe.prepMinutes} min · {recipe.difficulty}
        </p>
        <h2 className="mt-6 font-semibold">Ingredients</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {recipe.ingredients.map((item) => (
            <li key={item.name}>
              {item.quantity} {item.name}
            </li>
          ))}
        </ul>
        <h2 className="mt-6 font-semibold">Steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() =>
              logMeal({
                date,
                type: recipe.mealTypes[0] ?? "lunch",
                name: recipe.name,
                items: [
                  {
                    id: recipe.id,
                    foodId: recipe.id,
                    foodName: recipe.name,
                    servings: 1,
                    servingSize: "1 serving",
                    nutrients,
                  },
                ],
                time: new Date().toTimeString().slice(0, 5),
                source: "recipe",
              })
            }
          >
            Log meal
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              addToPlan({
                date,
                type: recipe.mealTypes[0] ?? "lunch",
                recipeId: recipe.id,
                name: recipe.name,
                nutrients,
              })
            }
          >
            Add to plan
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
