"use client";

import { MarketingShell } from "@/components/marketing/shell";
import { BLOG_POSTS } from "@/lib/data/content";
import Link from "next/link";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) return <NotFound />;

  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs text-muted">
          {post.category} · {post.date} · demo article
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-7 text-muted">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link href="/blog" className="mt-10 inline-block text-sm text-accent">
          All articles
        </Link>
      </article>
    </MarketingShell>
  );
}
