import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import {
  MPESA_BASE_URL,
  MPESA_PASSKEY,
} from "../_shared/env.ts";
import { getAccessToken } from "../_shared/mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
} from "../_shared/mpesa-utils.ts";

/**
 * ============================================================
 * TEMPORARY M-PESA STK QUERY DIAGNOSTIC
 * ============================================================
 *
 * PURPOSE:
 *
 * Test which BusinessShortCode Safaricom associates with
 * the supplied CheckoutRequestID.
 *
 * CURRENT NUMBERS WE ARE TESTING:
 *
 * 4320242 = STK Push Business Short Code
 * 4798391 = Till Number
 * 4460875 = Business Till Store Number
 *
 * IMPORTANT:
 *
 * This function is diagnostic only.
 *
 * It does NOT:
 *
 * - initiate a payment
 * - mark a payment as paid
 * - modify the database
 * - modify the STK Push function
 *
 * It only sends an STK Push Query request to Safaricom.
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
        success: false,
        error: "Method Not Allowed.",
      },
      405
    );
  }

  try {
    /**
     * ========================================================
     * PARSE REQUEST
     * ========================================================
     *
     * Example:
     *
     * {
     *   "checkoutRequestID": "ws_CO_...",
     *   "businessShortCode": "4320242"
     * }
     */

    let body: {
      checkoutRequestID?: string;
      businessShortCode?: string;
    };

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        400
      );
    }

    const checkoutRequestID =
      body.checkoutRequestID?.trim();

    const businessShortCode =
      body.businessShortCode?.trim();

    /**
     * ========================================================
     * VALIDATE CHECKOUT REQUEST ID
     * ========================================================
     */

    if (!checkoutRequestID) {
      return jsonResponse(
        {
          success: false,
          error:
            "checkoutRequestID is required.",
        },
        400
      );
    }

    /**
     * ========================================================
     * VALIDATE BUSINESS SHORT CODE
     * ========================================================
     */

    if (!businessShortCode) {
      return jsonResponse(
        {
          success: false,
          error:
            "businessShortCode is required.",
        },
        400
      );
    }

    /**
     * ========================================================
     * ALLOW ONLY OUR THREE KNOWN NUMBERS
     * ========================================================
     *
     * This prevents accidentally testing arbitrary
     * merchant numbers.
     */

    const allowedNumbers = [
      "4320242",
      "4798391",
      "4460875",
    ];

    if (!allowedNumbers.includes(businessShortCode)) {
      return jsonResponse(
        {
          success: false,
          error:
            "For this diagnostic, businessShortCode must be 4320242, 4798391, or 4460875.",
        },
        400
      );
    }

    /**
     * ========================================================
     * LOG SAFE DIAGNOSTIC INFORMATION
     * ========================================================
     */

    console.log(
      "================================="
    );

    console.log(
      "TEMPORARY M-PESA STK QUERY TEST"
    );

    console.log(
      "================================="
    );

    console.log(
      "BusinessShortCode:",
      businessShortCode
    );

    console.log(
      "CheckoutRequestID:",
      checkoutRequestID
    );

    console.log(
      "Environment:",
      Deno.env.get("MPESA_ENV") ??
        "unknown"
    );

    console.log(
      "Base URL:",
      MPESA_BASE_URL
    );

    /**
     * ========================================================
     * VALIDATE REQUIRED SECRETS
     * ========================================================
     */

    if (!MPESA_BASE_URL) {
      throw new Error(
        "MPESA_BASE_URL is not configured."
      );
    }

    if (!MPESA_PASSKEY) {
      throw new Error(
        "MPESA_PASSKEY is not configured."
      );
    }

    /**
     * ========================================================
     * GET ACCESS TOKEN
     * ========================================================
     */

    const accessToken =
      await getAccessToken();

    /**
     * ========================================================
     * GENERATE TIMESTAMP
     * ========================================================
     */

    const timestamp =
      generateTimestamp();

    /**
     * ========================================================
     * GENERATE PASSWORD
     * ========================================================
     *
     * IMPORTANT:
     *
     * We deliberately use the BusinessShortCode being tested.
     *
     * However, the Passkey remains the current Supabase
     * MPESA_PASSKEY secret.
     *
     * Therefore, if Safaricom rejects a number because the
     * passkey does not belong to that shortcode, that result
     * is itself useful diagnostic information.
     */

    const password =
      btoa(
        `${businessShortCode}${MPESA_PASSKEY}${timestamp}`
      );

    /**
     * ========================================================
     * BUILD SAFARICOM QUERY
     * ========================================================
     */

    const payload = {
      BusinessShortCode:
        businessShortCode,

      Password:
        password,

      Timestamp:
        timestamp,

      CheckoutRequestID:
        checkoutRequestID,
    };

    const url =
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

    console.log(
      "Query endpoint:",
      url
    );

    /**
     * IMPORTANT:
     *
     * Never log payload.
     *
     * It contains the generated password.
     */

    /**
     * ========================================================
     * SEND REQUEST
     * ========================================================
     */

    let response: Response;

    try {
      response = await fetch(
        url,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );
    } catch (error) {
      console.error(
        "M-PESA diagnostic network error:",
        error
      );

      return jsonResponse(
        {
          success: false,
          businessShortCode,
          checkoutRequestID,
          error:
            "Unable to connect to Safaricom.",
        },
        502
      );
    }

    /**
     * ========================================================
     * READ RESPONSE
     * ========================================================
     */

    const text =
      await response.text();

    console.log(
      "Safaricom HTTP Status:",
      response.status
    );

    /**
     * ========================================================
     * EMPTY RESPONSE
     * ========================================================
     */

    if (!text.trim()) {
      return jsonResponse(
        {
          success: false,
          businessShortCode,
          checkoutRequestID,
          httpStatus:
            response.status,
          error:
            "Safaricom returned an empty response.",
        },
        502
      );
    }

    /**
     * ========================================================
     * PARSE SAFARICOM RESPONSE
     * ========================================================
     */

    let data: Record<
      string,
      unknown
    >;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        "Safaricom returned invalid JSON."
      );

      return jsonResponse(
        {
          success: false,
          businessShortCode,
          checkoutRequestID,
          httpStatus:
            response.status,
          error:
            "Safaricom returned invalid JSON.",
        },
        502
      );
    }

    /**
     * ========================================================
     * LOG RESPONSE
     * ========================================================
     *
     * The Safaricom response does not contain our passkey
     * or access token, so it is useful for diagnostics.
     */

    console.log(
      "================================="
    );

    console.log(
      "M-PESA DIAGNOSTIC RESULT"
    );

    console.log(
      "================================="
    );

    console.log(
      "Tested BusinessShortCode:",
      businessShortCode
    );

    console.log(
      "HTTP Status:",
      response.status
    );

    console.log(
      "ResponseCode:",
      data.ResponseCode
    );

    console.log(
      "ResponseDescription:",
      data.ResponseDescription
    );

    console.log(
      "ResultCode:",
      data.ResultCode
    );

    console.log(
      "ResultDesc:",
      data.ResultDesc
    );

    console.log(
      "MerchantRequestID:",
      data.MerchantRequestID
    );

    console.log(
      "CheckoutRequestID:",
      data.CheckoutRequestID
    );

    console.log(
      "================================="
    );

    /**
     * ========================================================
     * RETURN DIAGNOSTIC RESULT
     * ========================================================
     */

    return jsonResponse({
      success: response.ok,

      testedBusinessShortCode:
        businessShortCode,

      checkoutRequestID,

      httpStatus:
        response.status,

      safaricomResponse:
        data,

      interpretation:
        interpretResult(data),
    });
  } catch (error) {
    /**
     * ========================================================
     * UNEXPECTED ERROR
     * ========================================================
     */

    console.error(
      "================================="
    );

    console.error(
      "M-PESA DIAGNOSTIC ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      500
    );
  }
});

/**
 * ============================================================
 * INTERPRET SAFARICOM RESPONSE
 * ============================================================
 */

function interpretResult(
  data: Record<string, unknown>
): string {
  const responseCode =
    data.ResponseCode === undefined ||
    data.ResponseCode === null
      ? ""
      : String(data.ResponseCode);

  const resultCode =
    data.ResultCode === undefined ||
    data.ResultCode === null
      ? ""
      : String(data.ResultCode);

  const description =
    typeof data.ResponseDescription ===
    "string"
      ? data.ResponseDescription
      : "";

  const resultDescription =
    typeof data.ResultDesc ===
    "string"
      ? data.ResultDesc
      : "";

  /**
   * Safaricom accepted the query request.
   */

  if (responseCode === "0") {
    if (resultCode === "0") {
      return "Safaricom accepted this BusinessShortCode and the transaction ResultCode is SUCCESS (0).";
    }

    return (
      "Safaricom accepted this BusinessShortCode for the query. " +
      `ResultCode=${resultCode || "empty"}. ` +
      `${resultDescription}`
    ).trim();
  }

  /**
   * Agent/store mismatch.
   */

  if (
    description
      .toLowerCase()
      .includes("agent number") ||
    description
      .toLowerCase()
      .includes("store number")
  ) {
    return (
      "Safaricom rejected this BusinessShortCode because " +
      "the Agent Number and Store Number do not match."
    );
  }

  /**
   * Generic response.
   */

  return (
    description ||
    resultDescription ||
    "Safaricom rejected or did not complete the query."
  );
}

/**
 * ============================================================
 * JSON RESPONSE
 * ============================================================
 */

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
): Response {
  return new Response(
    JSON.stringify(body, null, 2),
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
