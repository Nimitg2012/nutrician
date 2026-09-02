import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-[#04140b] shadow-[0_0_24px_rgba(61,255,143,0.25)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="currentColor" d="M12 2c.4 4.2 1.6 6.8 4.8 9.2C14.4 14.8 12.8 17 12 22c-.8-5-2.4-7.2-4.8-10.8C10.4 8.8 11.6 6.2 12 2Z" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Nutrician</span>
    </Link>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-accent text-[#04140b] hover:brightness-110",
    secondary: "border border-white/10 bg-white/5 text-ink hover:bg-white/10",
    ghost: "text-muted hover:text-ink hover:bg-white/5",
    danger: "bg-danger/15 text-danger hover:bg-danger/25",
  }[variant];
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
    styles,
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={props.onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-3xl border border-white/8 bg-bg-card p-5", className)}>{children}</div>;
}

export function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "blue" | "purple" | "orange" | "muted" }) {
  const map = {
    green: "bg-accent/12 text-accent",
    blue: "bg-blue/12 text-blue",
    purple: "bg-purple/12 text-purple",
    orange: "bg-orange/12 text-orange",
    muted: "bg-white/6 text-muted",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide", map[tone])}>{children}</span>;
}

export function Progress({ value, tone = "accent" }: { value: number; tone?: "accent" | "blue" | "purple" | "orange" | "danger" }) {
  const color = {
    accent: "bg-accent",
    blue: "bg-blue",
    purple: "bg-purple",
    orange: "bg-orange",
    danger: "bg-danger",
  }[tone];
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/8">
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink",
        props.className,
      )}
    />
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center">
      <p className="text-base font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ScoreRing({ score, size = 148 }: { score: number; size?: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" className="overflow-visible">
      <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle
        cx="66"
        cy="66"
        r={r}
        fill="none"
        stroke="#3dff8f"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 66 66)"
      />
      <text x="66" y="62" textAnchor="middle" fill="#f3f7f4" fontSize="28" fontWeight="700">
        {score}
      </text>
      <text x="66" y="80" textAnchor="middle" fill="#8b938f" fontSize="11">
        / 100
      </text>
    </svg>
  );
}

export function FoodArt({ name, hue, className }: { name: string; hue: number; className?: string }) {
  return (
    <div
      className={cn("grid place-items-center rounded-2xl text-sm font-semibold", className)}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 40% 16%), hsl(${(hue + 40) % 360} 50% 10%))`,
      }}
      aria-hidden
    >
      {name.slice(0, 1)}
    </div>
  );
}

export function PageIntro({ kicker, title, body }: { kicker?: string; title: string; body?: string }) {
  return (
    <div className="mb-6">
      {kicker ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{kicker}</p> : null}
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      {body ? <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">{body}</p> : null}
    </div>
  );
}
