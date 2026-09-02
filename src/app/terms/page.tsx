import { MarketingShell } from "@/components/marketing/shell";

export default function TermsPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-sm leading-7 text-muted">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Terms of use</h1>
        <p className="mt-6">
          Nutrician is a wellness demo. It does not provide medical care. You are responsible for food choices and for
          verifying nutrition labels.
        </p>
        <p className="mt-4">
          Demo login credentials are public and not a real account. Google and Apple buttons simulate sign-in only. Premium
          unlocks no payment.
        </p>
        <p className="mt-4">
          Content, recipes and scores are provided as-is. If you fork this project, keep AI limitation notices visible.
        </p>
      </div>
    </MarketingShell>
  );
}
