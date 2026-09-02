"use client";

import { AppShell } from "@/components/app/shell";
import { Card, EmptyState, PageIntro } from "@/components/ui";
import { FOODS } from "@/lib/data/foods";
import { RECIPES } from "@/lib/data/recipes";
import { mealsOn } from "@/lib/selectors";
import { useNutrician } from "@/lib/store";
import { formatDisplayDate } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SearchPage() {
  const meals = useNutrician((s) => s.meals);
  const goals = useNutrician((s) => s.goals);
  const customFoods = useNutrician((s) => s.customFoods);
  const setSelectedDate = useNutrician((s) => s.setSelectedDate);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return { foods: [], recipes: [], meals: [], goals: [], dates: [] as string[] };
    const foods = [...customFoods, ...FOODS].filter((item) => item.name.toLowerCase().includes(q)).slice(0, 8);
    const recipes = RECIPES.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)).slice(0, 8);
    const mealHits = meals.filter((meal) => meal.name.toLowerCase().includes(q) || meal.date.includes(q)).slice(0, 8);
    const goalHits = goals.filter((goal) => goal.title.toLowerCase().includes(q));
    const dates = [...new Set(meals.filter((meal) => meal.date.includes(q)).map((meal) => meal.date))].slice(0, 8);
    return { foods, recipes, meals: mealHits, goals: goalHits, dates };
  }, [q, meals, goals, customFoods]);

  const empty = q && !results.foods.length && !results.recipes.length && !results.meals.length && !results.goals.length && !results.dates.length;

  return (
    <AppShell>
      <PageIntro kicker="Find anything you logged" title="Search" body="Search foods, recipes, meals, dates and goals. Empty queries stay empty." />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Chicken, 2026-08-21, protein…"
        className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm"
        aria-label="Search Nutrician"
      />
      {!q ? <p className="mt-4 text-sm text-muted">Type to search. Special characters are treated as plain text.</p> : null}
      {empty ? <div className="mt-6"><EmptyState title="No results" body="Try a shorter word or a date like 2026-08-21." /></div> : null}
      {results.dates.length ? (
        <Card className="mt-4">
          <h2 className="font-semibold">Dates</h2>
          <div className="mt-2 flex flex-col gap-2">
            {results.dates.map((iso) => (
              <Link key={iso} href="/app/history" onClick={() => setSelectedDate(iso)} className="text-sm text-accent">
                {formatDisplayDate(iso)}
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
      {results.meals.length ? (
        <Card className="mt-4">
          <h2 className="font-semibold">Meals</h2>
          {results.meals.map((meal) => (
            <p key={meal.id} className="mt-2 text-sm">
              {meal.name} · {meal.date} · {mealsOn(meals, meal.date).length} on that day
            </p>
          ))}
        </Card>
      ) : null}
      {results.foods.length ? (
        <Card className="mt-4">
          <h2 className="font-semibold">Foods</h2>
          {results.foods.map((food) => (
            <p key={food.id} className="mt-2 text-sm">
              {food.name}
            </p>
          ))}
        </Card>
      ) : null}
      {results.recipes.length ? (
        <Card className="mt-4">
          <h2 className="font-semibold">Recipes</h2>
          {results.recipes.map((recipe) => (
            <Link key={recipe.id} href={`/app/recipes/${recipe.id}`} className="mt-2 block text-sm text-accent">
              {recipe.name}
            </Link>
          ))}
        </Card>
      ) : null}
      {results.goals.length ? (
        <Card className="mt-4">
          <h2 className="font-semibold">Goals</h2>
          {results.goals.map((goal) => (
            <Link key={goal.id} href="/app/goals" className="mt-2 block text-sm text-accent">
              {goal.title}
            </Link>
          ))}
        </Card>
      ) : null}
    </AppShell>
  );
}
