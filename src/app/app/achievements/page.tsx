"use client";

import { AppShell } from "@/components/app/shell";
import { Badge, Card, PageIntro } from "@/components/ui";
import { loggingStreak } from "@/lib/selectors";
import { useNutrician } from "@/lib/store";
import { formatDateISO } from "@/lib/utils";
import { useEffect } from "react";

export default function AchievementsPage() {
  const achievements = useNutrician((s) => s.achievements);
  const meals = useNutrician((s) => s.meals);
  const unlockAchievements = useNutrician((s) => s.unlockAchievements);
  const streak = loggingStreak(meals, formatDateISO());
  useEffect(() => {
    unlockAchievements();
  }, [unlockAchievements, meals.length]);

  return (
    <AppShell>
      <PageIntro
        kicker="Quiet gamification"
        title="Achievements"
        body="Badges unlock from real logging, hydration and score streaks. Nothing is purchased."
      />
      <p className="mb-4 text-sm text-muted">Current logging streak: {streak} days.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/15 text-sm font-bold text-accent">
                {item.icon}
              </span>
              <Badge tone={item.unlockedAt ? "green" : "muted"}>{item.unlockedAt ? "Unlocked" : "Locked"}</Badge>
            </div>
            <p className="mt-4 font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
