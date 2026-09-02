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
  error?: string;
  result?: Record<string, unknown>;
}

/**
 * Safely extract a useful error message from a Supabase
 * Edge Function invocation error.
 */
async function extractFunctionError(
  error: unknown,
  fallbackMessage: string,
): Promise<Error> {
  const supabaseError =
    error as {
      message?: string;
      context?: Response;
    };

  const context =
    supabaseError?.context;

  if (context) {
    try {
      const responseText =
        await context.text();

      if (responseText?.trim()) {
        try {
          const responseBody =
            JSON.parse(responseText);

          const detailedError =
            responseBody?.error ??
            responseBody?.message ??
            responseBody?.details ??
            responseBody?.errorMessage ??
            responseBody?.ResponseDescription ??
            responseBody?.ResultDesc;

          if (detailedError) {
            return new Error(
              String(detailedError),
            );
          }

          return new Error(
            responseText,
          );
        } catch {
          return new Error(
            responseText,
          );
        }
      }
    } catch (bodyError) {
      console.error(
        "Could not read Edge Function error body:",
        bodyError,
      );
    }
  }

  return new Error(
    supabaseError?.message ||
      fallbackMessage,
  );
}

export class PaymentService {
  /**
   * ============================================================
   * SEND M-PESA STK PUSH
   * ============================================================
   *
   * Starts an M-PESA STK Push.
   *
   * This does NOT mean the payment is complete.
   *
   * A successful STK Push only means Safaricom accepted
   * the request for processing.
   */
  static async sendMpesaSTKPush(
    request: MpesaPaymentRequest,
  ): Promise<MpesaPaymentResponse> {
    if (!request.phoneNumber?.trim()) {
      throw new Error(
        "Phone number is required.",
      );
    }

    if (
      typeof request.amount !== "number" ||
      !Number.isFinite(request.amount) ||
      request.amount <= 0
    ) {
      throw new Error(
        "Invalid payment amount.",
      );
    }

    try {
      console.log(
        "=================================",
      );

      console.log(
        "M-PESA PAYMENT REQUEST",
      );

      console.log(
        "Phone:",
        request.phoneNumber,
      );

      console.log(
        "Amount:",
        request.amount,
      );

      console.log(
        "=================================",
      );

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "mpesa-stkpush",
        {
          body: request,
        },
      );

      console.log(
        "M-Pesa STK Push response:",
        data,
      );

      if (error) {
        const detailedError =
          await extractFunctionError(
            error,
            "M-Pesa payment request failed.",
          );

        console.error(
          "M-Pesa STK Push Edge Function error:",
          detailedError,
        );

        throw detailedError;
      }

      if (!data) {
        throw new Error(
          "No response received from M-Pesa payment server.",
        );
      }

      /**
       * Our mpesa-stkpush Edge Function is expected
       * to return:
       *
       * {
       *   success: true,
       *   data: {
       *     MerchantRequestID,
       *     CheckoutRequestID,
       *     ResponseCode,
       *     ResponseDescription,
       *     CustomerMessage
       *   }
       * }
       */

      if (!data.success) {
        throw new Error(
          data.error ??
            data.message ??
            data.details ??
            "M-Pesa payment request failed.",
        );
      }

      if (!data.data) {
        throw new Error(
          "M-Pesa server returned success but no payment data.",
        );
      }

      const paymentResponse =
        data.data as MpesaPaymentResponse;

      if (
        !paymentResponse.CheckoutRequestID
      ) {
        throw new Error(
          "M-Pesa server did not return a CheckoutRequestID.",
        );
      }

      console.log(
        "M-Pesa STK Push accepted.",
      );

      console.log(
        "CheckoutRequestID:",
        paymentResponse.CheckoutRequestID,
      );

      return paymentResponse;
    } catch (err) {
      console.error(
        "M-Pesa STK Push failed:",
        err,
      );

      throw err instanceof Error
        ? err
        : new Error(
            "Failed to initiate M-Pesa payment.",
          );
    }
  }

  /**
   * ============================================================
   * CHECK M-PESA PAYMENT STATUS
   * ============================================================
   *
   * IMPORTANT:
   *
   * This is the step that determines whether the customer
   * actually completed the payment.
   *
   * STK Push accepted != payment completed.
   *
   * The CheckoutRequestID returned by STK Push is passed
   * to the verification Edge Function.
   */
  static async checkMpesaPayment(
    checkoutRequestID: string,
  ): Promise<MpesaPaymentStatusResponse> {
    const normalizedCheckoutRequestID =
      typeof checkoutRequestID === "string"
        ? checkoutRequestID.trim()
        : "";

    if (!normalizedCheckoutRequestID) {
      throw new Error(
        "CheckoutRequestID is required.",
      );
    }

    try {
      console.log(
        "=================================",
      );

      console.log(
        "M-PESA PAYMENT STATUS CHECK",
      );

      console.log(
        "CheckoutRequestID:",
        normalizedCheckoutRequestID,
      );

      console.log(
        "=================================",
      );

      /**
       * IMPORTANT:
       *
       * This must match the actual deployed
       * verification Edge Function name.
       *
       * We are using "mpesa-verify" because that is
       * the verification function we have been working
       * with.
       */
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "mpesa-verify",
        {
          body: {
            checkoutRequestID:
              normalizedCheckoutRequestID,
          },
        },
      );

      console.log(
        "M-Pesa verification response:",
        data,
      );

      if (error) {
        const detailedError =
          await extractFunctionError(
            error,
            "M-Pesa payment status check failed.",
          );

        console.error(
          "M-Pesa verification Edge Function error:",
          detailedError,
        );

        throw detailedError;
      }

      if (!data) {
        throw new Error(
          "No response received from payment verification server.",
        );
      }

      /**
       * ========================================================
       * NORMALIZE VERIFICATION RESPONSE
       * ========================================================
       *
       * The mpesa-verify Edge Function should return
       * normalized payment state such as:
       *
       * {
       *   paid: true,
       *   pending: false,
       *   failed: false,
       *   cancelled: false,
       *   message: "Payment completed successfully."
       * }
       */

      const status =
        data as MpesaPaymentStatusResponse;

      /**
       * A payment is considered complete ONLY when
       * the verification service explicitly says:
       *
       * paid === true
       */
      if (status.paid === true) {
        console.log(
          "=================================",
        );

        console.log(
          "M-PESA PAYMENT CONFIRMED",
        );

        console.log(
          "Payment status: PAID",
        );

        console.log(
          "CheckoutRequestID:",
          normalizedCheckoutRequestID,
        );

        console.log(
          "=================================",
        );

        return {
          ...status,
          paid: true,
          pending: false,
          failed: false,
          cancelled: false,
        };
      }

      /**
       * Payment is still being processed.
       */
      if (status.pending === true) {
        console.log(
          "M-PESA PAYMENT STILL PENDING",
        );

        return {
          ...status,
          paid: false,
          pending: true,
        };
      }

      /**
       * Customer cancelled the payment.
       */
      if (status.cancelled === true) {
        console.log(
          "M-PESA PAYMENT CANCELLED",
        );

        return {
          ...status,
          paid: false,
          pending: false,
          cancelled: true,
        };
      }

      /**
       * Payment failed.
       */
      if (status.failed === true) {
        console.log(
          "M-PESA PAYMENT FAILED",
        );

        return {
          ...status,
          paid: false,
          pending: false,
          failed: true,
        };
      }

      /**
       * If the verification function returned none
       * of the expected states, do NOT assume payment
       * succeeded.
       */
      console.warn(
        "M-Pesa verification returned an unexpected status:",
        status,
      );

      return {
        ...status,
        paid: false,
        pending: true,
      };
    } catch (err) {
      console.error(
        "Payment status check failed:",
        err,
      );

      throw err instanceof Error
        ? err
        : new Error(
            "Payment status check failed.",
          );
    }
  }
}
