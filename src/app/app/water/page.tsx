"use client";

import { AppShell } from "@/components/app/shell";
import { HydrationDots } from "@/components/core/hydration-dots";
import { Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { useNutrician } from "@/lib/store";

export default function WaterPage() {
  const { day, targets, water, date } = useToday();
  const addWater = useNutrician((s) => s.addWater);
  const deleteWater = useNutrician((s) => s.deleteWater);
  const todayEntries = water.filter((entry) => entry.date === date);

  return (
    <AppShell>
      <PageIntro kicker="Hydration" title="Water" body="Tap an empty cup to add water. Hydration is one of the fastest score improvements without adding calories." />
      <Card>
        <HydrationDots current={day.waterCups} target={targets.waterCups} onAdd={() => addWater(1)} />
        <p className="mt-4 text-sm text-muted">
          {day.waterCups} / {targets.waterCups} cups today
        </p>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold">Today&apos;s entries</h2>
        {todayEntries.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No water logged yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {todayEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-white/4 px-3 py-3 text-sm">
                <span>
                  {entry.cups} cup{entry.cups === 1 ? "" : "s"} · {entry.time}
                </span>
                <button type="button" className="text-xs text-muted" onClick={() => deleteWater(entry.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
