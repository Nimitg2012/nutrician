"use client";

import { useNutrician } from "@/lib/store";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrated = useNutrician((s) => s.hydrated);
  const toasts = useNutrician((s) => s.toasts);
  const dismissToast = useNutrician((s) => s.dismissToast);
  const setHydrated = useNutrician((s) => s.setHydrated);

  useEffect(() => {
    if (!hydrated) setHydrated();
  }, [hydrated, setHydrated]);

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismissToast(toast.id)}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-left shadow-2xl backdrop-blur rise ${
              toast.tone === "success"
                ? "border-accent/30 bg-[#102018]/95"
                : toast.tone === "error"
                  ? "border-danger/30 bg-[#1a1012]/95"
                  : "border-white/10 bg-[#12171c]/95"
            }`}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.body ? <p className="mt-1 text-xs text-muted">{toast.body}</p> : null}
          </button>
        ))}
      </div>
    </>
  );
}
