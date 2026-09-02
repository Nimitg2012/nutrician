"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function AIPulse({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-muted"
        aria-label="Nutrician Intelligence status"
      >
        <span className={cn("h-1.5 w-1.5 rounded-full bg-accent ai-dot")} />
        AI active
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d1210] p-3 text-sm shadow-xl">
          Nutrician Intelligence found {count} insight{count === 1 ? "" : "s"}.
        </div>
      ) : null}
    </div>
  );
}
