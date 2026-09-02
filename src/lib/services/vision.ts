import { FOODS } from "@/lib/data/foods";
import { wait } from "@/lib/utils";
import type { Food } from "@/lib/types";

export interface VisionEstimate {
  food: Food;
  confidence: number;
  servings: number;
}

export interface VisionResult {
  items: VisionEstimate[];
  note: string;
  estimated: true;
}

const PRESETS: { ids: string[]; confidence: number[] }[] = [
  { ids: ["grilled-chicken-salad", "avocado"], confidence: [0.86, 0.72] },
  { ids: ["oatmeal-berries"], confidence: [0.9] },
  { ids: ["protein-smoothie"], confidence: [0.84] },
  { ids: ["quinoa-bowl", "edamame"], confidence: [0.78, 0.61] },
  { ids: ["salmon", "broccoli"], confidence: [0.81, 0.74] },
  { ids: ["paneer-bowl"], confidence: [0.77] },
];

export async function recognizeMealPhoto(fileName: string): Promise<VisionResult> {
  await wait(900 + Math.round(Math.random() * 600));
  const index = Math.abs(fileName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % PRESETS.length;
  const preset = PRESETS[index] ?? PRESETS[0];
  const items = preset.ids
    .map((id, i) => {
      const food = FOODS.find((item) => item.id === id);
      if (!food) return null;
      return { food, confidence: preset.confidence[i] ?? 0.7, servings: 1 };
    })
    .filter(Boolean) as VisionEstimate[];

  return {
    items,
    estimated: true,
    note: "AI photo results are estimates. Oils, sauces and portion size are easy to miss. Review and correct before saving. This demo uses a mock recognition layer.",
  };
}
