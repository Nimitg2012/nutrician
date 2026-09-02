"use client";

import { Button, Card, Field, Input } from "@/components/ui";
import { MarketingShell } from "@/components/marketing/shell";
import { useNutrician } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const resetPassword = useNutrician((s) => s.resetPassword);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">Reset password</h1>
        <p className="mt-2 text-sm text-muted">Paste the demo token from the previous step. No email is sent.</p>
        <Card className="mt-6 space-y-4">
          <Field label="Reset token">
            <Input value={token} onChange={(e) => setToken(e.target.value)} />
          </Field>
          <Field label="New password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button
            className="w-full"
            onClick={() => {
              if (resetPassword(token, password)) router.push("/login");
            }}
          >
            Update password
          </Button>
        </Card>
      </div>
    </MarketingShell>
  );
}
