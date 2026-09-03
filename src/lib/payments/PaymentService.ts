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
  result?: unknown;
}

/**
 * Safely extract a useful error message from a Supabase
 * Edge Function invocation error or returned response.
 */
function extractFunctionError(
  error: unknown,
  data?: unknown
): string {
  /**
   * First inspect a structured response from the Edge Function.
   */
  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    if (
      typeof response.message === "string" &&
      response.message.trim()
    ) {
      return response.message.trim();
    }

    if (
      typeof response.error === "string" &&
      response.error.trim()
    ) {
      return response.error.trim();
    }

    /**
     * Supabase Edge Functions commonly return:
     *
     * {
     *   success: false,
     *   error: "..."
     * }
     */
    if (
      response.data &&
      typeof response.data === "object"
    ) {
      const nested =
        response.data as Record<string, unknown>;

      if (
        typeof nested.message === "string" &&
        nested.message.trim()
      ) {
        return nested.message.trim();
      }

      if (
        typeof nested.error === "string" &&
        nested.error.trim()
      ) {
        return nested.error.trim();
      }
    }
  }

  /**
   * Supabase FunctionsError usually has a message.
   */
  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message.trim();
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message ===
      "string"
  ) {
    const message = (
      error as { message: string }
    ).message.trim();

    if (message) {
      return message;
    }
  }

  return "Payment service request failed.";
}

/**
 * Safely unwrap a Supabase Edge Function response.
 *
 * Supports BOTH:
 *
 * Direct:
 * {
 *   paid: true,
 *   resultCode: "0"
 * }
 *
 * Wrapped:
 * {
 *   success: true,
 *   data: {
 *     paid: true,
 *     resultCode: "0"
 *   }
 * }
 */
function unwrapFunctionData(
  data: unknown
): unknown {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return data;
  }

  const response =
    data as Record<string, unknown>;

  if (
    "data" in response &&
    response.data !== undefined &&
    response.data !== null
  ) {
    return response.data;
  }

  return data;
}

/**
 * Safely normalize a ResultCode from the payment
 * status response.
 *
 * Supports:
 *
 * resultCode
 * ResultCode
 * result.ResultCode
 */
function extractResultCode(
  status: Record<string, unknown>
): string | undefined {
  if (
    status.resultCode !== undefined &&
    status.resultCode !== null
  ) {
    return String(status.resultCode).trim();
  }

  if (
    status.ResultCode !== undefined &&
    status.ResultCode !== null
  ) {
    return String(status.ResultCode).trim();
  }

  if (
    status.result &&
    typeof status.result === "object"
  ) {
    const result =
      status.result as Record<string, unknown>;

    if (
      result.ResultCode !== undefined &&
      result.ResultCode !== null
    ) {
      return String(result.ResultCode).trim();
    }

    if (
      result.resultCode !== undefined &&
      result.resultCode !== null
    ) {
      return String(result.resultCode).trim();
    }
  }

  return undefined;
}

/**
 * Extract the payment message safely.
 */
function extractMessage(
  status: Record<string, unknown>
): string | undefined {
  if (
    typeof status.message === "string" &&
    status.message.trim()
  ) {
    return status.message.trim();
  }

  if (
    typeof status.error === "string" &&
    status.error.trim()
  ) {
    return status.error.trim();
  }

  if (
    typeof status.ResultDesc === "string" &&
    status.ResultDesc.trim()
  ) {
    return status.ResultDesc.trim();
  }

  if (
    status.result &&
    typeof status.result === "object"
  ) {
    const result =
      status.result as Record<string, unknown>;

    if (
      typeof result.ResultDesc === "string" &&
      result.ResultDesc.trim()
    ) {
      return result.ResultDesc.trim();
    }
  }

  return undefined;
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
    const phoneNumber =
      request.phoneNumber?.trim();

    const amount = Number(request.amount);

    if (!phoneNumber) {
      throw new Error(
        "M-Pesa phone number is required."
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "A valid M-Pesa payment amount is required."
      );
    }

    console.log("=================================");
    console.log("M-PESA STK PUSH REQUEST");
    console.log("Phone:", phoneNumber);
    console.log("Amount:", amount);
    console.log("=================================");

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "mpesa-stkpush",
          {
            body: {
              phoneNumber,
              amount,
            },
          }
        );

      console.log(
        "M-PESA STK PUSH RESPONSE:",
        data
      );

      if (error) {
        console.error(
          "M-PESA STK PUSH FUNCTION ERROR:",
          error
        );

        const message =
          extractFunctionError(
            error,
            data
          );

        throw new Error(message);
      }

      if (!data) {
        throw new Error(
          "M-Pesa STK Push returned an empty response."
        );
      }

      /**
       * Handle explicit Edge Function failure.
       */
      if (
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        data.success === false
      ) {
        throw new Error(
          extractFunctionError(
            undefined,
            data
          )
        );
      }

      /**
       * Supabase Edge Function may return:
       *
       * {
       *   success: true,
       *   data: {...}
       * }
       *
       * or the raw response directly.
       */
      const responseData =
        unwrapFunctionData(data);

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
          String(
            response.MerchantRequestID ?? ""
          ),

        CheckoutRequestID:
          String(
            response.CheckoutRequestID
          ),

        ResponseCode:
          String(
            response.ResponseCode ?? ""
          ),

        ResponseDescription:
          String(
            response.ResponseDescription ?? ""
          ),

        CustomerMessage:
          String(
            response.CustomerMessage ?? ""
          ),
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
   * Verifies the actual M-PESA transaction through:
   *
   *     mpesa-status
   *
   * The backend ultimately verifies Safaricom's ResultCode.
   *
   * ResultCode "0" means PAYMENT CONFIRMED.
   */
  static async checkMpesaPayment(
    checkoutRequestID: string
  ): Promise<MpesaPaymentStatusResponse> {
    const checkoutID =
      checkoutRequestID?.trim();

    if (!checkoutID) {
      throw new Error(
        "CheckoutRequestID is required to verify payment."
      );
    }

    console.log("=================================");
    console.log("M-PESA PAYMENT STATUS CHECK");
    console.log(
      "CheckoutRequestID:",
      checkoutID
    );
    console.log(
      "Edge Function: mpesa-status"
    );
    console.log("=================================");

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "mpesa-status",
          {
            body: {
              checkoutRequestID:
                checkoutID,
            },
          }
        );

      /**
       * Log the complete response.
       *
       * This intentionally contains payment status
       * information only. Never log access tokens,
       * secrets, passkeys, or authorization headers.
       */
      console.log(
        "M-PESA STATUS RESPONSE:",
        data
      );

      console.log(
        "M-PESA STATUS RESPONSE JSON:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      console.log(
        "M-PESA STATUS FUNCTION ERROR:",
        error
      );

      if (error) {
        const message =
          extractFunctionError(
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
       * Handle explicit Edge Function failure.
       */
      if (
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        data.success === false
      ) {
        throw new Error(
          extractFunctionError(
            undefined,
            data
          )
        );
      }

      /**
       * ========================================================
       * CRITICAL FIX:
       *
       * Unwrap the Edge Function response.
       *
       * The backend may return:
       *
       * {
       *   success: true,
       *   data: {
       *     paid: true,
       *     ...
       *   }
       * }
       *
       * The previous implementation treated the OUTER
       * object as the payment status object.
       */
      const responseData =
        unwrapFunctionData(data);

      if (
        !responseData ||
        typeof responseData !== "object"
      ) {
        throw new Error(
          "M-Pesa status check returned an invalid response."
        );
      }

      const status =
        responseData as Record<
          string,
          unknown
        >;

      /**
       * Extract normalized status information.
       */
      const resultCode =
        extractResultCode(status);

      const message =
        extractMessage(status);

      const paid =
        status.paid === true;

      const pending =
        status.pending === true;

      const cancelled =
        status.cancelled === true;

      const failed =
        status.failed === true;

      console.log(
        "M-PESA NORMALIZED STATUS:",
        {
          checkoutRequestID:
            checkoutID,
          paid,
          pending,
          cancelled,
          failed,
          resultCode,
          message,
        }
      );

      /**
       * ========================================================
       * PAYMENT CONFIRMED
       * ========================================================
       *
       * This is the most important rule.
       *
       * ResultCode "0" is the definitive Safaricom
       * successful payment result.
       *
       * We also accept paid === true because the backend
       * already translates ResultCode "0" into paid === true.
       */
      if (
        paid ||
        resultCode === "0"
      ) {
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
            message ||
            "Payment confirmed.",
          resultCode:
            resultCode ?? "0",
          result:
            status.result,
        };
      }

      /**
       * ========================================================
       * CUSTOMER CANCELLED PAYMENT
       * ========================================================
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
          result:
            status.result,
        };
      }

      /**
       * ========================================================
       * PAYMENT FAILED
       * ========================================================
       *
       * Never convert a failure into a successful payment.
       */
      if (failed) {
        console.error(
          "M-PESA PAYMENT FAILED:",
          {
            checkoutRequestID:
              checkoutID,
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
          result:
            status.result,
        };
      }

      /**
       * ========================================================
       * PAYMENT STILL PENDING
       * ========================================================
       *
       * This is the ONLY situation where the frontend
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
          result:
            status.result,
        };
      }

      /**
       * ========================================================
       * RESULT CODE BASED FALLBACK
       * ========================================================
       *
       * If the backend provides a ResultCode but omitted
       * the convenience boolean flags, handle it safely here.
       */

      if (resultCode === "1032") {
        return {
          paid: false,
          pending: false,
          cancelled: true,
          failed: false,
          message:
            message ||
            "Payment was cancelled by the customer.",
          resultCode,
          result:
            status.result,
        };
      }

      if (resultCode === "1037") {
        return {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message:
            message ||
            "M-Pesa payment request timed out.",
          resultCode,
          result:
            status.result,
        };
      }

      if (resultCode === "4999") {
        return {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message:
            message ||
            "M-Pesa merchant verification failed.",
          resultCode,
          result:
            status.result,
        };
      }

      /**
       * Any other NON-EMPTY ResultCode is a failure.
       *
       * Never treat an unknown non-zero ResultCode as paid.
       */
      if (
        resultCode !== undefined &&
        resultCode !== ""
      ) {
        console.error(
          "M-PESA NON-ZERO RESULT CODE:",
          {
            checkoutRequestID:
              checkoutID,
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
          result:
            status.result,
        };
      }

      /**
       * ========================================================
       * UNKNOWN / INCOMPLETE RESPONSE
       * ========================================================
       *
       * We cannot safely confirm payment.
       *
       * Never mark the transaction as paid.
       *
       * Allow the caller to retry verification.
       */
      console.warn(
        "M-PESA UNKNOWN STATUS RESPONSE:",
        {
          checkoutRequestID:
            checkoutID,
          data: responseData,
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
        result:
          status.result,
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
