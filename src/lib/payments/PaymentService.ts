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

export interface MpesaPaymentStatusResponse {
  paid: boolean;
  pending?: boolean;
  cancelled?: boolean;
  failed?: boolean;
  message?: string;
  result?: any;
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

      if (!data.success) {
  throw new Error(data.error ?? "Payment request failed.");
}

return data.data as MpesaPaymentResponse;
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
  ): Promise<MpesaPaymentStatusResponse> {
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
      console.log("Payment status response:", data);
      return data as MpesaPaymentStatusResponse;
    } catch (err) {
      console.error("Payment status check failed:", err);
      throw err;
    }
  }
}
