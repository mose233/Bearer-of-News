import { picturePricing } from "./picturePricing";
import { videoPricing } from "./videoPricing";
import { musicPricing } from "./musicPricing";
import { cinematicPricing } from "./cinematicPricing";

export type AITool =
  | "Picture AI"
  | "Video AI"
  | "Music AI"
  | "Cinematic AI";

const pricingMap = {
  "Picture AI": picturePricing,
  "Video AI": videoPricing,
  "Music AI": musicPricing,
  "Cinematic AI": cinematicPricing,
};

export function getPricing(tool: AITool) {
  return pricingMap[tool];
}

export function getUSDPrice(tool: AITool): number {
  const category = pricingMap[tool];

  if (!category.items.length) {
    throw new Error(`${tool} has no pricing configured.`);
  }

  return category.items[0].price;
}

export function getPricingLabel(tool: AITool): string {
  return pricingMap[tool].items[0].label;
}
