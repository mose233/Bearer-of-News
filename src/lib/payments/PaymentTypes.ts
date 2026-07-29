export type PaymentMethod = "mpesa" | "visa";

export type AITool =
  | "picture-ai"
  | "video-ai"
  | "music-ai"
  | "cinematic-ai";

export interface PaymentRequest {
  tool: AITool;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}
