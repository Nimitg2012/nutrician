"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { analyzeDay, detectPatterns } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import Link from "next/link";

export default function InsightsPage() {
  const { ctx, day } = useToday();
  const addWater = useNutrician((s) => s.addWater);
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const noticed = analyzeDay(ctx).slice(0, 3);
  const patterns = detectPatterns(ctx);

  return (
    <AppShell>
      <PageIntro kicker="Nutrician Intelligence" title="Insights" body="Three things I noticed today — then the tools for why, what if, and detailed analytics." />
      <h2 className="text-lg font-semibold">3 things I noticed today</h2>
      {noticed.length === 0 ? (
        <p className="mt-4 rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-muted">
          You&apos;re looking great today. No major issues detected.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {noticed.map((item) => (
            <Card key={item.id}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-purple">{item.severity}</p>
              <p className="mt-2 font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
              {item.id === "water-gap" ? (
                <Button className="mt-4" onClick={() => addWater(2)}>
                  Fix hydration
                </Button>
              ) : item.cta ? (
                <Button href={item.cta.href} className="mt-4" variant="secondary">
                  {item.cta.label}
                </Button>
              ) : (
                <Button className="mt-4" variant="secondary" onClick={() => setLogOpen(true)}>
                  Fix protein
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/app/nutrition" className="rounded-3xl border border-white/8 bg-bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Consumed / target</p>
          <p className="mt-2 font-semibold">Nutrition</p>
          <p className="mt-1 text-sm text-muted">Score {day.score.total}</p>
        </Link>
        <Link href="/app/what-if" className="rounded-3xl border border-white/8 bg-bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Simulate first</p>
          <p className="mt-2 font-semibold">What-If</p>
        </Link>
        <Link href="/app/analytics" className="rounded-3xl border border-white/8 bg-bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Charts on demand</p>
          <p className="mt-2 font-semibold">Analytics</p>
        </Link>
        <Link href="/app/coach" className="rounded-3xl border border-white/8 bg-bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Ask a follow-up</p>
          <p className="mt-2 font-semibold">Coach</p>
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Pattern found</h2>
      {patterns.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Log a few more days and Nutrician will surface patterns from your actual history. We never invent personal habits.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {patterns.map((item) => (
            <Card key={item.id}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-orange">Pattern found</p>
              <p className="mt-2 font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
              {item.cta ? (
                <Button href={item.cta.href} variant="secondary" className="mt-3">
                  {item.cta.label}
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
