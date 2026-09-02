import { MarketingShell } from "@/components/marketing/shell";
import { Button, Card } from "@/components/ui";

const STEPS = [
  ["Log", "Record meals, drinks, water and nutrition in seconds."],
  ["Analyze", "Nutrician Intelligence™ scores macros, micros, hydration and timing."],
  ["Track", "The system watches remaining room against your actual targets."],
  ["Understand", "AI finds gaps, skipped breakfasts and weekend hydration dips from data."],
  ["Act", "You get the next best meal, not another dashboard tile."],
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">How Nutrician works</h1>
        <p className="mt-3 max-w-2xl text-muted">Log → Understand → Predict → Recommend → Adapt → Improve.</p>
        <div className="mt-10 space-y-4">
          {STEPS.map(([title, body], index) => (
            <Card key={title} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent/15 font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            </Card>
          ))}
        </div>
        <Button href="/signup" className="mt-10">
          See it with demo data
        </Button>
      </div>
    </MarketingShell>
  );
}
