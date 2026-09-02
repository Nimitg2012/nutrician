"use client";

import { Button, Logo } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/ai-coach", label: "AI Coach" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn("hover:text-ink", pathname === link.href && "text-ink")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button href="/login" variant="ghost">
              Sign in
            </Button>
            <Button href="/signup">Get started free</Button>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-1.5 text-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
        {open ? (
          <div className="border-t border-white/8 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Button href="/signup">Get started free</Button>
            </div>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/8">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted">Your nutrition on autopilot. Track. Understand. Act.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Product</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/features">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/how-it-works">How it works</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </div>
        <p className="border-t border-white/8 px-4 py-4 text-center text-xs text-muted">
          Demo content. Nutrician is not a medical device.
        </p>
      </footer>
    </div>
  );
}
