import { PricingCategory } from "./types";

export const musicPricing: PricingCategory = {
  title: "Music AI",
  subtitle: "Songs & audio",

  items: [
    { label: "10 sec", price: 0.05 },
    { label: "20 sec", price: 0.10 },
    { label: "30 sec", price: 0.15 },
    { label: "40 sec", price: 0.20 },
    { label: "50 sec", price: 0.25 },
    { label: "60 sec", price: 0.30 },
    { label: "2 min", price: 0.60 },
    { label: "3 min", price: 0.90 },
    { label: "4 min", price: 1.20 },
    { label: "Full Song (5 min max)", price: 1.50 },
  ],
};
