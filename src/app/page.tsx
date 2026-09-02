import { MarketingShell } from "@/components/marketing/shell";
import { Badge, Button, Card, Progress, ScoreRing } from "@/components/ui";
import Link from "next/link";

const FEATURES = [
  ["Track everything", "Calories, macros, micros, meals and hydration in one calm command center."],
  ["Smart insights", "Nutrician Intelligence™ explains the gap, then names the next meal."],
  ["Personalized plans", "Breakfast, lunch and dinner that respect remaining calories and protein."],
  ["Stay hydrated", "Water tracking with context-aware reminders, not spam."],
  ["Progress tracking", "Week vs last week, streaks and Nutrition Score history."],
  ["AI Nutrition Coach", "Ask what to eat with 500 kcal left — and get an answer that uses your log."],
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-60" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="rise">
            <Badge>Your nutrition on autopilot</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">Track. Understand. Act.</h1>
            <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
              Nutrician transforms your food and health data into personalized decisions that help you eat better every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup">Get started free</Button>
              <Button href="/how-it-works" variant="secondary">
                See how it works
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">Don't just track your food. Know your next move.</p>
          </div>
          <Card className="glow-ring rise">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Nutrition Score</p>
                <p className="text-sm text-muted">Demo · Alex</p>
              </div>
              <Badge tone="green">Great</Badge>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <ScoreRing score={85} />
              <div className="flex-1 space-y-3 text-sm">
                <Row label="Calories" value="1,820 / 2,200" pct={83} />
                <Row label="Protein" value="92 / 120g" pct={77} tone="blue" />
                <Row label="Carbs" value="220 / 300g" pct={73} tone="purple" />
                <Row label="Fat" value="68 / 80g" pct={85} tone="orange" />
                <Row label="Water" value="6 / 8 cups" pct={75} />
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-accent/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Recommended next action</p>
              <p className="mt-1 text-sm">You're 28g short of today's protein target. A Chicken Rice Bowl can close the gap inside remaining calories.</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-y border-white/8 bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-4">
          {[
            ["12k+", "demo users in this product story"],
            ["4.8", "demo rating on the preview build"],
            ["Local-first", "this demo stores data in your browser"],
            ["Not medical", "coaching and education only"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-2xl font-semibold">{k}</p>
              <p className="mt-1 text-sm text-muted">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">The loop</p>
        <h2 className="mt-2 text-3xl font-semibold">Log → Understand → Predict → Recommend → Adapt</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map(([title, body]) => (
            <Card key={title}>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Traditional apps tell you what happened.</h2>
            <p className="mt-1 text-muted">Nutrician tells you what to do next.</p>
          </div>
          <Button href="/login">Try the Alex demo</Button>
        </Card>
        <p className="mt-4 text-center text-xs text-muted">
          Trust indicators above are demo placeholders, not real customer claims.{" "}
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
        </p>
      </section>
    </MarketingShell>
  );
}

function Row({
  label,
  value,
  pct,
  tone = "accent",
}: {
  label: string;
  value: string;
  pct: number;
  tone?: "accent" | "blue" | "purple" | "orange";
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span>{value}</span>
      </div>
      <Progress value={pct} tone={tone} />
    </div>
  );
}
