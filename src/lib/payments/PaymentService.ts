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

    if (
      typeof request.amount !== "number" ||
      !Number.isFinite(request.amount) ||
      request.amount <= 0
    ) {
      throw new Error("Invalid payment amount.");
    }

    try {
      console.log("=================================");
      console.log("M-PESA PAYMENT REQUEST");
      console.log("Phone:", request.phoneNumber);
      console.log("Amount:", request.amount);
      console.log("=================================");

      const { data, error } = await supabase.functions.invoke(
        "mpesa-stkpush",
        {
          body: request,
        }
      );

      console.log("M-Pesa Edge Function response:", data);
      console.log("M-Pesa Edge Function error:", error);

      /*
       * Supabase functions.invoke() can return an error when the
       * Edge Function responds with HTTP 4xx/5xx.
       *
       * Try to extract the actual response body so that we can see
       * the real M-Pesa/Daraja error instead of only:
       *
       * "Edge Function returned a non-2xx status code"
       */
      if (error) {
        const context = (error as any)?.context;

        if (context) {
          try {
            const responseText = await context.text();

            console.error(
              "M-Pesa Edge Function HTTP error body:",
              responseText
            );

            if (responseText) {
              try {
                const responseBody = JSON.parse(responseText);

                const detailedError =
                  responseBody?.error ??
                  responseBody?.message ??
                  responseBody?.details ??
                  responseBody?.errorMessage ??
                  responseBody?.ResponseDescription;

                if (detailedError) {
                  throw new Error(String(detailedError));
                }

                throw new Error(responseText);
              } catch (jsonError) {
                /*
                 * If the response isn't JSON, expose the raw
                 * response text.
                 */
                if (jsonError instanceof Error) {
                  throw jsonError;
                }

                throw new Error(responseText);
              }
            }
          } catch (bodyError) {
            /*
             * If the response body cannot be read, continue with
             * the original Supabase error.
             */
            console.error(
              "Could not read M-Pesa Edge Function error body:",
              bodyError
            );
          }
        }

        throw new Error(
          error.message || "M-Pesa payment request failed."
        );
      }

      if (!data) {
        throw new Error(
          "No response received from M-Pesa payment server."
        );
      }

      /*
       * Our mpesa-stkpush Edge Function returns:
       *
       * {
       *   success: true,
       *   data: { ...Daraja response... }
       * }
       */
      if (!data.success) {
        throw new Error(
          data.error ??
            data.message ??
            "M-Pesa payment request failed."
        );
      }

      if (!data.data) {
        throw new Error(
          "M-Pesa server returned success but no payment data."
        );
      }

      const paymentResponse =
        data.data as MpesaPaymentResponse;

      console.log(
        "M-Pesa STK Push accepted:",
        paymentResponse
      );

      return paymentResponse;
    } catch (err) {
      console.error(
        "M-Pesa STK Push failed:",
        err
      );

      throw err instanceof Error
        ? err
        : new Error(
            "Failed to initiate M-Pesa payment."
          );
    }
  }

  /**
   * Check whether an M-Pesa payment has been completed.
   */
  static async checkMpesaPayment(
    checkoutRequestID: string
  ): Promise<MpesaPaymentStatusResponse> {
    if (!checkoutRequestID?.trim()) {
      throw new Error(
        "CheckoutRequestID is required."
      );
    }

    try {
      console.log(
        "================================="
      );
      console.log(
        "M-PESA PAYMENT STATUS CHECK"
      );
      console.log(
        "CheckoutRequestID:",
        checkoutRequestID
      );
      console.log(
        "================================="
      );

      const { data, error } =
        await supabase.functions.invoke(
          "mpesa-status",
          {
            body: {
              checkoutRequestID,
            },
          }
        );

      console.log(
        "M-Pesa status response:",
        data
      );

      console.log(
        "M-Pesa status error:",
        error
      );

      /*
       * Expose the actual Edge Function error
       * instead of hiding it behind the generic
       * Supabase error.
       */
      if (error) {
        const context = (error as any)?.context;

        if (context) {
          try {
            const responseText =
              await context.text();

            console.error(
              "M-Pesa status Edge Function error body:",
              responseText
            );

            if (responseText) {
              try {
                const responseBody =
                  JSON.parse(responseText);

                const detailedError =
                  responseBody?.error ??
                  responseBody?.message ??
                  responseBody?.details ??
                  responseBody?.errorMessage ??
                  responseBody?.ResultDesc;

                if (detailedError) {
                  throw new Error(
                    String(detailedError)
                  );
                }

                throw new Error(responseText);
              } catch (jsonError) {
                if (jsonError instanceof Error) {
                  throw jsonError;
                }

                throw new Error(responseText);
              }
            }
          } catch (bodyError) {
            console.error(
              "Could not read M-Pesa status error body:",
              bodyError
            );
          }
        }

        throw new Error(
          error.message ||
            "M-Pesa payment status check failed."
        );
      }

      if (!data) {
        throw new Error(
          "No response received from payment status server."
        );
      }

      return data as MpesaPaymentStatusResponse;
    } catch (err) {
      console.error(
        "Payment status check failed:",
        err
      );

      throw err instanceof Error
        ? err
        : new Error(
            "Payment status check failed."
          );
    }
  }
}
