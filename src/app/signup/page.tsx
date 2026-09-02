"use client";

import { Button, Card, Field, Input } from "@/components/ui";
import { MarketingShell } from "@/components/marketing/shell";
import { useNutrician } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const signup = useNutrician((s) => s.signup);
  const loginDemo = useNutrician((s) => s.loginDemo);
  const loginGuest = useNutrician((s) => s.loginGuest);
  const toast = useNutrician((s) => s.toast);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">Create your Nutrician</h1>
        <p className="mt-2 text-sm text-muted">Local demo accounts only. After signup you set targets in a four-step onboarding.</p>
        <Card className="mt-6 space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password">
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </Field>
          <Button
            className="w-full"
            onClick={() => {
              if (password !== confirm) {
                toast("Passwords do not match", undefined, "error");
                return;
              }
              if (signup(name, email, password)) router.push("/onboarding");
            }}
          >
            Create account
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => { loginDemo(); router.push("/app/dashboard"); }}>
            Try Alex demo
          </Button>
          <Button className="w-full" variant="ghost" onClick={() => { loginGuest(); router.push("/app/dashboard"); }}>
            Continue as guest
          </Button>
        </Card>
      </div>
    </MarketingShell>
  );
}
