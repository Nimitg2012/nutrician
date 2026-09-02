import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nutrician — Your Nutrition on Autopilot",
    template: "%s · Nutrician",
  },
  description:
    "Track. Understand. Act. Nutrician turns food and health data into personalized next moves — not just a calorie log.",
  keywords: ["nutrition", "AI coach", "macros", "meal planning", "hydration"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
