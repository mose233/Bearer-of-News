import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_TRANSACTION_TYPE,
  validateMpesaConfig,
} from "../_shared/env.ts";

import { getAccessToken } from "../_shared/mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
  normalizePhoneNumber,
} from "../_shared/mpesa-utils.ts";

const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

/**
 * ============================================================
 * TEMPORARY M-PESA DIAGNOSTIC
 * ============================================================
 *
 * PURPOSE:
 *
 * Test the following production STK Push configuration:
 *
 * BusinessShortCode = 4320242
 * PartyB            = 4798391
 *
 * According to the Safaricom business information supplied
 * for xnewsapp.com:
 *
 * Store Number = 4460875
 * Till Number   = 4798391
 *
 * IMPORTANT:
 *
 * This function is temporary.
 *
 * It does NOT replace mpesa-stkpush.
 * It does NOT replace mpesa-status.
 * It does NOT perform STK Query.
 *
 * It ONLY allows us to test whether Safaricom accepts:
 *
 * BusinessShortCode = 4320242
 * PartyB            = 4798391
 *
 * Never log:
 *
 * - Consumer Secret
 * - Consumer Key
 * - Passkey
 * - OAuth access token
 * - STK password
 */

interface DiagnosticRequest {
  phoneNumber?: string;
  amount?: number;
}

serve(async (req: Request): Promise<Response> => {
  try {
    /**
     * ==========================================================
     * CORS
     * ==========================================================
     */

    if (req.method === "OPTIONS") {
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "authorization, x-client-info, apikey, content-type",
            "Access-Control-Allow-Methods":
              "POST, OPTIONS",
          },
        }
      );
    }

    /**
     * ==========================================================
     * ONLY POST
     * ==========================================================
     */

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method Not Allowed.",
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * ==========================================================
     * VALIDATE CONFIGURATION
     * ==========================================================
     */

    validateMpesaConfig();

    /**
     * ==========================================================
     * READ REQUEST
     * ==========================================================
     */

    let body: DiagnosticRequest;

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON body.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const phoneNumber =
      body.phoneNumber?.trim();

    const requestedAmount =
      body.amount;

    /**
     * ==========================================================
     * VALIDATE PHONE
     * ==========================================================
     */

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "phoneNumber is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * ==========================================================
     * VALIDATE AMOUNT
     * ==========================================================
     *
     * For safety, require an explicit amount.
     */

    if (
      typeof requestedAmount !== "number" ||
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "amount must be a positive number.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * M-PESA requires a whole KES amount.
     */

    const amount =
      Math.max(
        1,
        Math.round(requestedAmount)
      );

    /**
     * ==========================================================
     * NORMALIZE PHONE
     * ==========================================================
     */

    const customerPhone =
      normalizePhoneNumber(phoneNumber);

    /**
     * ==========================================================
     * TEST CONFIGURATION
     * ==========================================================
     *
     * IMPORTANT:
     *
     * We intentionally keep BusinessShortCode as the
     * STK Push credential:
     *
     *     4320242
     *
     * But we explicitly test the customer-facing Till:
     *
     *     4798391
     *
     * as PartyB.
     */

    const testBusinessShortCode =
      MPESA_SHORTCODE;

    const testTillNumber =
      "4798391";

    const testStoreNumber =
      "4460875";

    console.log(
      "================================="
    );

    console.log(
      "M-PESA DIAGNOSTIC TEST"
    );

    console.log(
      "================================="
    );

    console.log(
      "Environment:",
      Deno.env.get("MPESA_ENV") ?? "unknown"
    );

    console.log(
      "BusinessShortCode:",
      testBusinessShortCode
    );

    console.log(
      "PartyB / Till:",
      testTillNumber
    );

    console.log(
      "Store Number:",
      testStoreNumber
    );

    console.log(
      "TransactionType:",
      MPESA_TRANSACTION_TYPE
    );

    console.log(
      "Phone:",
      customerPhone
    );

    console.log(
      "Amount:",
      amount
    );

    console.log(
      "Callback URL:",
      CALLBACK_URL
    );

    console.log(
      "================================="
    );

    /**
     * ==========================================================
     * GENERATE TIMESTAMP
     * ==========================================================
     */

    const timestamp =
      generateTimestamp();

    /**
     * ==========================================================
     * GENERATE PASSWORD
     * ==========================================================
     *
     * IMPORTANT:
     *
     * We deliberately do not log this.
     */

    const password =
      generatePassword(timestamp);

    /**
     * ==========================================================
     * GET ACCESS TOKEN
     * ==========================================================
     */

    const accessToken =
      await getAccessToken();

    /**
     * ==========================================================
     * BUILD TEST PAYLOAD
     * ==========================================================
     */

    const payload = {
      BusinessShortCode:
        testBusinessShortCode,

      Password:
        password,

      Timestamp:
        timestamp,

      TransactionType:
        MPESA_TRANSACTION_TYPE,

      Amount:
        amount,

      PartyA:
        customerPhone,

      /**
       * IMPORTANT TEST:
       *
       * PartyB is deliberately set to the
       * Safaricom-confirmed Till Number.
       */
      PartyB:
        testTillNumber,

      PhoneNumber:
        customerPhone,

      CallBackURL:
        CALLBACK_URL,

      AccountReference:
        "xnewsapp-test",

      TransactionDesc:
        "xnewsapp diagnostic test",
    };

    /**
     * ==========================================================
     * SAFARICOM STK PUSH ENDPOINT
     * ==========================================================
     */

    const url =
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

    console.log(
      "Sending diagnostic STK Push..."
    );

    console.log(
      "Endpoint:",
      url
    );

    /**
     * ==========================================================
     * SEND REQUEST
     * ==========================================================
     */

    let response: Response;

    try {
      response =
        await fetch(
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
        "M-PESA DIAGNOSTIC NETWORK ERROR:",
        error
      );

      return new Response(
        JSON.stringify({
          success: false,
          test: {
            businessShortCode:
              testBusinessShortCode,

            partyB:
              testTillNumber,

            storeNumber:
              testStoreNumber,
          },

          error:
            "Unable to connect to Safaricom.",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * ==========================================================
     * READ RESPONSE
     * ==========================================================
     */

    const responseText =
      await response.text();

    console.log(
      "Safaricom HTTP Status:",
      response.status
    );

    /**
     * ==========================================================
     * EMPTY RESPONSE
     * ==========================================================
     */

    if (!responseText.trim()) {
      return new Response(
        JSON.stringify({
          success: false,

          test: {
            businessShortCode:
              testBusinessShortCode,

            partyB:
              testTillNumber,

            storeNumber:
              testStoreNumber,
          },

          httpStatus:
            response.status,

          error:
            "Safaricom returned an empty response.",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * ==========================================================
     * PARSE RESPONSE
     * ==========================================================
     */

    let data: Record<string, unknown>;

    try {
      data =
        JSON.parse(responseText);
    } catch {
      console.error(
        "Safaricom returned invalid JSON."
      );

      return new Response(
        JSON.stringify({
          success: false,

          test: {
            businessShortCode:
              testBusinessShortCode,

            partyB:
              testTillNumber,

            storeNumber:
              testStoreNumber,
          },

          httpStatus:
            response.status,

          error:
            "Safaricom returned invalid JSON.",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    /**
     * ==========================================================
     * SAFE RESPONSE EXTRACTION
     * ==========================================================
     */

    const responseCode =
      data.ResponseCode === undefined ||
      data.ResponseCode === null
        ? ""
        : String(data.ResponseCode);

    const responseDescription =
      typeof data.ResponseDescription ===
      "string"
        ? data.ResponseDescription
        : "";

    const merchantRequestID =
      typeof data.MerchantRequestID ===
      "string"
        ? data.MerchantRequestID
        : null;

    const checkoutRequestID =
      typeof data.CheckoutRequestID ===
      "string"
        ? data.CheckoutRequestID
        : null;

    const customerMessage =
      typeof data.CustomerMessage ===
      "string"
        ? data.CustomerMessage
        : "";

    /**
     * ==========================================================
     * SAFE LOGGING
     * ==========================================================
     *
     * We never log the original request payload because
     * it contains the generated STK password.
     */

    console.log(
      "================================="
    );

    console.log(
      "M-PESA DIAGNOSTIC RESPONSE"
    );

    console.log(
      "================================="
    );

    console.log(
      "HTTP Status:",
      response.status
    );

    console.log(
      "ResponseCode:",
      responseCode
    );

    console.log(
      "ResponseDescription:",
      responseDescription
    );

    console.log(
      "MerchantRequestID:",
      merchantRequestID
    );

    console.log(
      "CheckoutRequestID:",
      checkoutRequestID
    );

    console.log(
      "CustomerMessage:",
      customerMessage
    );

    console.log(
      "================================="
    );

    /**
     * ==========================================================
     * RETURN DIAGNOSTIC RESULT
     * ==========================================================
     */

    return new Response(
      JSON.stringify(
        {
          success:
            response.ok &&
            responseCode === "0",

          test: {
            businessShortCode:
              testBusinessShortCode,

            partyB:
              testTillNumber,

            storeNumber:
              testStoreNumber,

            transactionType:
              MPESA_TRANSACTION_TYPE,
          },

          safaricom: {
            httpStatus:
              response.status,

            responseCode,

            responseDescription,

            merchantRequestID,

            checkoutRequestID,

            customerMessage,
          },
        },
        null,
        2
      ),
      {
        status:
          response.ok
            ? 200
            : 502,

        headers: {
          "Content-Type":
            "application/json",

          "Access-Control-Allow-Origin":
            "*",
        },
      }
    );

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA DIAGNOSTIC UNEXPECTED ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return new Response(
      JSON.stringify({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json",

          "Access-Control-Allow-Origin":
            "*",
        },
      }
    );
  }
});
