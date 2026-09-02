"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, Field, Input, PageIntro, Select } from "@/components/ui";
import { useNutrician } from "@/lib/store";
import type { GroceryItem } from "@/lib/types";
import { useState } from "react";

const CATEGORIES: GroceryItem["category"][] = ["produce", "protein", "dairy", "grains", "pantry", "snacks"];

export default function GroceryPage() {
  const groceries = useNutrician((s) => s.groceries);
  const toggleGrocery = useNutrician((s) => s.toggleGrocery);
  const addGrocery = useNutrician((s) => s.addGrocery);
  const removeGrocery = useNutrician((s) => s.removeGrocery);
  const rebuildGroceries = useNutrician((s) => s.rebuildGroceries);
  const [name, setName] = useState("Baby spinach");
  const [quantity, setQuantity] = useState("1 bag");
  const [category, setCategory] = useState<GroceryItem["category"]>("produce");
  const remaining = groceries.filter((item) => !item.checked).length;

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <PageIntro
          kicker="From the week plan"
          title="Grocery list"
          body={`${remaining} items still to pick up. Checking an item does not delete it — uncheck if you put it back.`}
        />
        <Button variant="secondary" onClick={rebuildGroceries}>
          Rebuild from plan
        </Button>
      </div>
      {CATEGORIES.map((group) => {
        const items = groceries.filter((item) => item.category === group);
        if (!items.length) return null;
        return (
          <Card key={group} className="mb-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{group}</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <label key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={item.checked} onChange={() => toggleGrocery(item.id)} />
                    <span className={item.checked ? "text-muted line-through" : ""}>
                      {item.name} · {item.quantity}
                    </span>
                  </span>
                  <button className="text-xs text-muted" onClick={() => removeGrocery(item.id)}>
                    Remove
                  </button>
                </label>
              ))}
            </div>
          </Card>
        );
      })}
      {groceries.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No grocery items yet. Generate a week plan, then rebuild this list.</p>
        </Card>
      ) : null}
      <Card className="mt-4 grid gap-3 md:grid-cols-4">
        <Field label="Item">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Quantity">
          <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value as GroceryItem["category"])}>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex items-end">
          <Button onClick={() => addGrocery({ name, quantity, category, checked: false })}>Add item</Button>
        </div>
      </Card>
    </AppShell>
  );
}
