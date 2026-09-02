"use client";

import { coreMetrics, toneFor, type CoreKey } from "@/lib/experience";
import type { DayNutrition, NutritionTargets } from "@/lib/types";
import { cn } from "@/lib/utils";

const NODES: { key: CoreKey; label: string; x: string; y: string; delay: string }[] = [
  { key: "protein", label: "Protein", x: "50%", y: "6%", delay: "" },
  { key: "fiber", label: "Fiber", x: "8%", y: "32%", delay: "orbit-node-delay-1" },
  { key: "water", label: "Water", x: "92%", y: "32%", delay: "orbit-node-delay-2" },
  { key: "energy", label: "Energy", x: "14%", y: "82%", delay: "orbit-node-delay-3" },
  { key: "calories", label: "Calories", x: "86%", y: "82%", delay: "orbit-node-delay-4" },
];

const TONE: Record<string, string> = {
  good: "rgba(61,255,143,0.9)",
  watch: "rgba(255,180,90,0.9)",
  needs: "rgba(255,107,122,0.95)",
  high: "rgba(255,180,90,0.95)",
};

export function NutritionCore({
  day,
  targets,
  onSelect,
}: {
  day: DayNutrition;
  targets: NutritionTargets;
  onSelect?: (key: CoreKey) => void;
}) {
  const metrics = coreMetrics(day, targets);
  const score = day.score.total;
  const vibrant = score >= 80;

  return (
    <div className="core-glow relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[380px]">
      <div
        className={cn(
          "absolute left-1/2 top-1/2 grid h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0b100e] core-ring",
          vibrant && "shadow-[0_0_80px_rgba(61,255,143,0.16)]",
        )}
      >
        <div className="score-pop text-center">
          <p className="text-6xl font-semibold tracking-tight md:text-7xl">{score}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Score</p>
        </div>
      </div>
      {NODES.map((node) => {
        const metric = metrics[node.key];
        const tone = toneFor(metric.pct);
        const size = tone === "needs" ? 18 : tone === "watch" ? 14 : 11;
        return (
          <button
            key={node.key}
            type="button"
            onClick={() => onSelect?.(node.key)}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: node.x, top: node.y }}
            aria-label={`${node.label} ${metric.pct} percent of target`}
          >
            <span
              className={cn("orbit-node mx-auto block rounded-full", node.delay)}
              style={{
                width: size,
                height: size,
                background: TONE[tone],
                boxShadow: `0 0 ${tone === "needs" ? 16 : 10}px ${TONE[tone]}`,
              }}
            />
            <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{node.label}</span>
          </button>
        );
      })}
    </div>
  );
}
