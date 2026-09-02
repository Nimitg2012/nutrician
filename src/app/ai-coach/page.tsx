import { MarketingShell } from "@/components/marketing/shell";
import { Button, Card } from "@/components/ui";

const PROMPTS = [
  "What should I eat for dinner?",
  "Why is my score low?",
  "How can I increase protein?",
  "Give me a high-protein vegetarian lunch.",
  "I have 500 calories left. What can I eat?",
  "What nutrients am I missing this week?",
];

export default function AiCoachPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">AI Nutrition Coach</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A conversation that can see remaining calories, protein and hydration. It can suggest meals, generate a plan or
          explain a score. It cannot diagnose, treat or replace a clinician.
        </p>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {PROMPTS.map((item) => (
            <Card key={item} className="text-sm">
              “{item}”
            </Card>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="font-semibold">How it uses your data</h2>
          <p className="mt-2 text-sm text-muted">
            The coach reads today's log and weekly patterns from the same store as Dashboard. Photo recognition is an
            estimate you can edit. Turn AI off in Settings if you want logging without suggestions.
          </p>
        </Card>
        <Button href="/signup" className="mt-8">
          Ask the demo coach
        </Button>
      </section>
    </MarketingShell>
  );
}
