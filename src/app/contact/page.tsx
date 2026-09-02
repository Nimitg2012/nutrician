"use client";

import { MarketingShell } from "@/components/marketing/shell";
import { Button, Card, Field, Input } from "@/components/ui";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Product question");
  const [message, setMessage] = useState("");

  return (
    <MarketingShell>
      <section className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-3 text-sm text-muted">This form stays in the browser. Nothing is emailed in the demo.</p>
        <Card className="mt-8 space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Subject">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Message</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <Button
            onClick={() => {
              if (name && email && message) setSent(true);
            }}
          >
            Submit
          </Button>
          {sent ? (
            <p className="text-sm text-accent">
              Saved locally. {name}, we logged “{subject}” from {email}. No ticket was created.
            </p>
          ) : null}
        </Card>
      </section>
    </MarketingShell>
  );
}
