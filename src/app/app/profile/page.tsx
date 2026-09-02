"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/settings");
  }, [router]);
  return <div className="grid min-h-screen place-items-center text-sm text-muted">Opening settings…</div>;
}
