import { FOOD_BY_ID } from "@/lib/data/foods";
import { RECIPE_BY_ID, recipeNutrients } from "@/lib/data/recipes";
import {
  ACHIEVEMENT_CATALOG,
  ALEX_PROFILE,
  ALEX_TARGETS,
  DEFAULT_REMINDERS,
  DEFAULT_SETTINGS,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  GOAL_SEED,
  createAlexAccount,
  createHistory,
  createTodayMeals,
  createTodayWater,
  emptyWorkspaceProfile,
} from "@/lib/data/demo";
import { EMPTY_NUTRIENTS, computeTargets, scaleNutrients } from "@/lib/nutrition";
import { dayNutrition, loggingStreak } from "@/lib/selectors";
import { nutritionAIService } from "@/lib/services/nutritionAI";
import type {
  Achievement,
  ChatMessage,
  Food,
  Goal,
  GroceryItem,
  Meal,
  MealItem,
  MealPlanEntry,
  MealType,
  NutritionTargets,
  Profile,
  Reminder,
  Session,
  Settings,
  UserAccount,
  WaterEntry,
} from "@/lib/types";
import { formatDateISO, uid } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToastItem {
  id: string;
  title: string;
  body?: string;
  tone: "success" | "error" | "info";
}

interface NutricianState {
  hydrated: boolean;
  accounts: UserAccount[];
  session: Session | null;
  profile: Profile;
  targets: NutritionTargets;
  settings: Settings;
  meals: Meal[];
  water: WaterEntry[];
  customFoods: Food[];
  recentFoodIds: string[];
  savedFoodIds: string[];
  goals: Goal[];
  plan: MealPlanEntry[];
  groceries: GroceryItem[];
  chat: ChatMessage[];
  reminders: Reminder[];
  achievements: Achievement[];
  selectedDate: string;
  logOpen: boolean;
  toasts: ToastItem[];
  resetToken: string | null;
  resetEmail: string | null;
  lastDeletedMeal: Meal | null;
  setHydrated: () => void;
  toast: (title: string, body?: string, tone?: ToastItem["tone"]) => void;
  dismissToast: (id: string) => void;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  loginDemo: () => void;
  loginGuest: () => void;
  logout: () => void;
  requestReset: (email: string) => string | null;
  resetPassword: (token: string, password: string) => boolean;
  completeOnboarding: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setSelectedDate: (date: string) => void;
  setLogOpen: (open: boolean) => void;
  logMeal: (meal: Omit<Meal, "id">) => void;
  updateMeal: (id: string, patch: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  addWater: (cups: number, date?: string) => void;
  addCustomFood: (food: Omit<Food, "id" | "isCustom">) => Food;
  toggleSavedFood: (foodId: string) => void;
  addToPlan: (entry: Omit<MealPlanEntry, "id">) => void;
  removeFromPlan: (id: string) => void;
  swapPlanMeal: (id: string, recipeId: string) => void;
  generateWeekPlan: () => void;
  rebuildGroceries: () => void;
  toggleGrocery: (id: string) => void;
  addGrocery: (item: Omit<GroceryItem, "id" | "fromPlan">) => void;
  removeGrocery: (id: string) => void;
  sendChat: (content: string) => void;
  applyCoachAction: (messageId: string, actionId: string) => void;
  toggleGoal: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "active">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  deleteWater: (id: string) => void;
  undoDeleteMeal: () => void;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, patch: Partial<Reminder>) => void;
  unlockAchievements: () => void;
  exportCsv: () => string;
  exportJson: () => string;
  deleteAccount: () => void;
  upgradeToPremium: () => void;
}

const today = () => formatDateISO();

function blankWorkspace() {
  return {
    profile: emptyWorkspaceProfile("Guest", ""),
    targets: ALEX_TARGETS,
    settings: DEFAULT_SETTINGS,
    meals: [] as Meal[],
    water: [] as WaterEntry[],
    customFoods: [] as Food[],
    recentFoodIds: [] as string[],
    savedFoodIds: [] as string[],
    goals: [] as Goal[],
    plan: [] as MealPlanEntry[],
    groceries: [] as GroceryItem[],
    chat: [] as ChatMessage[],
    reminders: DEFAULT_REMINDERS.map((item) => ({ ...item, enabled: false })),
    achievements: ACHIEVEMENT_CATALOG.map((item) => ({ ...item })),
    selectedDate: today(),
  };
}

function alexWorkspace() {
  const date = today();
  const history = createHistory(date);
  return {
    profile: { ...ALEX_PROFILE },
    targets: { ...ALEX_TARGETS },
    settings: { ...DEFAULT_SETTINGS },
    meals: [...createTodayMeals(date), ...history.meals],
    water: [...createTodayWater(date), ...history.water],
    customFoods: [] as Food[],
    recentFoodIds: ["oatmeal-berries", "grilled-chicken-salad", "protein-smoothie"],
    savedFoodIds: ["grilled-chicken-salad", "protein-smoothie"],
    goals: GOAL_SEED.map((item) => ({ ...item })),
    plan: [] as MealPlanEntry[],
    groceries: [] as GroceryItem[],
    chat: [
      {
        id: uid("msg"),
        role: "assistant" as const,
        content: "I'm your Nutrician Coach. Ask what to eat next, why your score moved, or how to close a protein gap. This is coaching, not medical advice.",
        createdAt: new Date().toISOString(),
      },
    ],
    reminders: DEFAULT_REMINDERS.map((item) => ({ ...item })),
    achievements: ACHIEVEMENT_CATALOG.map((item) => ({ ...item })),
    selectedDate: date,
  };
}

function ctx(state: Pick<NutricianState, "profile" | "targets" | "meals" | "water" | "selectedDate" | "session">) {
  return {
    profile: state.profile,
    targets: state.targets,
    meals: state.meals,
    water: state.water,
    date: state.selectedDate,
    plan: state.session?.plan === "premium" ? ("premium" as const) : ("free" as const),
  };
}

export const useNutrician = create<NutricianState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      accounts: [createAlexAccount()],
      session: null,
      ...blankWorkspace(),
      logOpen: false,
      toasts: [],
      resetToken: null,
      resetEmail: null,
      lastDeletedMeal: null,

      setHydrated: () => {
        set({ hydrated: true });
        get().unlockAchievements();
      },
      toast: (title, body, tone = "info") => {
        const item: ToastItem = { id: uid("toast"), title, body, tone };
        set((state) => ({ toasts: [...state.toasts, item] }));
        setTimeout(() => get().dismissToast(item.id), 4200);
      },
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),

      login: (email, password) => {
        if (!email.trim() || !password) {
          get().toast("Sign-in failed", "Email and password are required.", "error");
          return false;
        }
        const account = get().accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
        if (!account) {
          get().toast("Sign-in failed", "Check the email and password, or use the demo account.", "error");
          return false;
        }
        const demo = account.email === DEMO_EMAIL;
        set({
          session: { userId: account.id, email: account.email, name: account.name, isGuest: account.isGuest, plan: account.plan },
          ...(demo ? alexWorkspace() : {}),
        });
        get().toast("Welcome back", demo ? "Demo workspace loaded for Alex." : `Signed in as ${account.name}.`, "success");
        get().unlockAchievements();
        return true;
      },
      signup: (name, email, password) => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedName || !trimmedEmail || !password) {
          get().toast("Missing details", "Name, email and password are required.", "error");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          get().toast("Invalid email", "Enter a valid email address.", "error");
          return false;
        }
        if (password.length < 8) {
          get().toast("Weak password", "Use at least 8 characters.", "error");
          return false;
        }
        if (get().accounts.some((item) => item.email.toLowerCase() === trimmedEmail)) {
          get().toast("Account exists", "Try signing in instead.", "error");
          return false;
        }
        const account: UserAccount = {
          id: uid("user"),
          email: trimmedEmail,
          name: trimmedName,
          password,
          createdAt: today(),
          isGuest: false,
          plan: "free",
        };
        const profile = emptyWorkspaceProfile(account.name, account.email);
        set((state) => ({
          accounts: [...state.accounts, account],
          session: { userId: account.id, email: account.email, name: account.name, isGuest: false, plan: "free" },
          profile,
          targets: computeTargets(profile),
          meals: [],
          water: [],
          goals: [],
          plan: [],
          groceries: [],
          chat: [],
          selectedDate: today(),
        }));
        get().toast("Account created", "Complete onboarding so Nutrician can personalize targets.", "success");
        return true;
      },
      loginDemo: () => {
        get().login(DEMO_EMAIL, DEMO_PASSWORD);
      },
      loginGuest: () => {
        const profile = emptyWorkspaceProfile("Guest", "guest@local");
        set({
          session: { userId: "guest", email: "guest@local", name: "Guest", isGuest: true, plan: "free" },
          profile,
          targets: computeTargets(profile),
          meals: [],
          water: [],
          goals: [],
          chat: [],
          selectedDate: today(),
        });
        get().toast("Guest mode", "You can log meals on this device. Create an account to keep a profile.", "info");
      },
      logout: () => {
        set({ session: null, logOpen: false });
        get().toast("Signed out");
      },
      requestReset: (email) => {
        const exists = get().accounts.some((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        if (!exists) {
          get().toast("Email not found", "Use the demo account or create a new one.", "error");
          return null;
        }
        const token = uid("reset");
        set({ resetToken: token, resetEmail: email.trim().toLowerCase() });
        get().toast("Reset link ready", "This demo generates a local reset token. No email is sent.", "success");
        return token;
      },
      resetPassword: (token, password) => {
        if (!token || token !== get().resetToken || !get().resetEmail) {
          get().toast("Reset failed", "The reset token is invalid or expired.", "error");
          return false;
        }
        if (password.length < 8) {
          get().toast("Weak password", "Use at least 8 characters.", "error");
          return false;
        }
        const email = get().resetEmail;
        set((state) => ({
          resetToken: null,
          resetEmail: null,
          accounts: state.accounts.map((item) => (item.email === email ? { ...item, password } : item)),
        }));
        get().toast("Password updated", "You can sign in with the new password.", "success");
        return true;
      },
      completeOnboarding: (profile) => {
        const next = { ...profile, onboardingComplete: true };
        set({ profile: next, targets: computeTargets(next) });
        get().toast("Targets ready", "Nutrician Intelligence will now use your preferences.", "success");
      },
      updateProfile: (patch) => {
        const profile = { ...get().profile, ...patch };
        set({ profile, targets: computeTargets(profile) });
        get().toast("Profile updated", "Recommendations will adapt.", "success");
      },
      updateSettings: (patch) => {
        const current = get().settings;
        set({
          settings: {
            ...current,
            ...patch,
            notifications: { ...current.notifications, ...patch.notifications },
            privacy: { ...current.privacy, ...patch.privacy },
          },
        });
      },
      setSelectedDate: (date) => set({ selectedDate: date }),
      setLogOpen: (open) => set({ logOpen: open }),
      logMeal: (meal) => {
        const next: Meal = { ...meal, id: uid("meal") };
        set((state) => ({
          meals: [...state.meals, next],
          recentFoodIds: [...new Set([next.items[0]?.foodId ?? "", ...state.recentFoodIds])].filter(Boolean).slice(0, 12),
        }));
        get().toast("Meal logged", `${next.name} is now part of today's totals.`, "success");
        get().unlockAchievements();
      },
      updateMeal: (id, patch) => set((state) => ({ meals: state.meals.map((meal) => (meal.id === id ? { ...meal, ...patch } : meal)) })),
      deleteMeal: (id) => {
        const meal = get().meals.find((item) => item.id === id) ?? null;
        set((state) => ({ meals: state.meals.filter((item) => item.id !== id), lastDeletedMeal: meal }));
        get().toast("Meal removed", "Dashboard totals updated. Undo from History if that was a mistake.");
      },
      undoDeleteMeal: () => {
        const meal = get().lastDeletedMeal;
        if (!meal) {
          get().toast("Nothing to undo", undefined, "error");
          return;
        }
        set((state) => ({ meals: [...state.meals, meal], lastDeletedMeal: null }));
        get().toast("Meal restored", meal.name, "success");
      },
      addWater: (cups, date = get().selectedDate) => {
        set((state) => ({
          water: [...state.water, { id: uid("water"), date, cups, time: new Date().toTimeString().slice(0, 5) }],
        }));
        get().toast("Water added", `${cups} cup${cups === 1 ? "" : "s"} logged.`, "success");
        get().unlockAchievements();
      },
      deleteWater: (id) => {
        set((state) => ({ water: state.water.filter((entry) => entry.id !== id) }));
        get().toast("Water entry removed");
      },
      addCustomFood: (food) => {
        const next: Food = { ...food, id: uid("food"), isCustom: true };
        set((state) => ({ customFoods: [...state.customFoods, next] }));
        get().toast("Custom food saved", next.name, "success");
        return next;
      },
      toggleSavedFood: (foodId) => set((state) => ({
        savedFoodIds: state.savedFoodIds.includes(foodId)
          ? state.savedFoodIds.filter((id) => id !== foodId)
          : [...state.savedFoodIds, foodId],
      })),
      addToPlan: (entry) => {
        set((state) => ({ plan: [...state.plan, { ...entry, id: uid("plan") }] }));
        get().toast("Added to plan", entry.name, "success");
        get().rebuildGroceries();
      },
      removeFromPlan: (id) => {
        set((state) => ({ plan: state.plan.filter((item) => item.id !== id) }));
        get().rebuildGroceries();
      },
      swapPlanMeal: (id, recipeId) => {
        const recipe = RECIPE_BY_ID[recipeId];
        if (!recipe) return;
        set((state) => ({
          plan: state.plan.map((item) =>
            item.id === id ? { ...item, recipeId, name: recipe.name, nutrients: recipeNutrients(recipe) } : item,
          ),
        }));
        get().rebuildGroceries();
        get().toast("Meal swapped", recipe.name, "success");
      },
      generateWeekPlan: () => {
        const generated = nutritionAIService.generatePlan(ctx(get()));
        const entries: MealPlanEntry[] = generated.map((item) => {
          const recipe = RECIPE_BY_ID[item.recipeId];
          return {
            id: uid("plan"),
            date: item.date,
            type: item.type,
            recipeId: item.recipeId,
            name: item.name,
            nutrients: recipe ? recipeNutrients(recipe) : { ...EMPTY_NUTRIENTS },
          };
        });
        set((state) => ({
          plan: [
            ...state.plan.filter((item) => !generated.some((row) => row.date === item.date && row.type === item.type)),
            ...entries,
          ],
        }));
        get().rebuildGroceries();
        get().toast("Week planned", "Nutrician Autopilot filled breakfast, lunch and dinner.", "success");
      },
      rebuildGroceries: () => {
        const map = new Map<string, GroceryItem>();
        get().plan.forEach((entry) => {
          const recipe = entry.recipeId ? RECIPE_BY_ID[entry.recipeId] : undefined;
          recipe?.ingredients.forEach((ingredient) => {
            const key = ingredient.name.toLowerCase();
            const existing = map.get(key);
            if (existing) {
              existing.quantity = `${existing.quantity} + ${ingredient.quantity}`;
              return;
            }
            map.set(key, {
              id: uid("groc"),
              name: ingredient.name,
              quantity: ingredient.quantity,
              category: groceryCategory(ingredient.name),
              checked: false,
              fromPlan: true,
            });
          });
        });
        set({ groceries: [...map.values()] });
      },
      toggleGrocery: (id) => set((state) => ({
        groceries: state.groceries.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
      })),
      addGrocery: (item) => set((state) => ({ groceries: [...state.groceries, { ...item, id: uid("groc"), fromPlan: false }] })),
      removeGrocery: (id) => set((state) => ({ groceries: state.groceries.filter((item) => item.id !== id) })),
      sendChat: (content) => {
        const userMsg: ChatMessage = { id: uid("msg"), role: "user", content, createdAt: new Date().toISOString() };
        const reply = nutritionAIService.answerQuestion(ctx(get()), content);
        set((state) => ({ chat: [...state.chat, userMsg, reply] }));
      },
      applyCoachAction: (messageId, actionId) => {
        const message = get().chat.find((item) => item.id === messageId);
        const action = message?.actions?.find((item) => item.id === actionId);
        if (!action) return;
        if (action.kind === "add-to-plan" && action.payload?.recipeId) {
          const recipe = RECIPE_BY_ID[action.payload.recipeId];
          if (!recipe) return;
          get().addToPlan({
            date: get().selectedDate,
            type: recipe.mealTypes[0] ?? "lunch",
            recipeId: recipe.id,
            name: recipe.name,
            nutrients: recipeNutrients(recipe),
          });
        }
        if (action.kind === "add-water") get().addWater(2);
        if (action.kind === "log-meal" && action.payload?.recipeId) {
          const recipe = RECIPE_BY_ID[action.payload.recipeId];
          if (!recipe) return;
          get().logMeal({
            date: get().selectedDate,
            type: recipe.mealTypes[0] ?? "lunch",
            name: recipe.name,
            items: [
              {
                id: uid("item"),
                foodId: recipe.id,
                foodName: recipe.name,
                servings: 1,
                servingSize: "1 serving",
                nutrients: recipeNutrients(recipe),
              },
            ],
            time: new Date().toTimeString().slice(0, 5),
            source: "recipe",
          });
        }
      },
      toggleGoal: (id) => set((state) => ({
        goals: state.goals.map((goal) => (goal.id === id ? { ...goal, active: !goal.active } : goal)),
      })),
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: uid("goal"), createdAt: today(), active: true }],
      })),
      updateGoal: (id, patch) => set((state) => ({
        goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...patch } : goal)),
      })),
      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((goal) => goal.id !== id) }));
        get().toast("Goal deleted");
      },
      completeGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, active: false, completedAt: new Date().toISOString() } : goal,
          ),
        }));
        get().toast("Goal completed", undefined, "success");
      },
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
      })),
      updateReminder: (id, patch) => set((state) => ({
        reminders: state.reminders.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      })),
      unlockAchievements: () => {
        const state = get();
        const date = today();
        const day = dayNutrition(state.meals, state.water, state.targets, date);
        const streak = loggingStreak(state.meals, date);
        const mealCount = state.meals.length;
        const hydroHits = new Set(
          [...new Set(state.water.map((entry) => entry.date))].filter((entryDate) => {
            const cups = state.water.filter((item) => item.date === entryDate).reduce((sum, item) => sum + item.cups, 0);
            return cups >= state.targets.waterCups;
          }),
        ).size;
        const unlocked = new Set(state.achievements.filter((item) => item.unlockedAt).map((item) => item.id));
        const next = state.achievements.map((item) => {
          if (item.unlockedAt) return item;
          const now = new Date().toISOString();
          if (item.id === "first-log" && mealCount >= 1) return { ...item, unlockedAt: now };
          if (item.id === "meals-30" && mealCount >= 30) return { ...item, unlockedAt: now };
          if (item.id === "streak-7" && streak >= 7) return { ...item, unlockedAt: now };
          if (item.id === "hydro-10" && hydroHits >= 10) return { ...item, unlockedAt: now };
          if (item.id === "healthy-week" && day.score.total >= 80) return { ...item, unlockedAt: now };
          if (item.id === "protein-streak" && day.totals.protein >= state.targets.protein * 0.9) return { ...item, unlockedAt: now };
          return item;
        });
        const newly = next.filter((item) => item.unlockedAt && !unlocked.has(item.id));
        if (newly.length) {
          set({ achievements: next });
          newly.forEach((item) => get().toast("Achievement unlocked", item.title, "success"));
        }
      },
      exportCsv: () => {
        const rows = [["date", "type", "name", "calories", "protein", "carbs", "fat", "fiber"]];
        get().meals.forEach((meal) => {
          const n = meal.items.reduce(
            (acc, item) => ({
              calories: acc.calories + item.nutrients.calories,
              protein: acc.protein + item.nutrients.protein,
              carbs: acc.carbs + item.nutrients.carbs,
              fat: acc.fat + item.nutrients.fat,
              fiber: acc.fiber + item.nutrients.fiber,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          );
          rows.push([meal.date, meal.type, meal.name, String(n.calories), String(n.protein), String(n.carbs), String(n.fat), String(n.fiber)]);
        });
        return rows.map((row) => row.join(",")).join("\n");
      },
      exportJson: () =>
        JSON.stringify(
          {
            profile: get().profile,
            meals: get().meals,
            water: get().water,
            goals: get().goals,
            exportedAt: new Date().toISOString(),
            demo: true,
          },
          null,
          2,
        ),
      deleteAccount: () => {
        const session = get().session;
        set({
          accounts: get().accounts.filter((item) => item.id !== session?.userId),
          session: null,
          ...blankWorkspace(),
          hydrated: true,
        });
        get().toast("Account deleted", "Local Nutrician data for this profile was removed.");
      },
      upgradeToPremium: () => {
        set((state) => ({
          session: state.session ? { ...state.session, plan: "premium" } : null,
          accounts: state.accounts.map((item) =>
            item.id === state.session?.userId ? { ...item, plan: "premium" } : item,
          ),
        }));
        get().toast("Premium unlocked", "Demo upgrade — no payment was processed.", "success");
      },
    }),
    {
      name: "nutrician-store",
      partialize: (state) => {
        const { hydrated, toasts, logOpen, lastDeletedMeal, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function itemFromFood(food: Food, servings = 1): MealItem {
  return {
    id: uid("item"),
    foodId: food.id,
    foodName: food.name,
    servings,
    servingSize: food.servingSize,
    nutrients: scaleNutrients(food.nutrients, servings),
  };
}

export function catalogFoods(customFoods: Food[]): Food[] {
  return [...customFoods, ...Object.values(FOOD_BY_ID)];
}

export function mealTypeLabel(type: MealType) {
  return type === "snack" ? "Snack" : type[0].toUpperCase() + type.slice(1);
}

function groceryCategory(name: string): GroceryItem["category"] {
  const n = name.toLowerCase();
  if (/(chicken|salmon|tuna|tofu|paneer|egg|shrimp|tempeh|edamame)/.test(n)) return "protein";
  if (/(yogurt|milk|cheese|cottage)/.test(n)) return "dairy";
  if (/(rice|oat|quinoa|bread|roti|tortilla|pasta)/.test(n)) return "grains";
  if (/(oil|sauce|hummus|spice)/.test(n)) return "pantry";
  if (/(almond|bar|chocolate|popcorn)/.test(n)) return "snacks";
  return "produce";
}

