"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { useNutrician } from "@/lib/store";

export default function RemindersPage() {
  const { day, targets } = useToday();
  const reminders = useNutrician((s) => s.reminders);
  const toggleReminder = useNutrician((s) => s.toggleReminder);
  const proteinGap = Math.max(0, targets.protein - day.totals.protein);
  const waterGap = Math.max(0, targets.waterCups - day.waterCups);

  return (
    <AppShell>
      <PageIntro
        kicker="Context, not spam"
        title="Reminders"
        body="These stay quiet unless they can change an outcome. Today's gaps are shown so you can decide what is worth hearing."
      />
      <Card className="mb-4">
        <p className="text-sm">
          Right now you still need {Math.round(proteinGap)}g protein and {waterGap} cups of water. Reminders fire against
          those numbers, not a generic clock.
        </p>
      </Card>
      <div className="space-y-3">
        {reminders.map((item) => (
          <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted">
                {item.time} · {item.kind}
              </p>
              <p className="mt-1 text-sm text-muted">{item.context}</p>
            </div>
            <Button variant={item.enabled ? "secondary" : "ghost"} onClick={() => toggleReminder(item.id)}>
              {item.enabled ? "On" : "Off"}
            </Button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
