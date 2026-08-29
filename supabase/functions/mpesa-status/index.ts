import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import { querySTKStatus } from "../_shared/mpesa-query.ts";

/**
 * Known Safaricom STK Push result codes.
 *
 * IMPORTANT:
 * ResultCode 0 is the ONLY code that can produce paid:true.
 */
const RESULT_SUCCESS = "0";
const RESULT_PENDING = "4999";
const RESULT_CANCELLED = "1032";
const RESULT_TIMEOUT = "1037";

/**
 * Safaricom may return other failure codes such as:
 *
 * 1    - insufficient funds
 * 2001 - wrong PIN
 *
 * We intentionally do not need to enumerate every failure code.
 * Anything other than the explicitly successful/pending/cancelled/
 * timeout states is treated as NOT PAID.
 */
serve(async (req: Request): Promise<Response> => {
  /**
   * CORS
   */
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  /**
   * Only POST is allowed.
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
     * Parse request body safely.
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

    console.log(
      "Checking M-PESA payment:",
      checkoutRequestID
    );

    /**
     * Ask Safaricom for the actual transaction status.
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
     * PAYMENT SUCCESS
     * ============================================================
     *
     * This is the ONLY place where paid:true is returned.
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
     * PAYMENT STILL PROCESSING
     * ============================================================
     */
    if (resultCode === RESULT_PENDING) {
      return jsonResponse({
        paid: false,
        pending: true,
        cancelled: false,
        failed: false,
        message:
          "Payment is still being processed.",
        result,
      });
    }

    /**
     * ============================================================
     * USER CANCELLED PAYMENT
     * ============================================================
     */
    if (resultCode === RESULT_CANCELLED) {
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
     * STK REQUEST TIMED OUT
     * ============================================================
     */
    if (resultCode === RESULT_TIMEOUT) {
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
     * ANY OTHER RESULT = NOT PAID
     * ============================================================
     *
     * This is deliberate.
     *
     * We do NOT guess that an unknown result means success.
     */
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
  } catch (error) {
    /**
     * ============================================================
     * VERIFICATION ERROR
     * ============================================================
     *
     * VERY IMPORTANT:
     *
     * A Safaricom/API/server error can NEVER produce paid:true.
     *
     * The frontend may retry the status check.
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
 * Standard JSON response helper.
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
