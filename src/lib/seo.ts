import { BLOG_POSTS } from "@/lib/data/content";

export const SITE_ORIGIN = "https://nutrician.online";
export const SITE_NAME = "Nutrician";
export const OG_IMAGE_PATH = "/og-image.png";

export const HOME_DESCRIPTION =
  "Nutrician is an AI-powered nutrition platform that tracks what you eat, analyzes your nutrition, and helps you know what to do next.";

type SeoPage = {
  title: string;
  description: string;
  index: boolean;
  ogType?: "website" | "article";
};

const PRIVATE_PREFIXES = ["/app"];
const PRIVATE_PATHS = new Set([
  "/login",
  "/signup",
  "/onboarding",
  "/forgot-password",
  "/reset-password",
]);

const PAGES: Record<string, SeoPage> = {
  "/": {
    title: "Nutrician — Your Nutrition on Autopilot",
    description: HOME_DESCRIPTION,
    index: true,
  },
  "/features": {
    title: "Nutrician — Features",
    description:
      "Explore Nutrician features for food tracking, nutrition analysis, meal plans, hydration, progress, and an AI nutrition coach that helps you decide what to do next.",
    index: true,
  },
  "/how-it-works": {
    title: "Nutrician — How It Works",
    description:
      "See how Nutrician works: log meals, understand your nutrition, and get a clear next action instead of another calorie total.",
    index: true,
  },
  "/ai-coach": {
    title: "Nutrician — AI Nutrition Coach",
    description:
      "Ask Nutrician’s AI nutrition coach what to eat next. Suggestions use your log, remaining calories, and nutrient gaps. Not medical advice.",
    index: true,
  },
  "/pricing": {
    title: "Nutrician — Pricing",
    description:
      "Compare Nutrician Free and Premium. Track meals on Free, or preview AI coaching, plans, and advanced nutrition insights on Premium.",
    index: true,
  },
  "/about": {
    title: "Nutrician — About",
    description:
      "Nutrician is an AI-powered nutrition platform built to help people track what they eat, understand their nutrition, and know what to do next.",
    index: true,
  },
  "/blog": {
    title: "Nutrician — Blog",
    description:
      "Read Nutrician articles on meal tracking, protein, hydration, meal planning, and deciding what to eat next.",
    index: true,
  },
  "/faq": {
    title: "Nutrician — FAQ",
    description:
      "Answers about Nutrician, AI nutrition coaching, food logging, privacy, Premium, and the limits of this wellness product.",
    index: true,
  },
  "/contact": {
    title: "Nutrician — Contact",
    description: "Contact Nutrician with product questions. This demo form stays in your browser and does not send email.",
    index: true,
  },
  "/terms": {
    title: "Nutrician — Terms",
    description: "Terms of use for the Nutrician website and product demo.",
    index: true,
  },
  "/privacy": {
    title: "Nutrician — Privacy",
    description: "How Nutrician handles data in this local-first demo, including export and deletion from Settings.",
    index: true,
  },
  "/login": {
    title: "Nutrician — Sign In",
    description: "Sign in to Nutrician to continue tracking meals and nutrition.",
    index: false,
  },
  "/signup": {
    title: "Nutrician — Create Account",
    description: "Create a Nutrician account to track meals and get next-move nutrition guidance.",
    index: false,
  },
  "/onboarding": {
    title: "Nutrician — Onboarding",
    description: "Set up how you eat so Nutrician can personalize tracking and next-move guidance.",
    index: false,
  },
  "/forgot-password": {
    title: "Nutrician — Forgot Password",
    description: "Reset access to your Nutrician account.",
    index: false,
  },
  "/reset-password": {
    title: "Nutrician — Reset Password",
    description: "Choose a new password for your Nutrician account.",
    index: false,
  },
  "/app/dashboard": { title: "Nutrician — Today", description: HOME_DESCRIPTION, index: false },
  "/app/track": { title: "Nutrician — Track", description: HOME_DESCRIPTION, index: false },
  "/app/insights": { title: "Nutrician — Insights", description: HOME_DESCRIPTION, index: false },
  "/app/plan": { title: "Nutrician — Plan", description: HOME_DESCRIPTION, index: false },
  "/app/planner": { title: "Nutrician — Planner", description: HOME_DESCRIPTION, index: false },
  "/app/progress": { title: "Nutrician — Progress", description: HOME_DESCRIPTION, index: false },
  "/app/history": { title: "Nutrician — History", description: HOME_DESCRIPTION, index: false },
  "/app/search": { title: "Nutrician — Search", description: HOME_DESCRIPTION, index: false },
  "/app/goals": { title: "Nutrician — Goals", description: HOME_DESCRIPTION, index: false },
  "/app/water": { title: "Nutrician — Water", description: HOME_DESCRIPTION, index: false },
  "/app/meals": { title: "Nutrician — Meals", description: HOME_DESCRIPTION, index: false },
  "/app/nutrition": { title: "Nutrician — Nutrition", description: HOME_DESCRIPTION, index: false },
  "/app/settings": { title: "Nutrician — Settings", description: HOME_DESCRIPTION, index: false },
  "/app/recipes": { title: "Nutrician — Recipes", description: HOME_DESCRIPTION, index: false },
  "/app/grocery": { title: "Nutrician — Grocery", description: HOME_DESCRIPTION, index: false },
  "/app/achievements": { title: "Nutrician — Achievements", description: HOME_DESCRIPTION, index: false },
  "/app/reminders": { title: "Nutrician — Reminders", description: HOME_DESCRIPTION, index: false },
  "/app/reports": { title: "Nutrician — Reports", description: HOME_DESCRIPTION, index: false },
  "/app/analytics": { title: "Nutrician — Analytics", description: HOME_DESCRIPTION, index: false },
  "/app/coach": { title: "Nutrician — Coach", description: HOME_DESCRIPTION, index: false },
  "/app/what-if": { title: "Nutrician — What If", description: HOME_DESCRIPTION, index: false },
  "/app/profile": { title: "Nutrician — Profile", description: HOME_DESCRIPTION, index: false },
};

export function isPrivatePath(pathname: string) {
  if (PRIVATE_PATHS.has(pathname)) return true;
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function canonicalUrl(pathname: string) {
  if (pathname === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${pathname}`;
}

export function seoForPath(pathname: string): SeoPage & { canonical: string | null } {
  if (PAGES[pathname]) {
    const page = PAGES[pathname];
    return {
      ...page,
      canonical: page.index ? canonicalUrl(pathname) : null,
    };
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    const post = BLOG_POSTS.find((item) => item.slug === slug);
    if (post) {
      return {
        title: `Nutrician — ${post.title}`,
        description: post.excerpt,
        index: true,
        ogType: "article",
        canonical: canonicalUrl(pathname),
      };
    }
  }

  if (pathname.startsWith("/app/recipes/")) {
    return { title: "Nutrician — Recipe", description: HOME_DESCRIPTION, index: false, canonical: null };
  }

  if (isPrivatePath(pathname)) {
    return { title: "Nutrician", description: HOME_DESCRIPTION, index: false, canonical: null };
  }

  return {
    title: "Nutrician — Page not found",
    description: "That page is not part of Nutrician.",
    index: false,
    canonical: null,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}/favicon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        description: HOME_DESCRIPTION,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

function upsertMeta(selector: string, attrs: Record<string, string>, content: string | null) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string | null) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applySeo(pathname: string) {
  const seo = seoForPath(pathname);
  const url = seo.canonical ?? canonicalUrl(pathname);
  const image = `${SITE_ORIGIN}${OG_IMAGE_PATH}`;
  const robots = seo.index ? "index, follow" : "noindex, nofollow";

  document.title = seo.title;

  upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
  upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
  upsertMeta('meta[name="googlebot"]', { name: "googlebot" }, robots);

  upsertLink("canonical", seo.canonical);

  upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
  upsertMeta('meta[property="og:description"]', { property: "og:description" }, seo.description);
  upsertMeta('meta[property="og:url"]', { property: "og:url" }, seo.index ? url : null);
  upsertMeta('meta[property="og:type"]', { property: "og:type" }, seo.ogType ?? "website");
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
  upsertMeta('meta[property="og:image"]', { property: "og:image" }, image);
  upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, "Nutrician — Your Nutrition on Autopilot");
  upsertMeta('meta[property="og:image:width"]', { property: "og:image:width" }, "1200");
  upsertMeta('meta[property="og:image:height"]', { property: "og:image:height" }, "630");
  upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "en_US");

  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, seo.description);
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);

  let script = document.getElementById("nutrician-jsonld");
  if (seo.index) {
    if (!script) {
      script = document.createElement("script");
      script.id = "nutrician-jsonld";
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(organizationJsonLd());
  } else {
    script?.remove();
  }
}
