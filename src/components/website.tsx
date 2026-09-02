"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/": "Nutrician — Your Nutrition on Autopilot",
  "/about": "About · Nutrician",
  "/features": "Features · Nutrician",
  "/how-it-works": "How it works · Nutrician",
  "/ai-coach": "AI Coach · Nutrician",
  "/pricing": "Pricing · Nutrician",
  "/blog": "Blog · Nutrician",
  "/faq": "FAQ · Nutrician",
  "/contact": "Contact · Nutrician",
  "/terms": "Terms · Nutrician",
  "/privacy": "Privacy · Nutrician",
  "/login": "Sign in · Nutrician",
  "/signup": "Create account · Nutrician",
  "/onboarding": "Onboarding · Nutrician",
  "/forgot-password": "Forgot password · Nutrician",
  "/reset-password": "Reset password · Nutrician",
  "/app/dashboard": "Today · Nutrician",
  "/app/track": "Track · Nutrician",
  "/app/insights": "Insights · Nutrician",
  "/app/plan": "Plan · Nutrician",
  "/app/planner": "Planner · Nutrician",
  "/app/progress": "Progress · Nutrician",
  "/app/history": "History · Nutrician",
  "/app/search": "Search · Nutrician",
  "/app/goals": "Goals · Nutrician",
  "/app/water": "Water · Nutrician",
  "/app/meals": "Meals · Nutrician",
  "/app/nutrition": "Nutrition · Nutrician",
  "/app/settings": "Settings · Nutrician",
  "/app/recipes": "Recipes · Nutrician",
  "/app/grocery": "Grocery · Nutrician",
  "/app/achievements": "Achievements · Nutrician",
  "/app/reminders": "Reminders · Nutrician",
  "/app/reports": "Reports · Nutrician",
  "/app/analytics": "Analytics · Nutrician",
  "/app/coach": "Coach · Nutrician",
  "/app/what-if": "What if · Nutrician",
  "/app/profile": "Profile · Nutrician",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/blog/")) return "Article · Nutrician";
  if (pathname.startsWith("/app/recipes/")) return "Recipe · Nutrician";
  if (pathname.startsWith("/app/")) return "Nutrician";
  return "Page not found · Nutrician";
}

export function WebsiteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleFor(pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
