import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import { querySTKStatus } from "../_shared/mpesa-query.ts";

/**
 * Safaricom STK Push result codes.
 *
 * IMPORTANT:
 * ResultCode 0 is the ONLY result that can produce paid:true.
 *
 * 4999 MUST NOT be treated as pending.
 * In our live production response it is:
 *
 * "Merchant does not exist"
 *
 * Therefore it is a payment failure/configuration error.
 */
const RESULT_SUCCESS = "0";
const RESULT_CANCELLED = "1032";
const RESULT_TIMEOUT = "1037";
const RESULT_MERCHANT_NOT_FOUND = "4999";

/**
 * Safaricom can return many other failure codes.
 *
 * Examples:
 *
 * 1    - insufficient funds
 * 2001 - wrong PIN
 *
 * Anything other than ResultCode 0 is NOT paid.
 */
serve(async (req: Request): Promise<Response> => {
  /**
   * ============================================================
   * CORS
   * ============================================================
   */
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  /**
   * ============================================================
   * ONLY POST
   * ============================================================
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
     * ============================================================
     * PARSE REQUEST
     * ============================================================
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

    const checkoutRequestID =
      body.checkoutRequestID?.trim();

    if (!checkoutRequestID) {
      return jsonResponse(
        {
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message: "CheckoutRequestID is required.",
        },
        400
      );
    }

    console.log("=================================");
    console.log("M-PESA PAYMENT STATUS CHECK");
    console.log("CheckoutRequestID:", checkoutRequestID);
    console.log("=================================");

    /**
     * ============================================================
     * ASK SAFARICOM FOR STATUS
     * ============================================================
     */
    const result =
      await querySTKStatus(checkoutRequestID);

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
     * ============================================================
     * SUCCESS
     * ============================================================
     *
     * ONLY ResultCode 0 can produce paid:true.
     */
    if (resultCode === RESULT_SUCCESS) {
      console.log(
        "✅ M-PESA PAYMENT VERIFIED SUCCESSFULLY:",
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
     * ============================================================
     * MERCHANT DOES NOT EXIST
     * ============================================================
     *
     * IMPORTANT:
     *
     * 4999 is NOT a pending payment.
     *
     * Our production tests are returning:
     *
     * ResultCode: 4999
     * ResultDesc: Merchant does not exist
     *
     * Therefore we MUST stop polling and report failure.
     */
    if (resultCode === RESULT_MERCHANT_NOT_FOUND) {
      console.error(
        "❌ M-PESA MERCHANT NOT FOUND:",
        checkoutRequestID
      );

      console.error(
        "Safaricom returned ResultCode 4999:",
        resultDescription
      );

      return jsonResponse({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message:
          resultDescription ||
          "M-PESA merchant could not be found. Verify the production shortcode/Till provisioning.",
        result,
      });
    }

    /**
     * ============================================================
     * CUSTOMER CANCELLED
     * ============================================================
     */
    if (resultCode === RESULT_CANCELLED) {
      console.log(
        "❌ M-PESA PAYMENT CANCELLED:",
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
     * ============================================================
     * REQUEST TIMED OUT
     * ============================================================
     */
    if (resultCode === RESULT_TIMEOUT) {
      console.log(
        "❌ M-PESA PAYMENT TIMED OUT:",
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
     * ============================================================
     * OTHER SAFARICOM FAILURE
     * ============================================================
     *
     * Any known/unknown non-zero result is NOT PAID.
     */
    if (resultCode !== "") {
      console.error(
        "❌ M-PESA PAYMENT FAILED:",
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
     * ============================================================
     * UNEXPECTED EMPTY RESULT
     * ============================================================
     *
     * We do not mark this as paid.
     *
     * We return pending so the frontend can retry because
     * the verification response itself was incomplete.
     */
    console.warn(
      "⚠️ M-PESA returned an empty ResultCode:",
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
     * ============================================================
     * VERIFICATION/API ERROR
     * ============================================================
     *
     * This is different from a Safaricom payment failure.
     *
     * If our request to Safaricom itself fails, we allow the
     * frontend to retry.
     *
     * NEVER return paid:true here.
     */
    console.error(
      "❌ M-PESA payment verification error:",
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
        "Content-Type": "application/json",
      },
    }
  );
}
