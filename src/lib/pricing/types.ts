export interface PricingItem {
  label: string;
  price: number;
}

export interface PricingCategory {
  title: string;
  subtitle: string;
  items: PricingItem[];
}
