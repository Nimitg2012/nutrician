import { nutrients } from "@/lib/nutrition";
import type { Food, FoodCategory, Nutrients } from "@/lib/types";

function food(
  id: string,
  name: string,
  category: FoodCategory,
  servingSize: string,
  servingGrams: number,
  n: Partial<Nutrients>,
  extra: Partial<Food> = {},
): Food {
  return {
    id,
    name,
    category,
    servingSize,
    servingGrams,
    nutrients: nutrients(n),
    tags: extra.tags ?? [],
    barcode: extra.barcode,
    brand: extra.brand,
    isCustom: extra.isCustom,
  };
}

export const FOODS: Food[] = [
  food("apple", "Apple", "fruits", "1 medium", 182, { calories: 95, carbs: 25, fiber: 4.4, sugar: 19, vitaminC: 14, potassium: 6 }, { tags: ["fresh", "snack"] }),
  food("banana", "Banana", "fruits", "1 medium", 118, { calories: 105, carbs: 27, fiber: 3.1, sugar: 14, protein: 1.3, vitaminB: 8, potassium: 12, vitaminC: 17 }, { tags: ["fresh", "snack"] }),
  food("blueberries", "Blueberries", "fruits", "1 cup", 148, { calories: 84, carbs: 21, fiber: 3.6, sugar: 15, vitaminC: 24, vitaminK: 36 }, { tags: ["fresh"] }),
  food("strawberries", "Strawberries", "fruits", "1 cup", 152, { calories: 49, carbs: 12, fiber: 3, sugar: 7, vitaminC: 149 }, { tags: ["fresh"] }),
  food("orange", "Orange", "fruits", "1 medium", 131, { calories: 62, carbs: 15, fiber: 3.1, sugar: 12, vitaminC: 116, potassium: 5 }, { tags: ["fresh"] }),
  food("avocado", "Avocado", "fruits", "1/2 fruit", 68, { calories: 114, fat: 10.5, carbs: 6, fiber: 5, potassium: 10, vitaminK: 18, vitaminE: 7 }, { tags: ["fresh", "healthy-fat"] }),
  food("mango", "Mango", "fruits", "1 cup", 165, { calories: 99, carbs: 25, fiber: 2.6, sugar: 23, vitaminC: 67, vitaminA: 20 }, { tags: ["fresh"] }),
  food("spinach", "Spinach", "vegetables", "2 cups raw", 60, { calories: 14, carbs: 2.2, fiber: 1.4, protein: 1.7, vitaminA: 56, vitaminK: 362, vitaminC: 14, iron: 9, magnesium: 12 }, { tags: ["leafy", "veg"] }),
  food("broccoli", "Broccoli", "vegetables", "1 cup cooked", 156, { calories: 55, protein: 3.7, carbs: 11, fiber: 5.1, vitaminC: 135, vitaminK: 116, vitaminA: 24 }, { tags: ["veg"] }),
  food("kale", "Kale", "vegetables", "1 cup", 67, { calories: 33, protein: 2.2, carbs: 6, fiber: 2.4, vitaminA: 98, vitaminK: 684, vitaminC: 89 }, { tags: ["leafy", "veg"] }),
  food("sweet-potato", "Sweet Potato", "vegetables", "1 medium", 130, { calories: 112, carbs: 26, fiber: 3.8, protein: 2, vitaminA: 438, potassium: 12 }, { tags: ["veg"] }),
  food("carrot", "Carrots", "vegetables", "1 cup", 128, { calories: 53, carbs: 12, fiber: 3.6, vitaminA: 428, vitaminK: 21 }, { tags: ["veg"] }),
  food("cucumber", "Cucumber", "vegetables", "1 cup", 104, { calories: 16, carbs: 3.8, fiber: 0.5, vitaminK: 17 }, { tags: ["veg"] }),
  food("tomato", "Tomato", "vegetables", "1 medium", 123, { calories: 22, carbs: 4.8, fiber: 1.5, vitaminC: 28, vitaminA: 20, potassium: 8 }, { tags: ["veg"] }),
  food("bell-pepper", "Bell Pepper", "vegetables", "1 medium", 119, { calories: 31, carbs: 6, fiber: 2.1, vitaminC: 169, vitaminA: 18 }, { tags: ["veg"] }),
  food("mixed-salad", "Mixed Salad Greens", "vegetables", "2 cups", 70, { calories: 18, protein: 1.5, carbs: 3.4, fiber: 1.8, vitaminA: 80, vitaminK: 140, vitaminC: 20 }, { tags: ["veg", "salad"] }),
  food("chickpeas", "Chickpeas", "vegetables", "1 cup cooked", 164, { calories: 269, protein: 14.5, carbs: 45, fiber: 12.5, fat: 4.2, iron: 26, magnesium: 20 }, { tags: ["veg", "protein", "fiber"] }),
  food("oats", "Rolled Oats", "grains", "1/2 cup dry", 40, { calories: 150, protein: 5, carbs: 27, fiber: 4, fat: 3, iron: 10, magnesium: 14, zinc: 8 }, { tags: ["breakfast", "fiber"] }),
  food("brown-rice", "Brown Rice", "grains", "1 cup cooked", 195, { calories: 216, protein: 5, carbs: 45, fiber: 3.5, magnesium: 21 }, { tags: ["grain"] }),
  food("quinoa", "Quinoa", "grains", "1 cup cooked", 185, { calories: 222, protein: 8.1, carbs: 39, fiber: 5.2, fat: 3.6, magnesium: 30, iron: 15, zinc: 13 }, { tags: ["grain", "protein"] }),
  food("whole-wheat-bread", "Whole Wheat Bread", "grains", "1 slice", 32, { calories: 81, protein: 4, carbs: 14, fiber: 1.9, sodium: 146 }, { tags: ["grain"] }),
  food("pasta", "Whole Wheat Pasta", "grains", "1 cup cooked", 140, { calories: 174, protein: 7.5, carbs: 37, fiber: 6.3 }, { tags: ["grain"] }),
  food("tortilla", "Whole Wheat Tortilla", "grains", "1 tortilla", 45, { calories: 130, protein: 4, carbs: 22, fiber: 3, fat: 3, sodium: 220 }, { tags: ["grain"] }),
  food("greek-yogurt", "Nonfat Greek Yogurt", "dairy", "1 cup", 170, { calories: 100, protein: 18, carbs: 6, sugar: 6, calcium: 20, vitaminB: 12 }, { tags: ["protein", "breakfast"], barcode: "036632027248" }),
  food("milk", "2% Milk", "dairy", "1 cup", 244, { calories: 122, protein: 8, carbs: 12, fat: 4.8, calcium: 30, vitaminD: 25 }, { tags: ["drink"] }),
  food("almond-milk", "Unsweetened Almond Milk", "dairy", "1 cup", 240, { calories: 30, protein: 1, carbs: 1, fat: 2.5, calcium: 45, vitaminD: 25 }, { tags: ["drink", "vegan"] }),
  food("cheddar", "Cheddar Cheese", "dairy", "1 oz", 28, { calories: 114, protein: 7, fat: 9.4, carbs: 0.4, calcium: 20, sodium: 174 }, { tags: ["dairy"] }),
  food("cottage-cheese", "Cottage Cheese", "dairy", "1 cup", 226, { calories: 163, protein: 28, carbs: 6, fat: 2.3, calcium: 14, sodium: 911 }, { tags: ["protein"] }),
  food("paneer", "Paneer", "dairy", "100g", 100, { calories: 265, protein: 18, fat: 20, carbs: 1.2, calcium: 48 }, { tags: ["indian", "protein"] }),
  food("chicken-breast", "Grilled Chicken Breast", "meat", "4 oz", 113, { calories: 187, protein: 35, fat: 4, sodium: 74, vitaminB: 40, zinc: 8 }, { tags: ["protein"] }),
  food("turkey", "Turkey Breast", "meat", "4 oz", 113, { calories: 135, protein: 30, fat: 1, sodium: 52, vitaminB: 18 }, { tags: ["protein"] }),
  food("lean-beef", "Lean Beef", "meat", "4 oz", 113, { calories: 210, protein: 26, fat: 11, iron: 15, zinc: 36, vitaminB: 45 }, { tags: ["protein"] }),
  food("eggs", "Eggs", "meat", "2 large", 100, { calories: 143, protein: 13, fat: 10, vitaminD: 11, vitaminB: 20 }, { tags: ["protein", "breakfast"] }),
  food("egg-whites", "Egg Whites", "meat", "1 cup", 243, { calories: 126, protein: 26, fat: 0.4 }, { tags: ["protein"] }),
  food("salmon", "Salmon", "seafood", "4 oz", 113, { calories: 233, protein: 25, fat: 14, vitaminD: 66, vitaminB: 50, potassium: 12 }, { tags: ["protein", "omega3"] }),
  food("tuna", "Canned Tuna", "seafood", "1 can drained", 113, { calories: 132, protein: 29, fat: 1, sodium: 320, vitaminD: 17 }, { tags: ["protein"], barcode: "080000515567" }),
  food("shrimp", "Shrimp", "seafood", "4 oz", 113, { calories: 120, protein: 23, fat: 1.7, vitaminB: 12, zinc: 10 }, { tags: ["protein"] }),
  food("cod", "Cod", "seafood", "4 oz", 113, { calories: 93, protein: 20, fat: 0.8, vitaminB: 10 }, { tags: ["protein"] }),
  food("almonds", "Almonds", "snacks", "1 oz", 28, { calories: 164, protein: 6, fat: 14, carbs: 6, fiber: 3.5, vitaminE: 48, magnesium: 19 }, { tags: ["snack", "healthy-fat"] }),
  food("protein-bar", "Protein Bar", "snacks", "1 bar", 60, { calories: 200, protein: 20, carbs: 22, fat: 7, fiber: 3, sugar: 6, sodium: 180 }, { tags: ["snack", "protein"], brand: "Nutrician Demo", barcode: "850012345678" }),
  food("hummus", "Hummus", "snacks", "4 tbsp", 60, { calories: 140, protein: 4, carbs: 12, fat: 8, fiber: 4 }, { tags: ["snack"] }),
  food("popcorn", "Air-popped Popcorn", "snacks", "3 cups", 24, { calories: 93, carbs: 19, fiber: 3.6, protein: 3 }, { tags: ["snack"] }),
  food("dark-chocolate", "Dark Chocolate 70%", "snacks", "1 oz", 28, { calories: 170, fat: 12, carbs: 13, fiber: 3, sugar: 7, magnesium: 16 }, { tags: ["snack"] }),
  food("rice-cakes", "Rice Cakes", "snacks", "2 cakes", 18, { calories: 70, carbs: 15, protein: 1.4 }, { tags: ["snack"] }),
  food("water", "Water", "drinks", "1 cup", 240, { calories: 0 }, { tags: ["hydration"] }),
  food("black-coffee", "Black Coffee", "drinks", "1 cup", 240, { calories: 2 }, { tags: ["drink"] }),
  food("green-tea", "Green Tea", "drinks", "1 cup", 240, { calories: 2 }, { tags: ["drink"] }),
  food("protein-powder", "Whey Protein Powder", "drinks", "1 scoop", 32, { calories: 120, protein: 24, carbs: 3, fat: 1.5, calcium: 10 }, { tags: ["protein"], barcode: "850098765432" }),
  food("orange-juice", "Orange Juice", "drinks", "1 cup", 248, { calories: 112, carbs: 26, sugar: 21, vitaminC: 124 }, { tags: ["drink"] }),
  food("sparkling-water", "Sparkling Water", "drinks", "1 can", 355, { calories: 0 }, { tags: ["drink"] }),
  food("chipotle-bowl", "Chipotle-style Chicken Bowl", "restaurant", "1 bowl", 540, { calories: 740, protein: 45, carbs: 72, fat: 28, fiber: 14, sodium: 1680 }, { tags: ["restaurant"] }),
  food("pizza-slice", "Cheese Pizza Slice", "restaurant", "1 slice", 107, { calories: 285, protein: 12, carbs: 36, fat: 10, sodium: 640 }, { tags: ["restaurant"] }),
  food("pizza-large", "Large Cheese Pizza", "restaurant", "1 pizza (8 slices)", 856, { calories: 2280, protein: 96, carbs: 288, fat: 80, sodium: 5120 }, { tags: ["restaurant", "what-if"] }),
  food("sushi-roll", "Salmon Avocado Roll", "restaurant", "8 pieces", 226, { calories: 350, protein: 14, carbs: 42, fat: 12, sodium: 720 }, { tags: ["restaurant"] }),
  food("thai-curry", "Thai Green Curry with Rice", "restaurant", "1 plate", 450, { calories: 620, protein: 22, carbs: 68, fat: 28, sodium: 980 }, { tags: ["restaurant"] }),
  food("granola", "Granola", "packaged", "1/2 cup", 50, { calories: 230, protein: 6, carbs: 32, fat: 9, fiber: 4, sugar: 12, sodium: 70 }, { tags: ["breakfast"], barcode: "016000275275" }),
  food("peanut-butter", "Peanut Butter", "packaged", "2 tbsp", 32, { calories: 188, protein: 8, fat: 16, carbs: 6, fiber: 2, sodium: 136 }, { tags: ["spread"], barcode: "037600105053" }),
  food("olive-oil", "Olive Oil", "packaged", "1 tbsp", 14, { calories: 119, fat: 13.5, vitaminE: 13 }, { tags: ["fat"] }),
  food("tomato-sauce", "Marinara Sauce", "packaged", "1/2 cup", 125, { calories: 70, carbs: 10, fiber: 2, sodium: 480, vitaminA: 12 }, { tags: ["sauce"] }),
  food("frozen-berries", "Frozen Mixed Berries", "packaged", "1 cup", 140, { calories: 70, carbs: 17, fiber: 5, sugar: 11, vitaminC: 30 }, { tags: ["frozen"] }),
  food("dal-tadka", "Dal Tadka", "indian", "1 cup", 240, { calories: 198, protein: 11, carbs: 28, fat: 5, fiber: 8, iron: 18 }, { tags: ["indian", "vegetarian"] }),
  food("chicken-tikka", "Chicken Tikka", "indian", "6 pieces", 180, { calories: 280, protein: 32, fat: 14, carbs: 6, sodium: 540 }, { tags: ["indian", "protein"] }),
  food("palak-paneer", "Palak Paneer", "indian", "1 cup", 240, { calories: 320, protein: 16, fat: 24, carbs: 12, fiber: 4, calcium: 30, vitaminA: 80 }, { tags: ["indian", "vegetarian"] }),
  food("roti", "Whole Wheat Roti", "indian", "1 roti", 40, { calories: 106, protein: 3.5, carbs: 18, fiber: 2.5, fat: 2.4 }, { tags: ["indian", "grain"] }),
  food("jeera-rice", "Jeera Rice", "indian", "1 cup", 175, { calories: 205, protein: 4, carbs: 38, fat: 4 }, { tags: ["indian"] }),
  food("masala-oats", "Masala Oats", "indian", "1 bowl", 200, { calories: 240, protein: 8, carbs: 36, fat: 6, fiber: 5 }, { tags: ["indian", "breakfast"] }),
  food("idli", "Idli (2 pieces)", "indian", "2 idli", 80, { calories: 78, protein: 2.4, carbs: 16, fat: 0.4 }, { tags: ["indian", "breakfast"] }),
  food("sambar", "Sambar", "indian", "1 cup", 240, { calories: 140, protein: 6, carbs: 20, fiber: 5, fat: 4 }, { tags: ["indian"] }),
  food("chana-masala", "Chana Masala", "indian", "1 cup", 240, { calories: 270, protein: 12, carbs: 38, fiber: 10, fat: 8 }, { tags: ["indian", "vegetarian"] }),
  food("falafel-bowl", "Falafel Bowl", "international", "1 bowl", 420, { calories: 510, protein: 18, carbs: 58, fat: 22, fiber: 12 }, { tags: ["mediterranean"] }),
  food("poke-bowl", "Tuna Poke Bowl", "international", "1 bowl", 450, { calories: 540, protein: 32, carbs: 62, fat: 16, fiber: 6, sodium: 890 }, { tags: ["hawaiian"] }),
  food("bibimbap", "Bibimbap", "international", "1 bowl", 500, { calories: 580, protein: 24, carbs: 78, fat: 16, fiber: 7 }, { tags: ["korean"] }),
  food("miso-soup", "Miso Soup", "international", "1 bowl", 240, { calories: 84, protein: 6, carbs: 8, fat: 3, sodium: 820 }, { tags: ["japanese"] }),
  food("edamame", "Edamame", "international", "1 cup", 155, { calories: 188, protein: 18, carbs: 14, fiber: 8, fat: 8, iron: 20 }, { tags: ["protein", "vegan"] }),
  food("tofu", "Firm Tofu", "international", "4 oz", 113, { calories: 94, protein: 10, fat: 6, carbs: 2, calcium: 16, iron: 12 }, { tags: ["vegan", "protein"] }),
  food("tempeh", "Tempeh", "international", "3 oz", 85, { calories: 162, protein: 17, fat: 9, carbs: 8, fiber: 6, iron: 12 }, { tags: ["vegan", "protein"] }),
  food("oatmeal-berries", "Oatmeal with Berries", "grains", "1 bowl", 320, { calories: 350, protein: 11, carbs: 58, fat: 7, fiber: 8, sugar: 14, sodium: 90, vitaminC: 25, iron: 12, magnesium: 18 }, { tags: ["breakfast", "template"] }),
  food("grilled-chicken-salad", "Grilled Chicken Salad", "meat", "1 bowl", 380, { calories: 480, protein: 38, carbs: 22, fat: 24, fiber: 6, sugar: 6, sodium: 520, vitaminA: 70, vitaminC: 40, vitaminK: 80, iron: 12 }, { tags: ["lunch", "template"] }),
  food("protein-smoothie", "Protein Smoothie", "drinks", "1 glass", 380, { calories: 250, protein: 28, carbs: 22, fat: 5, fiber: 3, sugar: 12, sodium: 140, calcium: 25, vitaminC: 30 }, { tags: ["snack", "template"] }),
  food("quinoa-bowl", "Quinoa Bowl", "grains", "1 bowl", 420, { calories: 740, protein: 15, carbs: 118, fat: 32, fiber: 5, sugar: 8, sodium: 410, magnesium: 28, iron: 20 }, { tags: ["dinner", "template"] }),
  food("chicken-rice-bowl", "Chicken Rice Bowl", "meat", "1 bowl", 450, { calories: 480, protein: 42, carbs: 48, fat: 12, fiber: 5, sodium: 430, vitaminB: 30 }, { tags: ["recommendation"] }),
  food("paneer-bowl", "Paneer Bowl", "indian", "1 bowl", 430, { calories: 510, protein: 35, carbs: 42, fat: 20, fiber: 7, calcium: 40 }, { tags: ["recommendation", "vegetarian"] }),
  food("yogurt-oats", "Greek Yogurt + Oats", "dairy", "1 bowl", 300, { calories: 450, protein: 31, carbs: 52, fat: 10, fiber: 8, sugar: 12, calcium: 25 }, { tags: ["recommendation", "vegetarian"] }),
  food("lentil-bowl", "Lentil & Veggie Bowl", "vegetables", "1 bowl", 420, { calories: 390, protein: 22, carbs: 58, fat: 8, fiber: 16, iron: 30 }, { tags: ["recommendation", "vegan", "fiber"] }),
  food("salmon-greens", "Salmon with Greens", "seafood", "1 plate", 380, { calories: 430, protein: 36, carbs: 18, fat: 24, fiber: 6, vitaminD: 60 }, { tags: ["recommendation"] }),
  food("tofu-stirfry", "Tofu Stir Fry", "international", "1 plate", 400, { calories: 370, protein: 24, carbs: 32, fat: 16, fiber: 8 }, { tags: ["recommendation", "vegan"] }),
];

export const FOOD_BY_ID = Object.fromEntries(FOODS.map((item) => [item.id, item])) as Record<string, Food>;

const FOOD_ALIASES: Record<string, string> = {
  "chicken-breast": "chicken-breast",
  "brown-rice": "brown-rice",
  "olive-oil": "olive-oil",
  "greek-yogurt": "greek-yogurt",
  "dal-tadka": "dal-tadka",
  "sweet-potato": "sweet-potato",
  "bell-pepper": "bell-pepper",
  "almond-milk": "almond-milk",
  "mixed-salad": "mixed-salad",
  "protein-powder": "protein-powder",
  "cottage-cheese": "cottage-cheese",
  "peanut-butter": "peanut-butter",
  "falafel-bowl": "falafel-bowl",
  "jeera-rice": "jeera-rice",
  "pizza-large": "pizza-large",
  "egg-whites": "egg-whites",
  "palak-paneer": "palak-paneer",
  "tofu-stir-fry": "tofu-stir-fry",
  "lentil-bowl": "lentil-bowl",
  "chicken-tikka": "chicken-tikka",
  "masala-oats": "masala-oats",
  "chana-masala": "chana-masala",
  "oatmeal-berries": "oatmeal-berries",
  "grilled-chicken-salad": "grilled-chicken-salad",
  "protein-smoothie": "protein-smoothie",
  "quinoa-bowl": "quinoa-bowl",
  "chicken-rice-bowl": "chicken-rice-bowl",
  "paneer-bowl": "paneer-bowl",
};
for (const [alias, source] of Object.entries(FOOD_ALIASES)) {
  if (FOOD_BY_ID[source] && !FOOD_BY_ID[alias]) FOOD_BY_ID[alias] = FOOD_BY_ID[source];
}

export const FOOD_CATEGORIES: { id: FoodCategory; label: string }[] = [
  { id: "fruits", label: "Fruits" },
  { id: "vegetables", label: "Vegetables" },
  { id: "grains", label: "Grains" },
  { id: "dairy", label: "Dairy" },
  { id: "meat", label: "Meat" },
  { id: "seafood", label: "Seafood" },
  { id: "snacks", label: "Snacks" },
  { id: "drinks", label: "Drinks" },
  { id: "restaurant", label: "Restaurant food" },
  { id: "packaged", label: "Packaged food" },
  { id: "indian", label: "Indian food" },
  { id: "international", label: "International food" },
];

export function searchFoods(query: string, catalog: Food[] = FOODS): Food[] {
  const q = query.trim().toLowerCase();
  if (!q) return catalog;
  return catalog.filter((foodItem) => {
    const hay = `${foodItem.name} ${foodItem.brand ?? ""} ${foodItem.tags.join(" ")} ${foodItem.barcode ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}

export function findByBarcode(code: string, catalog: Food[] = FOODS): Food | undefined {
  return catalog.find((foodItem) => foodItem.barcode === code.replace(/\s/g, ""));
}

