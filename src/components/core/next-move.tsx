"use client";

import { Button } from "@/components/ui";
import { nextMoveCopy } from "@/lib/experience";
import type { DayNutrition, NutritionTargets, Recommendation } from "@/lib/types";
import { formatGrams, formatKcal } from "@/lib/utils";
import { useState } from "react";

export function NextMove({
  day,
  targets,
  recs,
  onLog,
  onPlan,
}: {
  day: DayNutrition;
  targets: NutritionTargets;
  recs: Recommendation[];
  onLog: (rec: Recommendation) => void;
  onPlan: (rec: Recommendation) => void;
}) {
  const copy = nextMoveCopy(day, targets);
  const [why, setWhy] = useState(false);
  const proteinPct = Math.min(100, Math.round((day.totals.protein / Math.max(1, targets.protein)) * 100));
  const fiberPct = Math.min(100, Math.round((day.totals.fiber / Math.max(1, targets.fiber)) * 100));
  const calPct = Math.min(100, Math.round((day.totals.calories / Math.max(1, targets.calories)) * 100));

  return (
    <section className="mt-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Your next move</p>
      <h2 className="mx-auto mt-2 max-w-xl text-center text-2xl font-semibold tracking-tight md:text-3xl">{copy.title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted">{copy.body}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {recs.map((rec) => (
          <article key={rec.id} className="rounded-3xl border border-white/8 bg-bg-card p-4">
            <p className="font-medium">{rec.title}</p>
            <p className="mt-1 text-sm text-muted">
              {formatKcal(rec.nutrients.calories)} · {formatGrams(rec.nutrients.protein)} protein
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="px-3 py-1.5 text-xs" onClick={() => onLog(rec)}>
                Log
              </Button>
              <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => onPlan(rec)}>
                Add to plan
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <button type="button" className="text-xs font-semibold uppercase tracking-[0.18em] text-purple" onClick={() => setWhy((v) => !v)}>
          {why ? "Hide why" : "Why?"}
        </button>
      </div>
      {why ? (
        <div className="mx-auto mt-4 max-w-md rounded-3xl border border-white/8 bg-white/3 p-4 text-sm">
          <Bar label="Protein" pct={proteinPct} />
          <Bar label="Fiber" pct={fiberPct} />
          <Bar label="Calories" pct={calPct} />
          <p className="mt-3 text-muted">
            Protein {Math.round(day.totals.protein)}g of {targets.protein}g ({Math.max(0, Math.round(day.remaining.protein))}g left). Fiber{" "}
            {Math.round(day.totals.fiber)}g of {targets.fiber}g. Water {day.waterCups} of {targets.waterCups} cups. Calories{" "}
            {Math.round(day.totals.calories)} of {targets.calories}. Coaching, not medical advice.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
