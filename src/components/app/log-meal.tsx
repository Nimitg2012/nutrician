"use client";

import { Button, Card, Field, Input, Select } from "@/components/ui";
import { FOOD_CATEGORIES, searchFoods } from "@/lib/data/foods";
import { RECIPES, recipeNutrients } from "@/lib/data/recipes";
import { scaleNutrients } from "@/lib/nutrition";
import { recognizeMealPhoto } from "@/lib/services/vision";
import { catalogFoods, itemFromFood, useNutrician } from "@/lib/store";
import type { Food, MealItem, MealType } from "@/lib/types";
import { uid } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack", "drinks"];
type Tab = "search" | "recent" | "photo" | "barcode" | "custom" | "choose";

export function LogMealModal() {
  const open = useNutrician((s) => s.logOpen);
  const setOpen = useNutrician((s) => s.setLogOpen);
  const customFoods = useNutrician((s) => s.customFoods);
  const recentFoodIds = useNutrician((s) => s.recentFoodIds);
  const savedFoodIds = useNutrician((s) => s.savedFoodIds);
  const selectedDate = useNutrician((s) => s.selectedDate);
  const logMeal = useNutrician((s) => s.logMeal);
  const addCustomFood = useNutrician((s) => s.addCustomFood);
  const catalog = catalogFoods(customFoods);

  const [tab, setTab] = useState<Tab>("search");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<MealType>("lunch");
  const [items, setItems] = useState<MealItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [photoNote, setPhotoNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoStep, setPhotoStep] = useState<"capture" | "review">("capture");

  const results = useMemo(() => {
    const base = category === "all" ? catalog : catalog.filter((food) => food.category === category);
    return searchFoods(query, base).slice(0, 20);
  }, [catalog, category, query]);

  useEffect(() => {
    const onTab = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      const map: Record<string, Tab> = {
        photo: "photo",
        search: "search",
        choose: "choose",
        recent: "recent",
        custom: "custom",
      };
      if (map[next]) setTab(map[next]);
    };
    window.addEventListener("nutrician-log-tab", onTab);
    return () => window.removeEventListener("nutrician-log-tab", onTab);
  }, []);

  if (!open) return null;

  const addFood = (food: Food, servings = 1) => {
    setItems((curr) => [...curr, itemFromFood(food, servings)]);
  };

  const changeServings = (index: number, delta: number) => {
    setItems((curr) =>
      curr.map((item, i) => {
        if (i !== index) return item;
        const servings = Math.max(0.5, Math.round((item.servings + delta) * 2) / 2);
        const per = item.servings || 1;
        const base = scaleNutrients(item.nutrients, 1 / per);
        return { ...item, servings, nutrients: scaleNutrients(base, servings) };
      }),
    );
  };

  const save = () => {
    if (!items.length) return;
    logMeal({
      date: selectedDate,
      type,
      name: items.map((item) => item.foodName).join(" + "),
      items,
      time: new Date().toTimeString().slice(0, 5),
      source: tab === "photo" ? "ai-photo" : tab === "barcode" ? "barcode" : "manual",
    });
    setItems([]);
    setPhotoNote("");
    setPhotoStep("capture");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-0 md:place-items-center md:p-6" role="dialog" aria-label="Log meal">
      <Card className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl md:max-w-2xl md:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Log → Understand</p>
            <h2 className="text-xl font-semibold">Log a meal</h2>
          </div>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {(["photo", "search", "choose", "recent", "custom"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-3 py-1.5 capitalize ${tab === id ? "bg-accent text-[#04140b]" : "bg-white/5"}`}
            >
              {id === "photo" ? "Scan" : id}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Meal">
            <Select value={type} onChange={(e) => setType(e.target.value as MealType)}>
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All foods</option>
              {FOOD_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {tab === "search" ? (
          <div className="mt-4">
            <Input placeholder="Search chicken, dal, oats…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
              {results.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl bg-white/4 px-3 py-2 text-left text-sm"
                  onClick={() => addFood(food)}
                >
                  <span>{food.name}</span>
                  <span className="text-muted">{Math.round(food.nutrients.calories)} kcal</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "choose" ? (
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {RECIPES.slice(0, 8).map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-white/4 px-3 py-2 text-left text-sm"
                onClick={() =>
                  setItems((curr) => [
                    ...curr,
                    {
                      id: uid("item"),
                      foodId: recipe.id,
                      foodName: recipe.name,
                      servings: 1,
                      servingSize: "1 serving",
                      nutrients: recipeNutrients(recipe),
                    },
                  ])
                }
              >
                <span>{recipe.name}</span>
                <span className="text-muted">{recipe.calories} kcal</span>
              </button>
            ))}
          </div>
        ) : null}

        {tab === "recent" ? (
          <div className="mt-4 space-y-2">
            {(recentFoodIds.length ? recentFoodIds : savedFoodIds).map((id) => {
              const food = catalog.find((item) => item.id === id);
              if (!food) return null;
              return (
                <button key={id} type="button" className="flex w-full justify-between rounded-2xl bg-white/4 px-3 py-2 text-sm" onClick={() => addFood(food)}>
                  <span>{food.name}</span>
                  <span className="text-muted">Add</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {tab === "photo" ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted">Capture or upload. Results are estimated and can be corrected before saving.</p>
            <ol className="flex gap-2 text-[11px] uppercase tracking-wide text-muted">
              <li className={photoStep === "capture" ? "text-accent" : ""}>Capture</li>
              <li>Analyze</li>
              <li className={photoStep === "review" ? "text-accent" : ""}>Review</li>
            </ol>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setBusy(true);
                const result = await recognizeMealPhoto(file.name);
                setPhotoNote(result.note);
                result.items.forEach((item) => addFood(item.food, item.servings));
                setPhotoStep("review");
                setBusy(false);
              }}
            />
            {busy ? <p className="text-sm text-accent">Analyzing photo…</p> : null}
            {photoNote ? <p className="text-xs text-orange">Estimated. {photoNote}</p> : null}
          </div>
        ) : null}

        {tab === "barcode" ? (
          <div className="mt-4 space-y-3">
            <Input placeholder="Enter barcode e.g. 036632027248" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const food = catalog.find((item) => item.barcode === barcode.replace(/\s/g, ""));
                if (food) addFood(food);
              }}
            >
              Lookup
            </Button>
          </div>
        ) : null}

        {tab === "custom" ? (
          <CustomFoodForm
            onCreate={(food) => {
              const created = addCustomFood(food);
              addFood(created);
            }}
          />
        ) : null}

        <div className="mt-5 rounded-2xl bg-black/30 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">Selected {tab === "photo" && items.length ? "· estimated" : ""}</p>
          {items.length === 0 ? <p className="text-sm text-muted">No foods added yet.</p> : null}
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between gap-2 py-1 text-sm">
              <span className="min-w-0 truncate">{item.foodName}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-full bg-white/8 px-2" onClick={() => changeServings(index, -0.5)} aria-label="Decrease serving">
                  −
                </button>
                <span>{item.servings}</span>
                <button type="button" className="rounded-full bg-white/8 px-2" onClick={() => changeServings(index, 0.5)} aria-label="Increase serving">
                  +
                </button>
                <button type="button" className="text-muted" onClick={() => setItems((curr) => curr.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!items.length}>
            Save to today
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CustomFoodForm({ onCreate }: { onCreate: (food: Omit<Food, "id" | "isCustom">) => void }) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("200");
  const [protein, setProtein] = useState("20");
  return (
    <div className="mt-4 grid gap-3">
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Calories">
          <Input value={calories} onChange={(e) => setCalories(e.target.value)} />
        </Field>
        <Field label="Protein">
          <Input value={protein} onChange={(e) => setProtein(e.target.value)} />
        </Field>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          if (!name) return;
          onCreate({
            name,
            category: "packaged",
            servingSize: "1 serving",
            servingGrams: 100,
            nutrients: {
              calories: Number(calories) || 0,
              protein: Number(protein) || 0,
              carbs: 10,
              fat: 5,
              fiber: 2,
              sugar: 2,
              sodium: 120,
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
            },
            tags: ["custom"],
          });
          setName("");
        }}
      >
        Add custom food
      </Button>
    </div>
  );
}
