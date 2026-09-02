import { FOOD_BY_ID } from "@/lib/data/foods";
import { EMPTY_NUTRIENTS, scaleNutrients } from "@/lib/nutrition";
import type {
  Achievement,
  Food,
  Goal,
  Meal,
  MealItem,
  MealType,
  Nutrients,
  NutritionTargets,
  Profile,
  Reminder,
  Settings,
  UserAccount,
  WaterEntry,
} from "@/lib/types";
import { addDays, formatDateISO, hashString, uid } from "@/lib/utils";

export const DEMO_EMAIL = "alex@nutrician.app";
export const DEMO_PASSWORD = "demo1234";

export const ALEX_TARGETS: NutritionTargets = {
  calories: 2200,
  protein: 120,
  carbs: 300,
  fat: 80,
  fiber: 30,
  sugar: 40,
  sodium: 2300,
  waterCups: 8,
  micros: {
    vitaminA: 100,
    vitaminB: 100,
    vitaminC: 100,
    vitaminD: 100,
    vitaminE: 100,
    vitaminK: 100,
    iron: 100,
    calcium: 100,
    magnesium: 100,
    zinc: 100,
    potassium: 100,
  },
};

export const ALEX_PROFILE: Profile = {
  name: "Alex",
  email: DEMO_EMAIL,
  avatarHue: 152,
  age: 29,
  heightCm: 170,
  weightKg: 68,
  sex: "other",
  activityLevel: "moderate",
  mainGoal: "increase-protein",
  dietPreference: "high-protein",
  allergies: ["Peanuts"],
  foodsToAvoid: ["Energy drinks"],
  mealSchedule: { breakfast: "08:00", lunch: "12:30", dinner: "19:00" },
  units: "metric",
  onboardingComplete: true,
};

export const DEFAULT_SETTINGS: Settings = {
  language: "en",
  theme: "dark",
  notifications: { meals: true, water: true, goals: true, weeklyReport: true },
  privacy: { aiEnabled: true, shareAnonymousInsights: false },
};

export const DEFAULT_REMINDERS: Reminder[] = [
  { id: "r-breakfast", kind: "meal", title: "Breakfast window", enabled: true, time: "08:15", days: [1, 2, 3, 4, 5], context: "A short high-protein breakfast protects the rest of the day." },
  { id: "r-water", kind: "water", title: "Midday hydration", enabled: true, time: "14:00", days: [0, 1, 2, 3, 4, 5, 6], context: "If you are under 4 cups by now, add two before late afternoon." },
  { id: "r-log", kind: "logging", title: "Log dinner while it’s fresh", enabled: true, time: "20:30", days: [0, 1, 2, 3, 4, 5, 6], context: "Logging within an hour keeps Nutrition Score honest." },
  { id: "r-goals", kind: "goals", title: "Protein check", enabled: true, time: "16:00", days: [1, 2, 3, 4, 5], context: "Afternoon is the last easy window to close a protein gap." },
  { id: "r-plan", kind: "planning", title: "Plan tomorrow’s lunch", enabled: true, time: "21:00", days: [0, 2, 4], context: "Planned lunches correlate with stronger protein days." },
  { id: "r-week", kind: "weekly-review", title: "Weekly review", enabled: true, time: "18:00", days: [0], context: "A 3-minute review beats starting Monday from zero." },
];

export const GOAL_SEED: Goal[] = [
  { id: "g-protein", title: "120g protein daily", metric: "protein", target: 120, unit: "g", createdAt: "2026-07-01", active: true },
  { id: "g-water", title: "8 cups of water", metric: "water", target: 8, unit: "cups", createdAt: "2026-07-01", active: true },
  { id: "g-veg", title: "Vegetables 5 days/week", metric: "vegetables", target: 5, unit: "days", createdAt: "2026-07-10", active: true },
  { id: "g-cal", title: "Stay near calorie target", metric: "calories", target: 2200, unit: "kcal", deadline: addDays(formatDateISO(), 30), createdAt: "2026-08-01", active: true },
];

export const ACHIEVEMENT_CATALOG: Achievement[] = [
  { id: "streak-7", title: "7-Day Nutrition Streak", description: "Logged meals 7 days in a row.", icon: "7" },
  { id: "meals-30", title: "30 Meals Logged", description: "Built a real history, not a guess.", icon: "30" },
  { id: "hydro-10", title: "10 Hydration Goals", description: "Hit the water target 10 times.", icon: "H2O" },
  { id: "healthy-week", title: "Healthy Week", description: "Average Nutrition Score of 80+ for 7 days.", icon: "80" },
  { id: "protein-streak", title: "Protein Consistency", description: "Hit protein 5 days in a week.", icon: "P" },
  { id: "first-log", title: "First Log", description: "Logged the first meal.", icon: "1" },
];

function itemFromFood(food: Food, servings = 1): MealItem {
  return {
    id: uid("item"),
    foodId: food.id,
    foodName: food.name,
    servings,
    servingSize: food.servingSize,
    nutrients: scaleNutrients(food.nutrients, servings),
  };
}

function meal(date: string, type: MealType, time: string, foodId: string, servings = 1, source: Meal["source"] = "template"): Meal | null {
  const food = FOOD_BY_ID[foodId];
  if (!food) return null;
  return {
    id: uid("meal"),
    date,
    type,
    name: food.name,
    items: [itemFromFood(food, servings)],
    time,
    source,
  };
}

function seeded(seed: number) {
  let x = seed % 2147483646;
  if (x <= 0) x += 2147483646;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}

export function createTodayMeals(today: string): Meal[] {
  return [
    meal(today, "breakfast", "08:10", "oatmeal-berries"),
    meal(today, "lunch", "12:40", "grilled-chicken-salad"),
    meal(today, "snack", "16:05", "protein-smoothie"),
    meal(today, "dinner", "19:20", "quinoa-bowl"),
  ].filter(Boolean) as Meal[];
}

export function createTodayWater(today: string): WaterEntry[] {
  return [
    { id: uid("water"), date: today, cups: 2, time: "08:20" },
    { id: uid("water"), date: today, cups: 2, time: "11:15" },
    { id: uid("water"), date: today, cups: 1, time: "14:40" },
    { id: uid("water"), date: today, cups: 1, time: "17:10" },
  ];
}

export function createHistory(today: string, days = 28): { meals: Meal[]; water: WaterEntry[] } {
  const rand = seeded(hashString("alex-demo-v2"));
  const meals: Meal[] = [];
  const water: WaterEntry[] = [];

  const breakfasts = ["oatmeal-berries", "greek-yogurt", "egg-whites", "masala-oats", "oats"];
  const lunches = ["grilled-chicken-salad", "chicken-rice-bowl", "paneer-bowl", "chana-masala", "tuna"];
  const dinners = ["salmon", "palak-paneer", "tofu-stirfry", "chicken-tikka", "lentil-bowl"];
  const snacks = ["protein-smoothie", "greek-yogurt", "edamame", "apple", "almonds"];

  for (let i = 1; i <= days; i += 1) {
    const date = addDays(today, -i);
    const weekday = new Date(`${date}T12:00:00`).getDay();
    const skipBreakfast = weekday >= 1 && weekday <= 5 && rand() < 0.38;
    const lateFriday = weekday === 5;

    if (!skipBreakfast) {
      const built = meal(date, "breakfast", weekday === 0 ? "09:20" : "07:50", breakfasts[Math.floor(rand() * breakfasts.length)] ?? "oatmeal-berries");
      if (built) meals.push(built);
    }

    const plannedLunch = rand() > 0.35;
    const lunchId = plannedLunch
      ? (["grilled-chicken-salad", "chicken-rice-bowl", "paneer-bowl"][Math.floor(rand() * 3)] ?? "grilled-chicken-salad")
      : (lunches[Math.floor(rand() * lunches.length)] ?? "tuna");
    const lunch = meal(date, "lunch", plannedLunch ? "12:25" : "13:40", lunchId);
    if (lunch) {
      lunch.notes = plannedLunch ? "planned" : "improvised";
      meals.push(lunch);
    }

    if (rand() > 0.25) {
      const snack = meal(date, "snack", "16:10", snacks[Math.floor(rand() * snacks.length)] ?? "apple");
      if (snack) meals.push(snack);
    }

    const dinner = meal(date, "dinner", lateFriday ? "21:10" : "19:05", dinners[Math.floor(rand() * dinners.length)] ?? "salmon");
    if (dinner) meals.push(dinner);

    const weekend = weekday === 0 || weekday === 6;
    const cups = weekend ? 4 + Math.floor(rand() * 2) : 6 + Math.floor(rand() * 3);
    let remaining = cups;
    let hour = 8;
    while (remaining > 0) {
      const sip = Math.min(2, remaining);
      water.push({ id: uid("water"), date, cups: sip, time: `${String(hour).padStart(2, "0")}:15` });
      remaining -= sip;
      hour += weekend ? 4 : 2;
    }
  }

  return { meals, water };
}

export function createAlexAccount(): UserAccount {
  return {
    id: "user_alex",
    email: DEMO_EMAIL,
    name: "Alex",
    password: DEMO_PASSWORD,
    createdAt: "2026-06-02",
    isGuest: false,
    plan: "premium",
  };
}

export function emptyWorkspaceProfile(name: string, email: string): Profile {
  return {
    name,
    email,
    avatarHue: 160,
    age: 30,
    heightCm: 170,
    weightKg: 68,
    sex: "other",
    activityLevel: "moderate",
    mainGoal: "healthy-eating",
    dietPreference: "none",
    allergies: [],
    foodsToAvoid: [],
    mealSchedule: { breakfast: "08:00", lunch: "12:30", dinner: "19:00" },
    units: "metric",
    onboardingComplete: false,
  };
}

export function emptyNutrients(): Nutrients {
  return { ...EMPTY_NUTRIENTS };
}

