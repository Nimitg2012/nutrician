import { MarketingShell } from "@/components/marketing/shell";
import { Card } from "@/components/ui";
import { FAQ_ITEMS } from "@/lib/data/content";

export default function FaqPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">FAQ</h1>
        <p className="mt-3 text-muted">Straight answers, including the medical and privacy limits of this demo.</p>
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <Card key={item.q}>
              <p className="font-medium">{item.q}</p>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
