"use client";

import { useNutrician } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const OPTIONS = [
  { id: "photo", label: "Scan meal" },
  { id: "search", label: "Search food" },
  { id: "choose", label: "Choose meal" },
  { id: "recent", label: "Recent" },
  { id: "custom", label: "Custom" },
] as const;

export function LogFab() {
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const [open, setOpen] = useState(false);

  const pick = (tab: string) => {
    window.dispatchEvent(new CustomEvent("nutrician-log-tab", { detail: tab }));
    setLogOpen(true);
    setOpen(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center md:bottom-8">
      <div className="pointer-events-auto relative">
        {open ? (
          <div className="absolute bottom-16 left-1/2 flex w-56 -translate-x-1/2 flex-col gap-2 rounded-3xl border border-white/10 bg-[#0c1110]/95 p-3 shadow-2xl backdrop-blur">
            {OPTIONS.map((item) => (
              <button key={item.id} type="button" onClick={() => pick(item.id)} className="rounded-2xl px-3 py-2 text-left text-sm hover:bg-white/5">
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          aria-expanded={open}
          aria-label="Log food"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "grid h-14 w-14 place-items-center rounded-full bg-accent text-lg font-semibold text-[#04140b] shadow-[0_8px_30px_rgba(61,255,143,0.28)]",
            open && "rotate-45",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
