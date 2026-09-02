import { Button } from "@/components/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">404</p>
        <h1 className="mt-3 text-3xl font-semibold">That page is not part of Nutrician</h1>
        <p className="mt-2 text-sm text-muted">The route does not exist. Head back to the homepage or Today.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/">Home</Button>
          <Link href="/app/dashboard" className="rounded-full px-4 py-2 text-sm text-muted hover:text-ink">
            Today
          </Link>
        </div>
      </div>
    </div>
  );
}
