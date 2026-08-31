import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import { querySTKStatus } from "../_shared/mpesa-query.ts";

/**
 * ============================================================
 * SAFARICOM STK PUSH RESULT CODES
 * ============================================================
 *
 * ResultCode 0 is the ONLY result that means the payment
 * itself succeeded.
 */

const RESULT_SUCCESS = "0";
const RESULT_CANCELLED = "1032";
const RESULT_TIMEOUT = "1037";
const RESULT_MERCHANT_NOT_FOUND = "4999";

/**
 * ============================================================
 * M-PESA STATUS
 * ============================================================
 *
 * The frontend sends ONLY:
 *
 * {
 *   checkoutRequestID: "..."
 * }
 *
 * The merchant configuration is handled server-side by
 * mpesa-query.ts / env.ts.
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
      405
    );
  }

  try {
    /**
     * ========================================================
     * PARSE REQUEST
     * ========================================================
     */

    let body: {
      checkoutRequestID?: string;
    };

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
        400
      );
    }

    /**
     * ========================================================
     * CHECKOUT REQUEST ID
     * ========================================================
     */

    const checkoutRequestID =
      body.checkoutRequestID?.trim();

    if (!checkoutRequestID) {
      return jsonResponse(
        {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message:
            "CheckoutRequestID is required.",
        },
        400
      );
    }

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

    /**
     * ========================================================
     * ASK SAFARICOM FOR PAYMENT STATUS
     * ========================================================
     *
     * querySTKStatus() obtains the M-PESA merchant
     * configuration from the Edge Function environment.
     *
     * The frontend does NOT supply BusinessShortCode.
     */

    const result =
      await querySTKStatus(
        checkoutRequestID
      );

    /**
     * ========================================================
     * NORMALIZE RESULT CODE
     * ========================================================
     */

    const resultCode =
      result.ResultCode === undefined ||
      result.ResultCode === null
        ? ""
        : String(result.ResultCode);

    const resultDescription =
      typeof result.ResultDesc === "string"
        ? result.ResultDesc
        : "";

    console.log(
      "M-PESA verification result:",
      JSON.stringify({
        checkoutRequestID,
        resultCode,
        resultDescription,
      })
    );

    /**
     * ========================================================
     * PAYMENT SUCCESS
     * ========================================================
     *
     * ONLY ResultCode 0 means the payment succeeded.
     */

    if (resultCode === RESULT_SUCCESS) {
      console.log(
        "M-PESA PAYMENT VERIFIED SUCCESSFULLY:",
        checkoutRequestID
      );

      return jsonResponse({
        paid: true,
        pending: false,
        cancelled: false,
        failed: false,
        message: "Payment confirmed.",
        result,
      });
    }

    /**
     * ========================================================
     * MERCHANT NOT FOUND
     * ========================================================
     *
     * 4999 is a payment/configuration failure.
     *
     * It must NOT be treated as pending.
     */

    if (
      resultCode ===
      RESULT_MERCHANT_NOT_FOUND
    ) {
      console.error(
        "M-PESA MERCHANT NOT FOUND:",
        checkoutRequestID
      );

      console.error(
        "Safaricom ResultCode 4999:",
        resultDescription
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          resultDescription ||
          "M-PESA merchant could not be found. Verify the production merchant configuration.",
        result,
      });
    }

    /**
     * ========================================================
     * CUSTOMER CANCELLED
     * ========================================================
     */

    if (
      resultCode ===
      RESULT_CANCELLED
    ) {
      console.log(
        "M-PESA PAYMENT CANCELLED:",
        checkoutRequestID
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: true,
        failed: false,
        message:
          "Payment was cancelled by the customer.",
        result,
      });
    }

    /**
     * ========================================================
     * REQUEST TIMED OUT
     * ========================================================
     */

    if (
      resultCode ===
      RESULT_TIMEOUT
    ) {
      console.log(
        "M-PESA PAYMENT TIMED OUT:",
        checkoutRequestID
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          "M-PESA payment request timed out.",
        result,
      });
    }

    /**
     * ========================================================
     * OTHER SAFARICOM PAYMENT FAILURE
     * ========================================================
     *
     * Any non-zero ResultCode is NOT paid.
     */

    if (resultCode !== "") {
      console.error(
        "M-PESA PAYMENT FAILED:",
        JSON.stringify({
          checkoutRequestID,
          resultCode,
          resultDescription,
        })
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          resultDescription ||
          "M-PESA payment was not successful.",
        result,
      });
    }

    /**
     * ========================================================
     * EMPTY RESULT CODE
     * ========================================================
     *
     * We cannot confirm payment.
     * Allow the frontend to retry.
     */

    console.warn(
      "M-PESA returned an empty ResultCode:",
      checkoutRequestID
    );

    return jsonResponse({
      paid: false,
      pending: true,
      cancelled: false,
      failed: false,
      message:
        "M-PESA verification returned an incomplete response. Please retry.",
      result,
    });
  } catch (error) {
    /**
     * ========================================================
     * VERIFICATION/API ERROR
     * ========================================================
     *
     * We never return paid:true when verification itself
     * fails.
     */

    console.error(
      "M-PESA payment verification error:",
      error
    );

    return jsonResponse(
      {
        paid: false,
        pending: true,
        cancelled: false,
        failed: false,
        message:
          "Payment verification is temporarily unavailable. Please retry.",
      },
      200
    );
  }
});

/**
 * ============================================================
 * JSON RESPONSE HELPER
 * ============================================================
 */

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          "application/json",
      },
    }
  );
}
