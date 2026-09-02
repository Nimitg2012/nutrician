"use client";

import { Badge, Button, Card, Field, Input } from "@/components/ui";
import { MarketingShell } from "@/components/marketing/shell";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/data/demo";
import { useNutrician } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AuthForm() {
  const mode = useSearchParams().get("mode") ?? "login";
  const router = useRouter();
  const login = useNutrician((s) => s.login);
  const signup = useNutrician((s) => s.signup);
  const loginDemo = useNutrician((s) => s.loginDemo);
  const loginGuest = useNutrician((s) => s.loginGuest);
  const toast = useNutrician((s) => s.toast);
  const [email, setEmail] = useState(mode === "login" ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(mode === "login" ? DEMO_PASSWORD : "");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");

  const goApp = () => router.push("/app/dashboard");

  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <Badge>Secure local demo auth</Badge>
        <h1 className="mt-4 text-3xl font-semibold">{mode === "signup" ? "Create your Nutrician" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-muted">Passwords stay in this browser. Google/Apple buttons simulate SSO for the demo.</p>
        <Card className="mt-6 space-y-4">
          {mode === "signup" ? (
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
          ) : null}
          <Field label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </Field>
          {mode === "signup" ? (
            <Field label="Confirm password">
              <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" autoComplete="new-password" />
            </Field>
          ) : null}
          <Button
            className="w-full"
            onClick={() => {
              if (mode === "signup") {
                if (password !== confirm) {
                  toast("Passwords do not match", undefined, "error");
                  return;
                }
                if (signup(name, email, password)) router.push("/onboarding");
                return;
              }
              if (login(email, password)) goApp();
            }}
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => { loginDemo(); goApp(); }}>
            Continue with demo (Alex)
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => { loginDemo(); goApp(); }}>
              Google
            </Button>
            <Button variant="ghost" onClick={() => { loginDemo(); goApp(); }}>
              Apple
            </Button>
          </div>
          <Button className="w-full" variant="ghost" onClick={() => { loginGuest(); goApp(); }}>
            Continue as guest
          </Button>
          <p className="text-center text-xs text-muted">
            Demo login: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </p>
          {mode === "login" ? (
            <p className="text-center text-sm">
              <a href="/forgot-password" className="text-accent">
                Forgot password
              </a>
              {" · "}
              <a href="/login?mode=signup" className="text-accent">
                Create account
              </a>
            </p>
          ) : (
            <p className="text-center text-sm">
              <a href="/login" className="text-accent">
                Already have an account
              </a>
            </p>
          )}
        </Card>
      </div>
    </MarketingShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
