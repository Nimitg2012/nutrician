"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { RECIPES, recipeNutrients } from "@/lib/data/recipes";
import { useToday } from "@/lib/hooks";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import { formatKcal } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTERS = ["all", "high-protein", "vegetarian", "vegan", "indian", "quick"] as const;

export default function RecipesPage() {
  const { date } = useToday();
  const addToPlan = useNutrician((s) => s.addToPlan);
  const logMeal = useNutrician((s) => s.logMeal);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const list = useMemo(() => {
    return RECIPES.filter((recipe) => {
      if (filter === "all") return true;
      if (filter === "quick") return recipe.prepMinutes <= 15;
      if (filter === "indian") return recipe.tags.includes("indian") || recipe.diet.includes("vegetarian");
      return recipe.tags.includes(filter) || recipe.diet.includes(filter as never);
    });
  }, [filter]);

  return (
    <AppShell>
      <PageIntro
        kicker="Cook from remaining macros"
        title="Recipes"
        body="Every card can log today or land on the week plan. Filters are culinary, not medical."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button key={item} variant={filter === item ? "primary" : "secondary"} onClick={() => setFilter(item)}>
            {item}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((recipe) => (
          <Card key={recipe.id}>
            <div
              className="mb-3 h-24 rounded-2xl"
              style={{ background: `linear-gradient(135deg, hsl(${recipe.hue} 40% 18%), hsl(${(recipe.hue + 40) % 360} 50% 12%))` }}
            />
            <p className="font-semibold">{recipe.name}</p>
            <p className="mt-1 text-sm text-muted">
              {formatKcal(recipe.calories)} · {recipe.protein}g protein · {recipe.prepMinutes} min · {recipe.difficulty}
            </p>
            <p className="mt-1 text-xs text-muted">{recipe.mealTypes.map(mealTypeLabel).join(" · ")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
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
                        nutrients: recipeNutrients(recipe),
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
                variant="ghost"
                onClick={() =>
                  addToPlan({
                    date,
                    type: recipe.mealTypes[0] ?? "lunch",
                    recipeId: recipe.id,
                    name: recipe.name,
                    nutrients: recipeNutrients(recipe),
                  })
                }
              >
                Add to plan
              </Button>
              <Link href={`/app/recipes/${recipe.id}`} className="rounded-full px-3 py-2 text-sm text-muted">
                View
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
