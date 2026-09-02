"use client";

import { AppShell } from "@/components/app/shell";
import { NutritionGalaxy } from "@/components/core/galaxy";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { dayNutrition, loggingStreak } from "@/lib/selectors";
import { addDays } from "@/lib/utils";
import { useState } from "react";

export default function ProgressPage() {
  const { date, targets, meals, water, day } = useToday();
  const streak = loggingStreak(meals, date);
  const [selected, setSelected] = useState(date);
  const selectedDay = dayNutrition(meals, water, targets, selected);
  const thisWeek = Array.from({ length: 7 }, (_, i) => addDays(date, i - 6)).map((d) => dayNutrition(meals, water, targets, d));
  const lastWeek = Array.from({ length: 7 }, (_, i) => addDays(date, i - 13)).map((d) => dayNutrition(meals, water, targets, d));
  const avg = (rows: typeof thisWeek) => Math.round(rows.reduce((sum, row) => sum + row.score.total, 0) / Math.max(1, rows.length));
  const thisAvg = avg(thisWeek);
  const lastAvg = avg(lastWeek);

  return (
    <AppShell>
      <PageIntro kicker="Am I improving?" title="Progress" body="The Nutrition Galaxy shows the week at a glance. Charts stay secondary. Empty days stay empty." />
      <div className="mb-4">
        <Button href="/app/history">Open History</Button>
      </div>
      <Card>
        <h2 className="mb-4 font-semibold">Nutrition Galaxy</h2>
        {thisWeek.every((row) => row.mealCount === 0) ? (
          <p className="text-sm text-muted">Your Nutrition Galaxy will appear as you build your history.</p>
        ) : (
          <NutritionGalaxy endDate={date} meals={meals} water={water} targets={targets} onSelect={setSelected} />
        )}
        <div className="mt-6 rounded-2xl bg-white/4 p-4">
          <p className="text-sm font-medium">
            {selected} — {selectedDay.score.total}
          </p>
          <p className="mt-2 text-sm text-muted">
            Protein {selectedDay.totals.protein >= targets.protein * 0.85 ? "✓" : "needs work"} · Hydration{" "}
            {selectedDay.waterCups >= targets.waterCups - 1 ? "✓" : "behind"} · Fiber {selectedDay.totals.fiber >= targets.fiber * 0.8 ? "✓" : "needs work"}
          </p>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Logging streak</p>
          <p className="mt-1 text-4xl font-semibold">{streak}</p>
          <p className="text-sm text-muted">consecutive days with at least one meal</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">This week vs last week</p>
          <p className="mt-1 text-4xl font-semibold">
            {thisAvg}
            <span className="ml-2 text-lg text-muted">vs {lastAvg}</span>
          </p>
          <p className="text-sm text-muted">average Nutrition Score</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Today</p>
          <p className="mt-1 text-4xl font-semibold">{day.score.total}</p>
          <p className="text-sm text-muted">{day.score.label}</p>
        </Card>
      </div>
    </AppShell>
  );
}
