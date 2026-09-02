export type FoodCategory =
  | "fruits"
  | "vegetables"
  | "grains"
  | "dairy"
  | "meat"
  | "seafood"
  | "snacks"
  | "drinks"
  | "restaurant"
  | "packaged"
  | "indian"
  | "international";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "drinks";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

export type MainGoal =
  | "healthy-eating"
  | "fitness"
  | "muscle-gain"
  | "weight-management"
  | "increase-protein"
  | "improve-hydration"
  | "improve-consistency";

export type DietPreference =
  | "none"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "mediterranean"
  | "high-protein";

export type PlanTier = "free" | "premium";

export interface Micros {
  vitaminA: number;
  vitaminB: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  iron: number;
  calcium: number;
  magnesium: number;
  zinc: number;
  potassium: number;
}

export interface Nutrients extends Micros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  waterCups: number;
  micros: Micros;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: FoodCategory;
  servingSize: string;
  servingGrams: number;
  nutrients: Nutrients;
  barcode?: string;
  tags: string[];
  isCustom?: boolean;
}

export interface MealItem {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  servingSize: string;
  nutrients: Nutrients;
}

export interface Meal {
  id: string;
  date: string;
  type: MealType;
  name: string;
  items: MealItem[];
  time: string;
  source: "manual" | "ai-photo" | "barcode" | "template" | "recipe" | "plan" | "what-if";
  notes?: string;
}

export interface WaterEntry {
  id: string;
  date: string;
  cups: number;
  time: string;
}

export interface Profile {
  name: string;
  email: string;
  avatarHue: number;
  age: number;
  heightCm: number;
  weightKg: number;
  sex: "female" | "male" | "other";
  activityLevel: ActivityLevel;
  mainGoal: MainGoal;
  dietPreference: DietPreference;
  allergies: string[];
  foodsToAvoid: string[];
  mealSchedule: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  units: "metric" | "imperial";
  onboardingComplete: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  isGuest: boolean;
  plan: PlanTier;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  isGuest: boolean;
  plan: PlanTier;
}

export interface Goal {
  id: string;
  title: string;
  metric:
    | "protein"
    | "water"
    | "calories"
    | "fiber"
    | "vegetables"
    | "score"
    | "consistency";
  target: number;
  unit: string;
  deadline?: string;
  createdAt: string;
  active: boolean;
  completedAt?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mealTypes: MealType[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  prepMinutes: number;
  difficulty: "easy" | "medium" | "advanced";
  tags: string[];
  ingredients: { foodId?: string; name: string; quantity: string }[];
  steps: string[];
  hue: number;
  diet: DietPreference[];
}

export interface MealPlanEntry {
  id: string;
  date: string;
  type: MealType;
  recipeId?: string;
  foodId?: string;
  name: string;
  nutrients: Nutrients;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: "produce" | "protein" | "dairy" | "grains" | "pantry" | "snacks";
  checked: boolean;
  fromPlan: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  actions?: CoachAction[];
}

export interface CoachAction {
  id: string;
  label: string;
  kind: "log-meal" | "add-to-plan" | "view-recipe" | "open-what-if" | "add-water";
  payload?: Record<string, string>;
}

export interface Reminder {
  id: string;
  kind: "meal" | "water" | "logging" | "goals" | "planning" | "weekly-review";
  title: string;
  enabled: boolean;
  time: string;
  days: number[];
  context?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Settings {
  language: string;
  theme: "dark";
  notifications: {
    meals: boolean;
    water: boolean;
    goals: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    aiEnabled: boolean;
    shareAnonymousInsights: boolean;
  };
}

export interface ScoreBreakdown {
  total: number;
  label: "Needs work" | "Building" | "Good" | "Great" | "Excellent";
  factors: { label: string; delta: number; detail: string }[];
}

export interface DayNutrition {
  date: string;
  totals: Nutrients;
  waterCups: number;
  meals: Meal[];
  remaining: Nutrients & { waterCups: number };
  score: ScoreBreakdown;
  mealCount: number;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  recipeId?: string;
  foodId?: string;
  nutrients: Pick<Nutrients, "calories" | "protein" | "carbs" | "fat" | "fiber">;
}

export interface Insight {
  id: string;
  severity: "info" | "positive" | "attention";
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

export interface WhatIfResult {
  before: Nutrients & { waterCups: number; score: number };
  after: Nutrients & { waterCups: number; score: number };
  explanation: string;
  overCalories: number;
  alternatives: Recommendation[];
}

export interface WeeklyReview {
  averageScore: number;
  proteinChange: number;
  hydrationChange: number;
  goalCompletion: number;
  improved: string[];
  attention: string[];
  focus: string[];
  strongestDay: string;
  weakestDay: string;
}

export type AuthView = "login" | "signup" | "forgot" | "reset";


