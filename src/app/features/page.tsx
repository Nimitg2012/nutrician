import { MarketingShell } from "@/components/marketing/shell";
import { Button, Card } from "@/components/ui";

const FEATURES = [
  {
    title: "Track everything",
    body: "Calories, macros, vitamins, minerals, meals and hydration in one log. Change a serving and every surface updates.",
  },
  {
    title: "Smart insights",
    body: "Nutrician Intelligence™ reads remaining protein, fiber and calories, then names the next action — not just a chart.",
  },
  {
    title: "Personalized plans",
    body: "Breakfast, lunch and dinner that respect remaining room, diet preference and foods you asked us to avoid.",
  },
  {
    title: "Stay hydrated",
    body: "Cup-level water tracking with quiet reminders when the afternoon gap actually appears.",
  },
  {
    title: "Progress tracking",
    body: "Score history, streaks and this week vs last week from the same meals you already logged.",
  },
  {
    title: "AI Nutrition Coach",
    body: "Ask what to eat with 500 kcal left. Answers use your log. Estimates are not medical advice.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Product</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Features that decide the next bite</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Traditional nutrition apps tell you what happened. Nutrician tells you what to do next. Demo data is labeled as demo.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {FEATURES.map((item) => (
            <Card key={item.title}>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
        <Button href="/signup" className="mt-10">
          Get started free
        </Button>
      </div>
    </MarketingShell>
  );
}
