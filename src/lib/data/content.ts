export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  date: string;
  demo: boolean;
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "next-move-nutrition",
    title: "Why tracking is not the same as knowing your next move",
    excerpt: "Most nutrition apps stop at a number. Nutrician is built around the decision that comes after the log.",
    category: "AI nutrition technology",
    readMinutes: 6,
    date: "2026-08-12",
    demo: true,
    body: [
      "Logging food is useful. It is also incomplete. A complete nutrition system should convert today’s intake into a clear action: what to eat next, what to adjust, and what pattern is quietly holding you back.",
      "Nutrician Intelligence™ looks at remaining calories, protein, fiber, hydration and timing together. The output is not a lecture. It is a next move — a meal, a swap, or a reminder that still fits the day you are actually living.",
      "This article is demo content for the Nutrician product experience. It is educational, not medical advice.",
    ],
  },
  {
    slug: "protein-gaps",
    title: "The protein gap: how it shows up by 3 p.m.",
    excerpt: "If protein is consistently low at lunch, dinner becomes a scramble. Here is how to catch it earlier.",
    category: "Fitness nutrition",
    readMinutes: 5,
    date: "2026-08-04",
    demo: true,
    body: [
      "Protein shortfalls rarely appear at breakfast. They compound after a carb-heavy lunch, then force an oversized dinner.",
      "A better pattern is to check remaining protein against remaining calories in the afternoon. If you still need 35g+ and have under 500 kcal left, choose a dense protein meal rather than a large mixed plate.",
      "Demo article for Nutrician. Not a diagnosis or treatment plan.",
    ],
  },
  {
    slug: "hydration-weekends",
    title: "Weekend hydration drift is more common than you think",
    excerpt: "Weekday water targets often collapse on Saturday. A lighter reminder beats a guilt cycle.",
    category: "Hydration",
    readMinutes: 4,
    date: "2026-07-28",
    demo: true,
    body: [
      "Hydration often tracks routine, not motivation. When the calendar changes, cup counts fall.",
      "Nutrician treats this as a pattern, not a failure. A two-cup morning anchor on weekends is usually enough to stop the drift.",
      "Demo content. Individual needs vary.",
    ],
  },
  {
    slug: "meal-planning-protein",
    title: "Plan lunch, protect protein",
    excerpt: "Users who plan lunch ahead typically hit protein targets more often. Here is a simple weekly method.",
    category: "Meal planning",
    readMinutes: 7,
    date: "2026-07-19",
    demo: true,
    body: [
      "Dinner improvisation is fine. Lunch improvisation is expensive. The middle of the day is where protein targets are won or lost.",
      "Choose three rotating lunches for the week. Keep them within a 80 kcal band so Nutrician Autopilot™ can still recommend snacks without guesswork.",
      "Demo article for product education.",
    ],
  },
  {
    slug: "fiber-quietly-matters",
    title: "Fiber is the quiet score killer",
    excerpt: "Calories can look on-target while Nutrition Score drops because fiber never caught up.",
    category: "Healthy eating",
    readMinutes: 5,
    date: "2026-07-08",
    demo: true,
    body: [
      "A day can look balanced on calories and still score poorly. Fiber, produce and sodium explain most of those surprises.",
      "If fiber is behind by dinner, a lentil bowl or a large vegetable side usually closes more of the gap than another protein shake.",
      "Educational demo content — not medical advice.",
    ],
  },
  {
    slug: "what-if-before-you-order",
    title: "Use What-If Nutrition™ before you order",
    excerpt: "Simulating a pizza or a bowl takes ten seconds and prevents a 400 kcal surprise.",
    category: "Nutrition education",
    readMinutes: 4,
    date: "2026-06-30",
    demo: true,
    body: [
      "The most expensive nutrition decisions happen off-app, standing in a restaurant queue.",
      "What-If Nutrition™ lets you see the after-state: calories, protein, and whether the meal still fits. If it overshoots, Nutrician suggests a lighter alternative with a similar flavor profile.",
      "Demo walkthrough of a Nutrician feature.",
    ],
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is Nutrician?",
    a: "Nutrician is an AI-powered nutrition platform that turns food, hydration and goal data into a next action. Traditional apps tell you what happened. Nutrician tells you what to do next.",
  },
  {
    q: "How does Nutrician Intelligence™ work?",
    a: "It analyzes meals, macros, micros, water, timing, goals and recent patterns. Then it explains the gap in plain language and recommends meals or adjustments that fit remaining targets.",
  },
  {
    q: "Is AI food recognition accurate?",
    a: "Photo estimates can miss ingredients, oils and portion size. Nutrician always labels AI results as estimates and lets you correct them before saving. In this demo, recognition uses a mock service layer that can later connect to a production vision API.",
  },
  {
    q: "Can I edit nutrition data?",
    a: "Yes. Every logged meal, serving size, custom food and water entry can be edited. AI suggestions never overwrite your log without confirmation.",
  },
  {
    q: "Is Nutrician a medical tool?",
    a: "No. Nutrician is a wellness and education product. It is not a medical device, diagnosis, or substitute for advice from a qualified clinician or registered dietitian.",
  },
  {
    q: "How does privacy work?",
    a: "This demo stores data locally in your browser. You can export or delete it from Settings. A production deployment should use encrypted transport (HTTPS), secure authentication, and a least-privilege database. Never put API keys in client code.",
  },
  {
    q: "What is included in Premium?",
    a: "Premium unlocks Nutrician Intelligence™, AI Coach, photo recognition, What-If Nutrition™, advanced analytics, personalized plans, weekly AI reviews and smart grocery planning. Free includes basic logging, dashboard, hydration and goals.",
  },
  {
    q: "What is Guest Mode?",
    a: "Guest Mode lets you try logging and the dashboard without creating an account. Data stays on this device. Create an account to keep a profile, onboarding preferences and history.",
  },
];
