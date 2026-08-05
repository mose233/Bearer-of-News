export interface PaymentRequest {
  tool: string;

  usdPrice: number;

  currency: string;

  amount: number;

  description: string;
}
