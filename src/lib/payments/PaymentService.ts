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
  resultCode?: string;
}

/**
 * Safely extract a useful error message from a Supabase
 * Edge Function invocation error or returned response.
 */
function extractFunctionError(
  error: unknown,
  data?: unknown
): string {
  // First check a structured response from the Edge Function.
  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    if (typeof response.message === "string" && response.message.trim()) {
      return response.message.trim();
    }

    if (typeof response.error === "string" && response.error.trim()) {
      return response.error.trim();
    }
  }

  // Supabase FunctionsError usually has a message.
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    const message = (error as { message: string }).message.trim();

    if (message) {
      return message;
    }
  }

  return "Payment service request failed.";
}

export class PaymentService {
  /**
   * ============================================================
   * M-PESA STK PUSH
   * ============================================================
   *
   * Starts an M-Pesa STK Push through the Supabase
   * mpesa-stkpush Edge Function.
   */
  static async sendMpesaSTKPush(
    request: MpesaPaymentRequest
  ): Promise<MpesaPaymentResponse> {
    const phoneNumber = request.phoneNumber?.trim();
    const amount = Number(request.amount);

    if (!phoneNumber) {
      throw new Error("M-Pesa phone number is required.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("A valid M-Pesa payment amount is required.");
    }

    console.log("=================================");
    console.log("M-PESA STK PUSH REQUEST");
    console.log("Phone:", phoneNumber);
    console.log("Amount:", amount);
    console.log("=================================");

    try {
      const { data, error } = await supabase.functions.invoke(
        "mpesa-stkpush",
        {
          body: {
            phoneNumber,
            amount,
          },
        }
      );

      console.log("M-PESA STK PUSH RESPONSE:", data);

      if (error) {
        console.error(
          "M-PESA STK PUSH FUNCTION ERROR:",
          error
        );

        const message = extractFunctionError(error, data);

        throw new Error(message);
      }

      if (!data) {
        throw new Error(
          "M-Pesa STK Push returned an empty response."
        );
      }

      /**
       * Your mpesa-stkpush Edge Function returns its
       * successful response inside data.data.
       */
      if (
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        data.success === false
      ) {
        throw new Error(
          extractFunctionError(undefined, data)
        );
      }

      const responseData =
        typeof data === "object" &&
        data !== null &&
        "data" in data
          ? data.data
          : data;

      if (
        !responseData ||
        typeof responseData !== "object"
      ) {
        throw new Error(
          "M-Pesa STK Push returned an invalid response."
        );
      }

      const response =
        responseData as Partial<MpesaPaymentResponse>;

      if (!response.CheckoutRequestID) {
        throw new Error(
          response.ResponseDescription ||
            response.CustomerMessage ||
            "M-Pesa did not return a CheckoutRequestID."
        );
      }

      return {
        MerchantRequestID:
          String(response.MerchantRequestID ?? ""),
        CheckoutRequestID:
          String(response.CheckoutRequestID),
        ResponseCode:
          String(response.ResponseCode ?? ""),
        ResponseDescription:
          String(response.ResponseDescription ?? ""),
        CustomerMessage:
          String(response.CustomerMessage ?? ""),
      };
    } catch (error) {
      console.error(
        "M-PESA STK PUSH ERROR:",
        error
      );

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Unable to start M-Pesa payment."
      );
    }
  }

  /**
   * ============================================================
   * M-PESA PAYMENT STATUS CHECK
   * ============================================================
   *
   * IMPORTANT:
   *
   * The actual deployed verification Edge Function in this
   * project is:
   *
   *     mpesa-status
   *
   * NOT:
   *
   *     mpesa-verify
   *
   * mpesa-status calls querySTKStatus(), which asks Safaricom
   * for the actual transaction ResultCode.
   *
   * ResultCode "0" means PAYMENT CONFIRMED.
   */
  static async checkMpesaPayment(
    checkoutRequestID: string
  ): Promise<MpesaPaymentStatusResponse> {
    const checkoutID = checkoutRequestID?.trim();

    if (!checkoutID) {
      throw new Error(
        "CheckoutRequestID is required to verify payment."
      );
    }

    console.log("=================================");
    console.log("M-PESA PAYMENT STATUS CHECK");
    console.log("CheckoutRequestID:", checkoutID);
    console.log("Edge Function: mpesa-status");
    console.log("=================================");

    try {
      /**
       * THIS IS THE CRITICAL FIX.
       *
       * Your actual Edge Function is mpesa-status.
       */
      const { data, error } =
        await supabase.functions.invoke(
          "mpesa-status",
          {
            body: {
              checkoutRequestID: checkoutID,
            },
          }
        );

      console.log(
        "M-PESA STATUS RESPONSE:",
        data
      );

      if (error) {
        console.error(
          "M-PESA STATUS FUNCTION ERROR:",
          error
        );

        const message = extractFunctionError(
          error,
          data
        );

        throw new Error(message);
      }

      if (!data) {
        throw new Error(
          "M-Pesa status check returned an empty response."
        );
      }

      /**
       * Normalize the response returned by mpesa-status.
       *
       * Expected successful response:
       *
       * {
       *   paid: true,
       *   pending: false,
       *   cancelled: false,
       *   failed: false,
       *   message: "Payment confirmed.",
       *   resultCode: "0"
       * }
       */

      const status =
        data as Partial<MpesaPaymentStatusResponse>;

      const paid = status.paid === true;
      const pending = status.pending === true;
      const cancelled =
        status.cancelled === true;
      const failed = status.failed === true;

      const resultCode =
        status.resultCode !== undefined &&
        status.resultCode !== null
          ? String(status.resultCode).trim()
          : undefined;

      const message =
        typeof status.message === "string"
          ? status.message.trim()
          : undefined;

      /**
       * PAYMENT CONFIRMED
       *
       * Only paid === true is allowed to complete
       * the payment flow.
       */
      if (paid) {
        console.log(
          "================================="
        );
        console.log(
          "M-PESA PAYMENT CONFIRMED"
        );
        console.log(
          "CheckoutRequestID:",
          checkoutID
        );
        console.log(
          "ResultCode:",
          resultCode ?? "0"
        );
        console.log(
          "================================="
        );

        return {
          paid: true,
          pending: false,
          cancelled: false,
          failed: false,
          message:
            message || "Payment confirmed.",
          resultCode: resultCode ?? "0",
        };
      }

      /**
       * CUSTOMER CANCELLED PAYMENT
       */
      if (cancelled) {
        console.log(
          "M-PESA PAYMENT CANCELLED:",
          checkoutID
        );

        return {
          paid: false,
          pending: false,
          cancelled: true,
          failed: false,
          message:
            message ||
            "Payment was cancelled by the customer.",
          resultCode,
        };
      }

      /**
       * PAYMENT FAILED
       */
      if (failed) {
        console.error(
          "M-PESA PAYMENT FAILED:",
          {
            checkoutRequestID: checkoutID,
            resultCode,
            message,
          }
        );

        return {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message:
            message ||
            "M-Pesa payment was not successful.",
          resultCode,
        };
      }

      /**
       * PAYMENT STILL PENDING
       *
       * This is the only situation where the frontend
       * should continue polling.
       */
      if (pending) {
        console.log(
          "M-PESA PAYMENT STILL PENDING:",
          checkoutID
        );

        return {
          paid: false,
          pending: true,
          cancelled: false,
          failed: false,
          message:
            message ||
            "Waiting for payment confirmation...",
          resultCode,
        };
      }

      /**
       * UNKNOWN RESPONSE
       *
       * Do NOT treat an unknown response as paid.
       * Treat it as pending so the PaymentModal can retry.
       */
      console.warn(
        "M-PESA UNKNOWN STATUS RESPONSE:",
        {
          checkoutRequestID: checkoutID,
          data,
        }
      );

      return {
        paid: false,
        pending: true,
        cancelled: false,
        failed: false,
        message:
          message ||
          "Waiting for payment confirmation...",
        resultCode,
      };
    } catch (error) {
      console.error(
        "M-PESA PAYMENT STATUS ERROR:",
        error
      );

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Unable to verify M-Pesa payment."
      );
    }
  }
}
