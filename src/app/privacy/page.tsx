import { MarketingShell } from "@/components/marketing/shell";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-sm leading-7 text-muted">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
        <p className="mt-6">
          This demo stores nutrition data in your browser via local storage. There is no production backend, no payment
          processor and no third-party AI key in the client bundle.
        </p>
        <p className="mt-4">
          You can export JSON/CSV from Reports or Settings and delete the local account from Settings. Turning off AI in
          Settings stops coach generations; logging still works.
        </p>
        <p className="mt-4">
          AI output is an estimate, not a diagnosis. Do not paste secrets into the coach. HTTPS should be used in any
          hosted deployment.
        </p>
      </section>
    </MarketingShell>
  );
}
