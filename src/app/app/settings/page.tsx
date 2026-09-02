"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, Field, Input, PageIntro, Select } from "@/components/ui";
import { useNutrician } from "@/lib/store";
import { downloadFile } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage() {
  const profile = useNutrician((s) => s.profile);
  const settings = useNutrician((s) => s.settings);
  const session = useNutrician((s) => s.session);
  const updateProfile = useNutrician((s) => s.updateProfile);
  const updateSettings = useNutrician((s) => s.updateSettings);
  const exportJson = useNutrician((s) => s.exportJson);
  const deleteAccount = useNutrician((s) => s.deleteAccount);
  const upgradeToPremium = useNutrician((s) => s.upgradeToPremium);
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(String(profile.weightKg));

  return (
    <AppShell>
      <PageIntro kicker="Account" title="Settings" body="Targets recompute when body stats or goal change. Data stays in this browser." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Weight (kg)">
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
          <Field label="Units">
            <Select value={profile.units} onChange={(e) => updateProfile({ units: e.target.value as "metric" | "imperial" })}>
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </Select>
          </Field>
          <Button onClick={() => updateProfile({ name, weightKg: Number(weight) || profile.weightKg })}>Save profile</Button>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-semibold">Notifications</h2>
          {(
            [
              ["meals", "Meal reminders"],
              ["water", "Water reminders"],
              ["goals", "Goal reminders"],
              ["weeklyReport", "Weekly report"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between text-sm">
              {label}
              <input
                type="checkbox"
                checked={settings.notifications[key]}
                onChange={(e) =>
                  updateSettings({ notifications: { ...settings.notifications, [key]: e.target.checked } })
                }
              />
            </label>
          ))}
          <h2 className="pt-4 font-semibold">Privacy</h2>
          <label className="flex items-center justify-between text-sm">
            Nutrician Intelligence™
            <input
              type="checkbox"
              checked={settings.privacy.aiEnabled}
              onChange={(e) => updateSettings({ privacy: { ...settings.privacy, aiEnabled: e.target.checked } })}
            />
          </label>
        </Card>
      </div>
      <Card className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => downloadFile("nutrician.json", exportJson(), "application/json")}>
          Export my data
        </Button>
        {session?.plan === "free" ? (
          <Button variant="ghost" onClick={upgradeToPremium}>
            Upgrade to premium (demo)
          </Button>
        ) : (
          <p className="self-center text-sm text-muted">Premium is unlocked on this demo profile.</p>
        )}
        <Button variant="danger" onClick={deleteAccount}>
          Delete local account
        </Button>
      </Card>
    </AppShell>
  );
}
