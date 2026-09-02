"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro, Progress } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { MICRO_META } from "@/lib/nutrition";
import { detectPatterns } from "@/lib/services/nutritionAI";
import { formatGrams, formatKcal } from "@/lib/utils";

const MACROS = [
  ["protein", "Protein", "blue"],
  ["carbs", "Carbohydrates", "purple"],
  ["fat", "Fat", "orange"],
  ["fiber", "Fiber", "accent"],
] as const;

export default function NutritionPage() {
  const { day, targets, ctx } = useToday();
  const patterns = detectPatterns(ctx);
  const remainingKcal = Math.max(0, day.remaining.calories);
  const remainingProtein = Math.max(0, day.remaining.protein);

  return (
    <AppShell>
      <PageIntro
        kicker="Consumed vs target"
        title="Nutrition"
        body="Macros, micros and remaining room — interpreted so you can choose the next meal, not just stare at a log."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Nutrition Score</p>
          <p className="mt-1 text-4xl font-semibold">{day.score.total}</p>
          <p className="text-sm text-muted">{day.score.label}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {day.score.factors.map((factor) => (
              <li key={factor.label} className="flex justify-between">
                <span>{factor.label}</span>
                <span className={factor.delta >= 0 ? "text-accent" : "text-danger"}>
                  {factor.delta >= 0 ? "+" : ""}
                  {factor.delta}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="text-xs text-muted">Still available</p>
          <p className="mt-1 text-2xl font-semibold">{formatKcal(remainingKcal)}</p>
          <p className="mt-2 text-sm text-muted">{formatGrams(remainingProtein)} protein left. Close the gap before dinner if you can.</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Hydration</p>
          <p className="mt-1 text-2xl font-semibold">
            {day.waterCups} / {targets.waterCups} cups
          </p>
          <div className="mt-4">
            <Progress value={(day.waterCups / targets.waterCups) * 100} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Macronutrients</h2>
          <div className="mt-4 space-y-4">
            {MACROS.map(([key, label, tone]) => {
              const used = day.totals[key];
              const target = targets[key];
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{label}</span>
                    <span>
                      {Math.round(used)} / {target}g · {Math.max(0, Math.round(target - used))}g remaining
                    </span>
                  </div>
                  <Progress value={(used / target) * 100} tone={tone} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Micronutrients (% DV)</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {MICRO_META.map((item) => (
              <div key={item.key} className="rounded-2xl bg-white/4 px-3 py-3">
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-lg font-semibold">{Math.round(day.totals[item.key])}%</p>
                <div className="mt-2">
                  <Progress value={day.totals[item.key]} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold">What this means</h2>
        {patterns.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Log a few more days and Nutrician Intelligence™ will surface patterns from your actual history.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {patterns.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/8 p-4">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
