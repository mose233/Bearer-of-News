import { PaymentRequest, PaymentResult } from "./PaymentTypes";
import { MpesaPayment } from "./MpesaPayment";
import { VisaPayment } from "./VisaPayment";

const PRICING = {
  "picture-ai": 0.05,
  "video-ai": 0.50,
  "music-ai": 0.20,
  "cinematic-ai": 1.50,
} as const;

const USD_TO_KES = 130;

export class PaymentManager {
  static async pay(request: PaymentRequest): Promise<PaymentResult> {
    const priceUSD = PRICING[request.tool];

    if (priceUSD === undefined) {
      return {
        success: false,
        message: `Unknown pricing for tool: ${request.tool}`,
      };
    }

    switch (request.paymentMethod) {
      case "mpesa": {
        if (!request.phoneNumber) {
          return {
            success: false,
            message: "Phone number is required for M-Pesa payments.",
          };
        }

        const amountKES = Math.max(1, Math.round(priceUSD * USD_TO_KES));

        return MpesaPayment.pay({
          phoneNumber: request.phoneNumber,
          amountKES,
          tool: request.tool,
          priceUSD,
        });
      }

      case "visa":
        return VisaPayment.pay({
          amountUSD: priceUSD,
          tool: request.tool,
        });

      default:
        return {
          success: false,
          message: "Unsupported payment method.",
        };
    }
  }
}
