"use client";

import { applySeo } from "@/lib/seo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function WebsiteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    applySeo(pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
