"use client";

import { cn } from "@/lib/utils";

export function HydrationDots({
  current,
  target,
  onAdd,
}: {
  current: number;
  target: number;
  onAdd: () => void;
}) {
  const cups = Math.max(target, current);
  return (
    <div>
      <p className="text-3xl font-semibold">
        {current} / {target}
      </p>
      <p className="text-sm text-muted">cups</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: cups }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={i < current ? `Cup ${i + 1} logged` : `Add cup ${i + 1}`}
            onClick={onAdd}
            className={cn(
              "h-4 w-4 rounded-full transition",
              i < current ? "bg-blue shadow-[0_0_10px_rgba(91,157,255,0.45)]" : "border border-blue/40 bg-transparent",
            )}
          />
        ))}
      </div>
    </div>
  );
}
