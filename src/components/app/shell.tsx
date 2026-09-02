"use client";

import { LogMealModal } from "@/components/app/log-meal";
import { AIPulse } from "@/components/core/ai-pulse";
import { LogFab } from "@/components/core/log-fab";
import { Logo } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { analyzeDay } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const NAV = [
  { href: "/app/dashboard", label: "Today", match: ["/app/dashboard"] },
  { href: "/app/track", label: "Track", match: ["/app/track", "/app/meals", "/app/water"] },
  { href: "/app/insights", label: "Insights", match: ["/app/insights", "/app/nutrition", "/app/what-if", "/app/analytics", "/app/coach", "/app/reports"] },
  { href: "/app/plan", label: "Plan", match: ["/app/plan", "/app/planner", "/app/recipes", "/app/grocery"] },
  { href: "/app/progress", label: "Progress", match: ["/app/progress", "/app/goals", "/app/achievements", "/app/history"] },
];

function active(pathname: string, match: string[]) {
  return match.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useNutrician((s) => s.session);
  const hydrated = useNutrician((s) => s.hydrated);
  const profile = useNutrician((s) => s.profile);
  const logout = useNutrician((s) => s.logout);
  const logOpen = useNutrician((s) => s.logOpen);
  const { ctx } = useToday();
  const insights = session ? analyzeDay(ctx).filter((item) => item.severity === "attention") : [];

  useEffect(() => {
    if (!hydrated) return;
    if (!session) router.replace("/login");
    else if (!profile.onboardingComplete && !session.isGuest && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [hydrated, session, profile.onboardingComplete, pathname, router]);

  if (!hydrated || !session) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading Nutrician…</div>;
  }

  return (
    <div className="min-h-screen bg-bg md:flex">
      <aside className="hidden w-56 shrink-0 border-r border-white/8 md:flex md:flex-col">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-ink",
                active(pathname, item.match) && "bg-accent/10 text-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/8 p-4">
          <p className="text-sm font-medium">{session.name}</p>
          <p className="text-xs capitalize text-muted">
            {session.plan} · {session.isGuest ? "guest" : session.email}
          </p>
          <Link href="/app/history" className="mt-3 block text-xs text-muted hover:text-ink">
            History
          </Link>
          <Link href="/app/search" className="mt-2 block text-xs text-muted hover:text-ink">
            Search
          </Link>
          <Link href="/app/settings" className="mt-2 block text-xs text-muted hover:text-ink">
            Settings
          </Link>
          <button
            type="button"
            className="mt-2 text-xs text-muted hover:text-ink"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 pb-28 md:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-white/8 bg-bg/80 px-4 backdrop-blur md:h-16">
          <div className="md:hidden">
            <Logo />
          </div>
          <p className="hidden text-sm text-muted md:block">Your nutrition on autopilot.</p>
          <div className="flex items-center gap-3">
            <AIPulse count={insights.length} />
            <p className="hidden text-sm md:block">{session.name}</p>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-bg/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("py-3 text-center text-[11px] text-muted", active(pathname, item.match) && "text-accent")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      {logOpen ? null : <LogFab />}
      {pathname === "/app/coach" ? null : (
        <Link
          href="/app/coach"
          aria-label="Open Nutrician Intelligence"
          className="fixed right-4 bottom-28 z-40 grid h-12 w-12 place-items-center rounded-full bg-purple/20 text-purple shadow-[0_0_24px_rgba(167,139,250,0.25)] md:bottom-8"
        >
          <span className="h-2 w-2 rounded-full bg-purple ai-dot" />
        </Link>
      )}
      <LogMealModal />
    </div>
  );
}
