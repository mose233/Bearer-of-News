import { supabase } from "@/integrations/supabase/client";

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
}

export interface MpesaPaymentResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export class PaymentService {
  /**
   * Send an M-Pesa STK Push request.
   */
  static async sendMpesaSTKPush(
    request: MpesaPaymentRequest
  ): Promise<MpesaPaymentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "mpesa-stkpush",
        {
          body: request,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return data as MpesaPaymentResponse;
    } catch (err) {
      console.error("M-Pesa STK Push failed:", err);
      throw err;
    }
  }
}
