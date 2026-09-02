import { MarketingShell } from "@/components/marketing/shell";
import { Card } from "@/components/ui";

export default function AboutPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">About Nutrician</h1>
        <p className="mt-4 text-muted">
          Nutrician is a nutrition operating system: log once, then get a next move. This repository is a production-quality
          demo that stores data locally in your browser. It is not a clinic, lab or medical device.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-semibold">What we optimize for</h2>
            <p className="mt-2 text-sm text-muted">
              Decision quality. If a screen cannot help you choose the next meal, water cup or plan swap, it does not belong
              on the dashboard.
            </p>
          </Card>
          <Card>
            <h2 className="font-semibold">What we will not claim</h2>
            <p className="mt-2 text-sm text-muted">
              Real customer counts, guaranteed weight change, or diagnostic accuracy. Demo stats on the home page are labeled
              as demo.
            </p>
          </Card>
        </div>
        <Card className="mt-4">
          <h2 className="font-semibold">About the Creator</h2>
          <p className="mt-2 text-sm text-muted">
            Nutrician was created by Nimit Generates, who designed the concept and product around a simple idea: nutrition
            tracking should not just tell people what they ate, but help them understand what to do next.
          </p>
        </Card>
      </div>
    </MarketingShell>
  );
}
