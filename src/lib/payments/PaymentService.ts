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
    if (!request.phoneNumber?.trim()) {
      throw new Error("Phone number is required.");
    }

    if (request.amount <= 0) {
      throw new Error("Invalid payment amount.");
    }

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

      if (!data) {
        throw new Error("No response received from payment server.");
      }

      return data as MpesaPaymentResponse;
    } catch (err) {
      console.error("M-Pesa STK Push failed:", err);
      throw err;
    }
  }

  /**
   * Check whether an M-Pesa payment has been completed.
   */
  static async checkMpesaPayment(
    checkoutRequestID: string
  ): Promise<{ paid: boolean; message?: string }> {
    if (!checkoutRequestID?.trim()) {
      throw new Error("CheckoutRequestID is required.");
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "mpesa-status",
        {
          body: {
            checkoutRequestID,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No response received from payment status server.");
      }

      return data as {
        paid: boolean;
        message?: string;
      };
    } catch (err) {
      console.error("Payment status check failed:", err);
      throw err;
    }
  }
}
