"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, EmptyState, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { compareDays, dayNutrition, dayStatus, loggedDates } from "@/lib/selectors";
import { analyzeDay } from "@/lib/services/nutritionAI";
import { mealTypeLabel, useNutrician } from "@/lib/store";
import { addDays, formatDateISO, formatDisplayDate, formatGrams, formatKcal, weekdayName } from "@/lib/utils";
import { useMemo, useState } from "react";

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: startPad }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(formatDateISO(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function HistoryPage() {
  const { meals, water, targets, date, ctx } = useToday();
  const setSelectedDate = useNutrician((s) => s.setSelectedDate);
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const deleteMeal = useNutrician((s) => s.deleteMeal);
  const undoDeleteMeal = useNutrician((s) => s.undoDeleteMeal);
  const lastDeletedMeal = useNutrician((s) => s.lastDeletedMeal);
  const [cursor, setCursor] = useState(() => {
    const d = new Date(`${date}T12:00:00`);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [compare, setCompare] = useState(date);
  const [filter, setFilter] = useState("");

  const snapshot = dayNutrition(meals, water, targets, date);
  const other = dayNutrition(meals, water, targets, compare);
  const diff = compareDays(snapshot, other);
  const status = dayStatus(snapshot, targets);
  const insights = snapshot.mealCount ? analyzeDay({ ...ctx, date }) : [];
  const dates = loggedDates(meals, water);
  const cells = monthCells(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const filtered = dates.filter((iso) => iso.includes(filter.trim()) || weekdayName(iso).toLowerCase().includes(filter.trim().toLowerCase()));

  const weekAvg = useMemo(() => {
    const rows = Array.from({ length: 7 }, (_, i) => dayNutrition(meals, water, targets, addDays(date, i - 6)));
    return Math.round(rows.reduce((sum, row) => sum + row.score.total, 0) / 7);
  }, [meals, water, targets, date]);

  return (
    <AppShell>
      <PageIntro
        kicker="What happened — and what is changing"
        title="History"
        body="Every snapshot is computed from the meals and water you logged. Nothing here is a fake chart."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={view === "calendar" ? "primary" : "secondary"} onClick={() => setView("calendar")}>
          Calendar
        </Button>
        <Button variant={view === "list" ? "primary" : "secondary"} onClick={() => setView("list")}>
          List
        </Button>
        {lastDeletedMeal ? (
          <Button variant="ghost" onClick={() => undoDeleteMeal()}>
            Undo delete
          </Button>
        ) : null}
      </div>

      {view === "calendar" ? (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))}
            >
              Previous
            </Button>
            <p className="font-semibold">{monthLabel}</p>
            <Button
              variant="ghost"
              onClick={() => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))}
            >
              Next
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
            {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
              <div key={`${label}-${index}`}>{label}</div>
            ))}
            {cells.map((iso, index) => {
              if (!iso) return <div key={`empty-${index}`} />;
              const day = dayNutrition(meals, water, targets, iso);
              const logged = day.mealCount > 0 || day.waterCups > 0;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={`min-h-14 rounded-2xl p-1 text-xs ${
                    iso === date ? "bg-accent/15 text-accent" : logged ? "bg-white/5" : "text-muted"
                  }`}
                >
                  <span className="block">{iso.slice(-2)}</span>
                  {logged ? <span className="mt-1 block text-[10px] text-muted">{day.score.total}</span> : null}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card>
          <label className="block text-xs text-muted">
            Filter dates
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-ink"
              placeholder="2026-08 or Monday"
            />
          </label>
          <div className="mt-4 space-y-2">
            {filtered.length === 0 ? (
              <EmptyState title="No history yet." body="Log a meal to start a day you can reopen later." action={<Button onClick={() => setLogOpen(true)}>Log meal</Button>} />
            ) : (
              filtered
                .slice()
                .reverse()
                .map((iso) => {
                  const day = dayNutrition(meals, water, targets, iso);
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDate(iso)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left ${
                        iso === date ? "bg-accent/12" : "bg-white/4"
                      }`}
                    >
                      <span>
                        <span className="block font-medium">{formatDisplayDate(iso)}</span>
                        <span className="text-xs text-muted">
                          {day.mealCount} meals · {formatKcal(day.totals.calories)}
                        </span>
                      </span>
                      <span className="text-sm font-semibold">{day.score.total}</span>
                    </button>
                  );
                })
            )}
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Day snapshot</p>
            <h2 className="mt-1 text-xl font-semibold">{formatDisplayDate(date)}</h2>
            <p className="mt-1 text-sm capitalize text-muted">{status.replace("-", " ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedDate(date);
                setLogOpen(true);
              }}
            >
              Log to this date
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Score" value={String(snapshot.score.total)} />
          <Stat label="Calories" value={formatKcal(snapshot.totals.calories)} />
          <Stat label="Protein" value={formatGrams(snapshot.totals.protein)} />
          <Stat label="Carbs" value={formatGrams(snapshot.totals.carbs)} />
          <Stat label="Fat" value={formatGrams(snapshot.totals.fat)} />
          <Stat label="Fiber" value={formatGrams(snapshot.totals.fiber)} />
          <Stat label="Water" value={`${snapshot.waterCups} cups`} />
          <Stat label="Meals" value={String(snapshot.mealCount)} />
        </div>
        {snapshot.mealCount === 0 ? (
          <p className="mt-4 text-sm text-muted">This day is empty. Backdating a log here still uses the same meal store as Today.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {snapshot.meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between rounded-2xl bg-white/4 px-3 py-3">
                <div>
                  <p className="font-medium">{meal.name}</p>
                  <p className="text-xs text-muted">
                    {mealTypeLabel(meal.type)} · {meal.time}
                  </p>
                </div>
                <button type="button" className="text-xs text-muted" onClick={() => deleteMeal(meal.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        {insights[0] ? <p className="mt-4 text-sm text-muted">{insights[0].body}</p> : null}
        <p className="mt-3 text-xs text-muted">7-day average score around this date: {weekAvg}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="font-semibold">Compare two dates</h2>
        <label className="mt-3 block text-xs text-muted">
          Compare with
          <input
            type="date"
            value={compare}
            onChange={(e) => setCompare(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-ink"
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Score Δ" value={signed(diff.score)} />
          <Stat label="Calories Δ" value={signed(diff.calories)} />
          <Stat label="Protein Δ" value={signed(diff.protein)} />
          <Stat label="Fiber Δ" value={signed(diff.fiber)} />
          <Stat label="Water Δ" value={signed(diff.water)} />
          <Stat label="Carbs Δ" value={signed(diff.carbs)} />
        </div>
        <p className="mt-3 text-xs text-muted">
          {formatDisplayDate(date)} vs {formatDisplayDate(compare)}. Positive means the selected day is higher.
        </p>
      </Card>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/4 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function signed(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}
