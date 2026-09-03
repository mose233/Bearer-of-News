import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import { querySTKStatus } from "../_shared/mpesa-query.ts";

/**
 * ============================================================
 * SAFARICOM STK PUSH RESULT CODES
 * ============================================================
 *
 * ResultCode "0" is the ONLY result that confirms payment.
 *
 * Important:
 * - ResponseCode is not payment confirmation.
 * - ResponseDescription is not payment confirmation.
 * - CustomerMessage is not payment confirmation.
 * - ResultDesc is not payment confirmation.
 * - Only ResultCode "0" means the payment succeeded.
 */

const RESULT_SUCCESS = "0";
const RESULT_CANCELLED = "1032";
const RESULT_TIMEOUT = "1037";
const RESULT_MERCHANT_NOT_FOUND = "4999";

/**
 * ============================================================
 * REQUEST TYPE
 * ============================================================
 *
 * The frontend only needs to provide the CheckoutRequestID.
 *
 * Merchant configuration such as:
 * - BusinessShortCode
 * - Consumer Key
 * - Consumer Secret
 * - Passkey
 *
 * is handled server-side by mpesa-query.ts / env.ts.
 */

interface VerifyPaymentRequest {
  checkoutRequestID?: string;
}

/**
 * ============================================================
 * RESPONSE TYPE
 * ============================================================
 */

interface PaymentResponse {
  paid: boolean;
  pending: boolean;
  cancelled: boolean;
  failed: boolean;
  message: string;
  resultCode?: string;
  result?: unknown;
}

/**
 * ============================================================
 * M-PESA PAYMENT STATUS
 * ============================================================
 */

serve(async (req: Request): Promise<Response> => {
  /**
   * ==========================================================
   * CORS
   * ==========================================================
   */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  /**
   * ==========================================================
   * ONLY POST
   * ==========================================================
   */

  if (req.method !== "POST") {
    return jsonResponse(
      {
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message: "Method Not Allowed.",
      },
      405,
    );
  }

  try {
    /**
     * ========================================================
     * PARSE REQUEST
     * ========================================================
     */

    let body: VerifyPaymentRequest;

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message: "Invalid JSON request body.",
        },
        400,
      );
    }

    /**
     * ========================================================
     * CHECKOUT REQUEST ID
     * ========================================================
     */

    const checkoutRequestID =
      typeof body.checkoutRequestID === "string"
        ? body.checkoutRequestID.trim()
        : "";

    if (!checkoutRequestID) {
      return jsonResponse(
        {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message: "CheckoutRequestID is required.",
        },
        400,
      );
    }

    /**
     * ========================================================
     * LOG VERIFICATION REQUEST
     * ========================================================
     *
     * CheckoutRequestID is safe to log for debugging.
     *
     * NEVER log:
     * - Consumer Secret
     * - Passkey
     * - OAuth access token
     * - Generated password
     * - Authorization headers
     * - Supabase service-role credentials
     */

    console.log("=================================");
    console.log("M-PESA PAYMENT STATUS CHECK");
    console.log("CheckoutRequestID:", checkoutRequestID);
    console.log("=================================");

    /**
     * ========================================================
     * ASK SAFARICOM FOR PAYMENT STATUS
     * ========================================================
     *
     * querySTKStatus() obtains the M-PESA merchant configuration
     * from the Edge Function environment.
     *
     * The frontend does NOT supply BusinessShortCode.
     */

    const result = await querySTKStatus(checkoutRequestID);

    /**
     * ========================================================
     * SAFE RAW SAFARICOM RESPONSE LOG
     * ========================================================
     *
     * This logs transaction/status information only.
     *
     * NEVER log:
     * - Consumer Secret
     * - Passkey
     * - OAuth access token
     * - Generated password
     * - Authorization headers
     * - Supabase service-role credentials
     */

    console.log("========== M-PESA QUERY RESULT ==========");

    console.log(
      JSON.stringify(
        {
          ResponseCode: result?.ResponseCode ?? null,
          ResponseDescription:
            result?.ResponseDescription ?? null,
          MerchantRequestID:
            result?.MerchantRequestID ?? null,
          CheckoutRequestID:
            result?.CheckoutRequestID ?? null,
          ResultCode:
            result?.ResultCode ?? null,
          ResultDesc:
            result?.ResultDesc ?? null,
          CustomerMessage:
            result?.CustomerMessage ?? null,
          ResultParameters:
            result?.ResultParameters ?? null,
        },
        null,
        2,
      ),
    );

    console.log("========== END M-PESA QUERY RESULT ==========");

    /**
     * ========================================================
     * NORMALIZE RESULT CODE
     * ========================================================
     *
     * Safaricom may return ResultCode as either a number
     * or a string.
     *
     * We normalize it to a trimmed string.
     */

    const resultCode =
      result?.ResultCode === undefined ||
      result?.ResultCode === null
        ? ""
        : String(result.ResultCode).trim();

    const resultDescription =
      typeof result?.ResultDesc === "string"
        ? result.ResultDesc.trim()
        : "";

    console.log(
      "M-PESA verification result:",
      JSON.stringify({
        checkoutRequestID,
        resultCode,
        resultDescription,
      }),
    );

    /**
     * ========================================================
     * PAYMENT SUCCESS
     * ========================================================
     *
     * ONLY ResultCode "0" means payment succeeded.
     *
     * This check deliberately happens BEFORE any text-based
     * processing detection.
     */

    if (resultCode === RESULT_SUCCESS) {
      console.log(
        "M-PESA PAYMENT VERIFIED SUCCESSFULLY:",
        checkoutRequestID,
      );

      return jsonResponse({
        paid: true,
        pending: false,
        cancelled: false,
        failed: false,
        message: "Payment confirmed.",
        resultCode,
        result,
      });
    }

    /**
     * ========================================================
     * CUSTOMER CANCELLED
     * ========================================================
     */

    if (resultCode === RESULT_CANCELLED) {
      console.log(
        "M-PESA PAYMENT CANCELLED:",
        checkoutRequestID,
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: true,
        failed: false,
        message: "Payment was cancelled by the customer.",
        resultCode,
        result,
      });
    }

    /**
     * ========================================================
     * REQUEST TIMED OUT
     * ========================================================
     */

    if (resultCode === RESULT_TIMEOUT) {
      console.log(
        "M-PESA PAYMENT TIMED OUT:",
        checkoutRequestID,
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message: "M-PESA payment request timed out.",
        resultCode,
        result,
      });
    }

    /**
     * ========================================================
     * MERCHANT NOT FOUND
     * ========================================================
     *
     * ResultCode 4999 is a merchant/configuration failure.
     *
     * It MUST NOT be treated as pending.
     */

    // Safaricom can temporarily return ResultCode 4999 with
    // "The transaction is still under processing" while the
    // customer payment is still being completed.
    //
    // This is NOT the same as a genuine merchant/configuration
    // failure. Treat this specific response as pending so the
    // frontend can poll again until ResultCode "0" confirms payment.
    if (
      resultCode === RESULT_MERCHANT_NOT_FOUND &&
      resultDescription.toLowerCase().includes("still under processing")
    ) {
      console.log(
        "M-PESA TRANSACTION STILL PROCESSING:",
        checkoutRequestID,
      );

      console.log(
        "Safaricom ResultCode 4999:",
        resultDescription,
      );

      return jsonResponse({
        paid: false,
        pending: true,
        cancelled: false,
        failed: false,
        message:
          resultDescription ||
          "The transaction is still under processing.",
        resultCode,
        result,
      });
    }

    // Other ResultCode 4999 responses remain genuine merchant/
    // configuration failures.
    if (resultCode === RESULT_MERCHANT_NOT_FOUND) {
      console.error(
        "M-PESA MERCHANT NOT FOUND:",
        checkoutRequestID,
      );

      console.error(
        "Safaricom ResultCode 4999:",
        resultDescription,
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          resultDescription ||
          "M-PESA merchant could not be found. Verify the production merchant configuration.",
        resultCode,
        result,
      });
    }

    /**
     * ========================================================
     * EMPTY RESULT CODE
     * ========================================================
     *
     * No definitive ResultCode means we cannot confirm
     * payment yet.
     *
     * This is the ONLY situation where this function returns
     * pending=true.
     *
     * We deliberately do NOT inspect ResultDesc for words such
     * as "processing".
     */

    if (resultCode === "") {
      console.warn(
        "M-PESA returned an empty ResultCode:",
        checkoutRequestID,
      );

      return jsonResponse({
        paid: false,
        pending: true,
        cancelled: false,
        failed: false,
        message:
          "M-PESA verification returned an incomplete response. Please retry.",
        resultCode,
        result,
      });
    }

    /**
     * ========================================================
     * OTHER SAFARICOM PAYMENT FAILURE
     * ========================================================
     *
     * Any non-zero ResultCode other than the specifically
     * handled cancellation/timeout/merchant codes means the
     * payment was NOT successful.
     *
     * We NEVER treat an unknown non-zero ResultCode as paid
     * or pending.
     */

    console.error(
      "M-PESA PAYMENT FAILED:",
      JSON.stringify({
        checkoutRequestID,
        resultCode,
        resultDescription,
      }),
    );

    return jsonResponse({
      paid: false,
      pending: false,
      cancelled: false,
      failed: true,
      message:
        resultDescription ||
        "M-PESA payment was not successful.",
      resultCode,
      result,
    });
  } catch (error) {
    /**
     * ========================================================
     * VERIFICATION ERROR
     * ========================================================
     *
     * An exception means the verification operation itself
     * failed.
     *
     * This is NOT the same thing as a Safaricom payment being
     * genuinely pending.
     *
     * Therefore:
     *
     *     paid     = false
     *     pending  = false
     *     failed   = true
     *
     * NEVER expose:
     * - Consumer Secret
     * - Passkey
     * - Access Token
     * - Generated Password
     * - Authorization headers
     */

    console.error(
      "M-PESA payment verification error:",
      error,
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    return jsonResponse(
      {
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          `M-PESA verification error: ${errorMessage}`,
      },
      500,
    );
  }
});

/**
 * ============================================================
 * JSON RESPONSE HELPER
 * ============================================================
 */

function jsonResponse(
  body: PaymentResponse,
  status = 200,
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}
