import { supabase } from "@/integrations/supabase/client";
import { PaymentResult, AITool } from "./PaymentTypes";

interface MpesaPaymentRequest {
  phoneNumber: string;
  amountKES: number;
  tool: AITool;
  priceUSD: number;
}

export class MpesaPayment {
  static async pay(
    request: MpesaPaymentRequest
  ): Promise<PaymentResult> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "mpesa-stkpush",
        {
          body: {
            phoneNumber: request.phoneNumber,
            amount: request.amountKES,
            tool: request.tool,
            priceUSD: request.priceUSD,
          },
        }
      );

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        transactionId:
          data?.CheckoutRequestID ??
          data?.MerchantRequestID,
        message:
          data?.CustomerMessage ??
          "STK Push sent successfully.",
      };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Unknown payment error.",
      };
    }
  }
}
