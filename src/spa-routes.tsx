import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "@/app/not-found";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import FeaturesPage from "@/app/features/page";
import HowItWorksPage from "@/app/how-it-works/page";
import AiCoachPage from "@/app/ai-coach/page";
import PricingPage from "@/app/pricing/page";
import BlogPage from "@/app/blog/page";
import BlogPostPage from "@/app/blog/[slug]/page";
import FaqPage from "@/app/faq/page";
import ContactPage from "@/app/contact/page";
import TermsPage from "@/app/terms/page";
import PrivacyPage from "@/app/privacy/page";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import OnboardingPage from "@/app/onboarding/page";
import ForgotPasswordPage from "@/app/forgot-password/page";
import ResetPasswordPage from "@/app/reset-password/page";
import DashboardPage from "@/app/app/dashboard/page";
import TrackPage from "@/app/app/track/page";
import InsightsPage from "@/app/app/insights/page";
import PlanPage from "@/app/app/plan/page";
import PlannerPage from "@/app/app/planner/page";
import ProgressPage from "@/app/app/progress/page";
import HistoryPage from "@/app/app/history/page";
import SearchPage from "@/app/app/search/page";
import GoalsPage from "@/app/app/goals/page";
import WaterPage from "@/app/app/water/page";
import MealsPage from "@/app/app/meals/page";
import NutritionPage from "@/app/app/nutrition/page";
import SettingsPage from "@/app/app/settings/page";
import RecipesPage from "@/app/app/recipes/page";
import RecipeDetailPage from "@/app/app/recipes/[id]/page";
import GroceryPage from "@/app/app/grocery/page";
import AchievementsPage from "@/app/app/achievements/page";
import RemindersPage from "@/app/app/reminders/page";
import ReportsPage from "@/app/app/reports/page";
import AnalyticsPage from "@/app/app/analytics/page";
import CoachPage from "@/app/app/coach/page";
import WhatIfPage from "@/app/app/what-if/page";
import ProfilePage from "@/app/app/profile/page";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/ai-coach" element={<AiCoachPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/app/dashboard" element={<DashboardPage />} />
      <Route path="/app/track" element={<TrackPage />} />
      <Route path="/app/insights" element={<InsightsPage />} />
      <Route path="/app/plan" element={<PlanPage />} />
      <Route path="/app/planner" element={<PlannerPage />} />
      <Route path="/app/progress" element={<ProgressPage />} />
      <Route path="/app/history" element={<HistoryPage />} />
      <Route path="/app/search" element={<SearchPage />} />
      <Route path="/app/goals" element={<GoalsPage />} />
      <Route path="/app/water" element={<WaterPage />} />
      <Route path="/app/meals" element={<MealsPage />} />
      <Route path="/app/nutrition" element={<NutritionPage />} />
      <Route path="/app/settings" element={<SettingsPage />} />
      <Route path="/app/recipes" element={<RecipesPage />} />
      <Route path="/app/recipes/:id" element={<RecipeDetailPage />} />
      <Route path="/app/grocery" element={<GroceryPage />} />
      <Route path="/app/achievements" element={<AchievementsPage />} />
      <Route path="/app/reminders" element={<RemindersPage />} />
      <Route path="/app/reports" element={<ReportsPage />} />
      <Route path="/app/analytics" element={<AnalyticsPage />} />
      <Route path="/app/coach" element={<CoachPage />} />
      <Route path="/app/what-if" element={<WhatIfPage />} />
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
