import { MarketingShell } from "@/components/marketing/shell";
import { Button, Card } from "@/components/ui";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    items: ["Basic food logging", "Basic dashboard", "Basic nutrition tracking", "Hydration", "Goals"],
  },
  {
    name: "Premium",
    price: "Demo unlock",
    items: [
      "Nutrician Intelligence™",
      "AI Nutrition Coach",
      "AI food recognition",
      "Advanced analytics",
      "Personalized meal plans",
      "What-If Nutrition™",
      "AI weekly reports",
      "Smart grocery planning",
    ],
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-3 max-w-2xl text-muted">
          No payment processing in this build. Premium is a local flag you can toggle from Settings to preview locked
          surfaces.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => (
            <Card key={plan.name}>
              <h2 className="text-sm text-muted">{plan.name}</h2>
              <p className="mt-1 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button href="/signup" className="mt-6" variant={plan.name === "Premium" ? "primary" : "secondary"}>
                Start with {plan.name.toLowerCase()}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
