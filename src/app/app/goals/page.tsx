"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, Field, Input, PageIntro, Progress, Select } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { dayNutrition } from "@/lib/selectors";
import { useNutrician } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { useState } from "react";

export default function GoalsPage() {
  const { meals, water, targets, date } = useToday();
  const goals = useNutrician((s) => s.goals);
  const toggleGoal = useNutrician((s) => s.toggleGoal);
  const addGoal = useNutrician((s) => s.addGoal);
  const updateGoal = useNutrician((s) => s.updateGoal);
  const deleteGoal = useNutrician((s) => s.deleteGoal);
  const completeGoal = useNutrician((s) => s.completeGoal);
  const day = dayNutrition(meals, water, targets, date);
  const [title, setTitle] = useState("Hit fiber target");
  const [metric, setMetric] = useState<Goal["metric"]>("fiber");
  const [target, setTarget] = useState("30");
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");

  const current = (goal: Goal) => {
    if (goal.metric === "protein") return day.totals.protein;
    if (goal.metric === "water") return day.waterCups;
    if (goal.metric === "calories") return day.totals.calories;
    if (goal.metric === "fiber") return day.totals.fiber;
    if (goal.metric === "score") return day.score.total;
    return day.mealCount;
  };

  const unitFor = (key: Goal["metric"]) => {
    if (key === "water") return "cups";
    if (key === "calories") return "kcal";
    if (key === "score") return "pts";
    if (key === "consistency") return "meals";
    return "g";
  };

  return (
    <AppShell>
      <PageIntro
        kicker="Targets that change the next meal"
        title="Goals"
        body="Each goal is scored from today's log. Pause, complete, edit or delete without leaving this page."
      />
      {goals.length === 0 ? (
        <p className="mb-4 text-sm text-muted">No goals yet. Add one below — progress stays 0% until you log matching data.</p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const value = current(goal);
          const pct = goal.target ? Math.min(999, (value / goal.target) * 100) : 0;
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{goal.title}</p>
                  <p className="text-sm text-muted">
                    {Math.round(value)} / {goal.target} {goal.unit}
                    {goal.completedAt ? " · completed" : goal.active ? "" : " · paused"}
                    {pct >= 100 && goal.active ? " · 100% complete" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={pct} />
              </div>
              {editing === goal.id ? (
                <div className="mt-4 grid gap-2">
                  <Field label="Title">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  </Field>
                  <Field label="Target">
                    <Input value={editTarget} onChange={(e) => setEditTarget(e.target.value)} />
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        updateGoal(goal.id, { title: editTitle, target: Number(editTarget) || goal.target });
                        setEditing(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => toggleGoal(goal.id)}>
                    {goal.active ? "Pause" : "Resume"}
                  </Button>
                  <Button variant="ghost" onClick={() => completeGoal(goal.id)}>
                    Complete
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditing(goal.id);
                      setEditTitle(goal.title);
                      setEditTarget(String(goal.target));
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteGoal(goal.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Card className="mt-4">
        <h2 className="font-semibold">Add a goal</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Metric">
            <Select value={metric} onChange={(e) => setMetric(e.target.value as Goal["metric"])}>
              <option value="fiber">Fiber</option>
              <option value="protein">Protein</option>
              <option value="water">Water</option>
              <option value="calories">Calories</option>
              <option value="score">Score</option>
              <option value="consistency">Meals logged</option>
            </Select>
          </Field>
          <Field label="Target">
            <Input value={target} onChange={(e) => setTarget(e.target.value)} />
          </Field>
          <div className="flex items-end">
            <Button
              onClick={() => {
                if (!title.trim()) return;
                addGoal({
                  title: title.trim(),
                  metric,
                  target: Number(target) || 0,
                  unit: unitFor(metric),
                });
              }}
            >
              Save goal
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
