import { PaymentRequest, PaymentResult } from "./PaymentTypes";
import { PricingService } from "./PricingService";
import { CurrencyService } from "./CurrencyService";
import { MpesaPayment } from "./MpesaPayment";
import { VisaPayment } from "./VisaPayment";

export class PaymentManager {
  static async pay(request: PaymentRequest): Promise<PaymentResult> {
    const priceUSD = PricingService[request.tool];

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

        const amountKES = CurrencyService.usdToKes(priceUSD);

        return MpesaPayment.pay({
          phoneNumber: request.phoneNumber,
          amountKES,
          tool: request.tool,
          priceUSD,
        });
      }

      case "visa": {
        return VisaPayment.pay({
          amountUSD: priceUSD,
          tool: request.tool,
        });
      }

      default:
        return {
          success: false,
          message: "Unsupported payment method.",
        };
    }
  }
}
