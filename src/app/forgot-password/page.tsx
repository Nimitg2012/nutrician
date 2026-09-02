"use client";

import { Button, Card, Field, Input } from "@/components/ui";
import { MarketingShell } from "@/components/marketing/shell";
import { useNutrician } from "@/lib/store";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const requestReset = useNutrician((s) => s.requestReset);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);

  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">This demo does not send email. If the account exists, a local reset token is created.</p>
        <Card className="mt-6 space-y-4">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Button
            className="w-full"
            onClick={() => {
              const next = requestReset(email);
              setToken(next);
            }}
          >
            Generate reset token
          </Button>
          {token ? (
            <p className="text-sm">
              Token: <code className="rounded bg-white/10 px-1">{token}</code>. Use it on the reset page.
            </p>
          ) : null}
          <Button href="/reset-password" variant="ghost" className="w-full">
            I have a token
          </Button>
        </Card>
      </div>
    </MarketingShell>
  );
}
