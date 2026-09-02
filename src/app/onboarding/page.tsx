"use client";

import { Button, Card, Field, Input, Logo, Select } from "@/components/ui";
import { useNutrician } from "@/lib/store";
import type { ActivityLevel, DietPreference, MainGoal, Profile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEPS = ["You", "Body", "Goal", "Eating"] as const;

export default function OnboardingPage() {
  const profile = useNutrician((s) => s.profile);
  const completeOnboarding = useNutrician((s) => s.completeOnboarding);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(profile);

  const patch = (value: Partial<Profile>) => setDraft((current) => ({ ...current, ...value }));

  const finish = () => {
    completeOnboarding({ ...draft, onboardingComplete: true });
    router.push("/app/dashboard");
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Logo />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Tell Nutrician how you eat</h1>
      <p className="mt-2 text-sm text-muted">This sets calorie, protein and water targets. Everything can be edited later in Settings.</p>
      <div className="mt-4 flex gap-1">
        {STEPS.map((label, index) => (
          <div key={label} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-accent" : "bg-white/10"}`} />
        ))}
      </div>
      <Card className="mt-6 space-y-4">
        {step === 0 ? (
          <>
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
            </Field>
            <Field label="Age">
              <Input value={String(draft.age)} onChange={(e) => patch({ age: Number(e.target.value) || draft.age })} />
            </Field>
            <Field label="Sex">
              <Select value={draft.sex} onChange={(e) => patch({ sex: e.target.value as Profile["sex"] })}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other / prefer not to say</option>
              </Select>
            </Field>
            <Field label="Units">
              <Select value={draft.units} onChange={(e) => patch({ units: e.target.value as Profile["units"] })}>
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lb, ft)</option>
              </Select>
            </Field>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field label="Height (cm)">
              <Input value={String(draft.heightCm)} onChange={(e) => patch({ heightCm: Number(e.target.value) || draft.heightCm })} />
            </Field>
            <Field label="Weight (kg)">
              <Input value={String(draft.weightKg)} onChange={(e) => patch({ weightKg: Number(e.target.value) || draft.weightKg })} />
            </Field>
            <Field label="Activity level">
              <Select value={draft.activityLevel} onChange={(e) => patch({ activityLevel: e.target.value as ActivityLevel })}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="athlete">Athlete</option>
              </Select>
            </Field>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Field label="Main goal">
              <Select value={draft.mainGoal} onChange={(e) => patch({ mainGoal: e.target.value as MainGoal })}>
                <option value="healthy-eating">General healthy eating</option>
                <option value="fitness">Fitness</option>
                <option value="muscle-gain">Muscle gain</option>
                <option value="weight-management">Weight management</option>
                <option value="increase-protein">Increase protein</option>
                <option value="improve-hydration">Improve hydration</option>
                <option value="improve-consistency">Improve consistency</option>
              </Select>
            </Field>
            <Field label="Dietary preference">
              <Select value={draft.dietPreference} onChange={(e) => patch({ dietPreference: e.target.value as DietPreference })}>
                <option value="none">No specific diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="keto">Keto</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="high-protein">High protein</option>
              </Select>
            </Field>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <Field label="Allergies (comma separated)">
              <Input
                value={draft.allergies.join(", ")}
                onChange={(e) => patch({ allergies: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
              />
            </Field>
            <Field label="Foods to avoid">
              <Input
                value={draft.foodsToAvoid.join(", ")}
                onChange={(e) =>
                  patch({ foodsToAvoid: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })
                }
              />
            </Field>
            <Field label="Breakfast time">
              <Input
                type="time"
                value={draft.mealSchedule.breakfast}
                onChange={(e) => patch({ mealSchedule: { ...draft.mealSchedule, breakfast: e.target.value } })}
              />
            </Field>
            <Field label="Lunch time">
              <Input
                type="time"
                value={draft.mealSchedule.lunch}
                onChange={(e) => patch({ mealSchedule: { ...draft.mealSchedule, lunch: e.target.value } })}
              />
            </Field>
            <Field label="Dinner time">
              <Input
                type="time"
                value={draft.mealSchedule.dinner}
                onChange={(e) => patch({ mealSchedule: { ...draft.mealSchedule, dinner: e.target.value } })}
              />
            </Field>
          </>
        ) : null}
        <div className="flex justify-between pt-2">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)}>Continue</Button>
          ) : (
            <Button onClick={finish}>Go to dashboard</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
