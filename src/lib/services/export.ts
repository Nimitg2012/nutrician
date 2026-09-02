import { downloadFile, formatDateISO } from "@/lib/utils";
import type { Meal, Profile, WaterEntry } from "@/lib/types";

export function mealsToCsv(meals: Meal[]) {
  const rows = [["date", "time", "type", "name", "calories", "protein", "carbs", "fat", "fiber", "source"]];
  meals.forEach((meal) => {
    const calories = meal.items.reduce((sum, item) => sum + item.nutrients.calories, 0);
    const protein = meal.items.reduce((sum, item) => sum + item.nutrients.protein, 0);
    const carbs = meal.items.reduce((sum, item) => sum + item.nutrients.carbs, 0);
    const fat = meal.items.reduce((sum, item) => sum + item.nutrients.fat, 0);
    const fiber = meal.items.reduce((sum, item) => sum + item.nutrients.fiber, 0);
    rows.push([
      meal.date,
      meal.time,
      meal.type,
      meal.name,
      String(Math.round(calories)),
      protein.toFixed(1),
      carbs.toFixed(1),
      fat.toFixed(1),
      fiber.toFixed(1),
      meal.source,
    ]);
  });
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function downloadNutritionCsv(meals: Meal[]) {
  downloadFile(`nutrician-meals-${formatDateISO()}.csv`, mealsToCsv(meals), "text/csv;charset=utf-8");
}

export function downloadNutritionJson(payload: { profile: Profile; meals: Meal[]; water: WaterEntry[] }) {
  downloadFile(
    `nutrician-export-${formatDateISO()}.json`,
    JSON.stringify({ ...payload, exportedAt: new Date().toISOString(), demo: true }, null, 2),
    "application/json",
  );
}

export function openPrintableReport(title: string, bodyHtml: string) {
  const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
  if (!popup) return false;
  popup.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background: #0b0d10; color: #e8eee9; padding: 32px; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      p, li { line-height: 1.6; color: #c5cdc8; }
      .muted { color: #8b938f; font-size: 12px; }
    </style></head><body>${bodyHtml}<p class="muted">Nutrician demo report. Not medical advice. Use Print to save as PDF.</p>
    <script>window.onload = () => window.print()<\/script>
    </body></html>`);
  popup.document.close();
  return true;
}
