"use client";

import { AppShell } from "@/components/app/shell";
import { Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { dayNutrition } from "@/lib/selectors";
import { useNutrician } from "@/lib/store";
import { addDays, formatKcal, rangeDays } from "@/lib/utils";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  const { date, targets } = useToday();
  const meals = useNutrician((s) => s.meals);
  const water = useNutrician((s) => s.water);

  const thisWeek = rangeDays(date, 7);
  const lastWeek = rangeDays(addDays(date, -7), 7);

  const series = useMemo(() => {
    return thisWeek.map((day, index) => {
      const current = dayNutrition(meals, water, targets, day);
      const previous = dayNutrition(meals, water, targets, lastWeek[index] ?? day);
      return {
        day: day.slice(5),
        calories: Math.round(current.totals.calories),
        lastCalories: Math.round(previous.totals.calories),
        protein: Math.round(current.totals.protein),
        score: current.score.total,
        water: current.waterCups,
      };
    });
  }, [thisWeek, lastWeek, meals, water, targets]);

  const avg = (key: "calories" | "protein" | "score" | "water") =>
    Math.round(series.reduce((sum, row) => sum + row[key], 0) / Math.max(1, series.length));

  const strongest = [...series].sort((a, b) => b.score - a.score)[0];
  const weakest = [...series].sort((a, b) => a.score - b.score)[0];

  return (
    <AppShell>
      <PageIntro
        kicker="This week vs last week"
        title="Analytics"
        body="Trends from your log, not a generic report. Strongest and weakest days are computed from Nutrition Score."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-muted">Avg calories</p>
          <p className="mt-1 text-2xl font-semibold">{formatKcal(avg("calories"))}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Avg protein</p>
          <p className="mt-1 text-2xl font-semibold">{avg("protein")}g</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Avg score</p>
          <p className="mt-1 text-2xl font-semibold">{avg("score")}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Avg water</p>
          <p className="mt-1 text-2xl font-semibold">{avg("water")} cups</p>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="h-80">
          <h2 className="mb-4 font-semibold">Calories this week vs last week</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={series}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" stroke="#8b938f" fontSize={12} />
              <YAxis stroke="#8b938f" fontSize={12} />
              <Tooltip contentStyle={{ background: "#12171c", border: "1px solid #222" }} />
              <Bar dataKey="calories" fill="#3dff8f" radius={6} />
              <Bar dataKey="lastCalories" fill="#5b9dff" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="font-semibold">Pattern notes</h2>
          <p className="mt-3 text-sm">Strongest day: {strongest?.day} · score {strongest?.score}</p>
          <p className="mt-2 text-sm">Weakest day: {weakest?.day} · score {weakest?.score}</p>
          <p className="mt-4 text-sm text-muted">
            Protein average is {avg("protein")}g against a {targets.protein}g target. Use Meal planner if lunch is the usual miss.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
