# Nutrician

**Your Nutrition on Autopilot.** Track. Understand. Act.

Traditional nutrition apps tell you what happened. Nutrician tells you what to do next.

This is a production-quality **browser website**: dark health-tech UI, a single client store, mock AI, and connected logging. Data lives in the browser. There is no payment processor and no server-side model.

Live site: [https://nutrician.online](https://nutrician.online)

## Stack

- Static React website (Vite) + TypeScript + Tailwind CSS
- Zustand with persist (`nutrician-store`)
- Recharts
- Mock `nutritionAIService` and photo recognition

## Run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). That is the Nutrician homepage (`src/app/page.tsx`).

If this folder is on iCloud Desktop, `npm run dev` copies the app to a local cache, builds it, then serves it. Leave the Terminal window open. First start can take about 15 seconds.

macOS: double-click **start.command**. Chrome opens when the server is ready. Leave the Terminal window open. Press Ctrl+C to stop.

```bash
npm run build
npm start
```

## Demo login

- Email: `alex@nutrician.app`
- Password: `demo1234`

Guest mode works without an account. Google/Apple buttons simulate SSO.

## What is connected

Logging a meal updates calories, macros, Nutrition Score, remaining targets, meal history, analytics, progress, coach context and recommendations. Changing a goal or plan rebuilds grocery items from the week plan.

## Privacy and medical limits

- Local-only storage; export and delete from Settings
- AI estimates are not diagnoses
- Demo testimonials/stats on marketing pages are labeled as demo

## Environment

No API keys are required. If you later attach a real model, keep secrets in environment variables — never in client code.
