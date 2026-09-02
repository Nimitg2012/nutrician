import { MarketingShell } from "@/components/marketing/shell";
import { Card } from "@/components/ui";
import { BLOG_POSTS } from "@/lib/data/content";
import Link from "next/link";

export default function BlogPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Journal</h1>
        <p className="mt-3 text-muted">Demo articles on eating, planning, hydration and AI nutrition. Clearly labeled as demo.</p>
        <div className="mt-10 space-y-4">
          {BLOG_POSTS.map((post) => (
            <Card key={post.slug}>
              <p className="text-xs text-muted">
                {post.category} · {post.readMinutes} min · demo
              </p>
              <Link href={`/blog/${post.slug}`} className="mt-2 block text-xl font-semibold hover:text-accent">
                {post.title}
              </Link>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
