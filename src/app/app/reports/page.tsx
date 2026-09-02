"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { generateWeeklyReview } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { downloadFile } from "@/lib/utils";

export default function ReportsPage() {
  const { ctx, session } = useToday();
  const exportCsv = useNutrician((s) => s.exportCsv);
  const exportJson = useNutrician((s) => s.exportJson);
  const upgradeToPremium = useNutrician((s) => s.upgradeToPremium);
  const review = generateWeeklyReview(ctx);

  return (
    <AppShell>
      <PageIntro
        kicker="Weekly AI review"
        title="Reports"
        body="A coach-style recap of the last seven logged days. CSV/JSON export now; printable PDF uses your browser print dialog."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-xs text-muted">Average score</p>
          <p className="mt-1 text-3xl font-semibold">{review.averageScore}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Protein</p>
          <p className="mt-1 text-3xl font-semibold">{review.proteinChange}%</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Hydration</p>
          <p className="mt-1 text-3xl font-semibold">{review.hydrationChange}%</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Goal completion</p>
          <p className="mt-1 text-3xl font-semibold">{review.goalCompletion}%</p>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-semibold">What improved</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {review.improved.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Needs attention</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {review.attention.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Next week's focus</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {review.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => downloadFile("nutrician-meals.csv", exportCsv(), "text/csv")}
        >
          Export CSV
        </Button>
        <Button
          variant="secondary"
          onClick={() => downloadFile("nutrician-export.json", exportJson(), "application/json")}
        >
          Export JSON
        </Button>
        <Button variant="ghost" onClick={() => window.print()}>
          Print / Save PDF
        </Button>
        {session?.plan === "free" ? (
          <Button variant="ghost" onClick={upgradeToPremium}>
            Unlock premium reports (demo)
          </Button>
        ) : null}
      </Card>
      <p className="mt-3 text-xs text-muted">
        Strongest day {review.strongestDay} · weakest day {review.weakestDay}. Not medical advice.
      </p>
    </AppShell>
  );
}
