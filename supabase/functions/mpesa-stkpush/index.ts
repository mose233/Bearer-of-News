```typescript
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_TRANSACTION_TYPE,
  validateMpesaConfig,
} from "../_shared/env.ts";

import { getAccessToken } from "../_shared/mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
  normalizePhoneNumber,
} from "../_shared/mpesa-utils.ts";

import {
  success,
  failure,
} from "../_shared/response.ts";

/**
 * ============================================================
 * M-PESA STK PUSH CALLBACK URL
 * ============================================================
 *
 * Safaricom sends the final transaction result asynchronously
 * to this HTTPS endpoint.
 *
 * IMPORTANT:
 *
 * ResponseCode 0 from the STK Push request only means that
 * Safaricom accepted the request for processing.
 *
 * The actual payment result comes later through the callback.
 */
const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

/**
 * ============================================================
 * M-PESA STK PUSH
 * ============================================================
 */
serve(async (req: Request): Promise<Response> => {
  try {
    /**
     * ==========================================================
     * CORS
     * ==========================================================
     */
    if (req.method === "OPTIONS") {
      return success({ ok: true });
    }

    /**
     * ==========================================================
     * ONLY POST
     * ==========================================================
     */
    if (req.method !== "POST") {
      return failure(
        "Method Not Allowed.",
        405
      );
    }

    /**
     * ==========================================================
     * VALIDATE M-PESA CONFIGURATION
     * ==========================================================
     *
     * This validates:
     *
     * - MPESA_ENV
     * - MPESA_CONSUMER_KEY
     * - MPESA_CONSUMER_SECRET
     * - MPESA_SHORTCODE
     * - MPESA_PASSKEY
     * - MPESA_TRANSACTION_TYPE
     *
     * No credentials are logged.
     */
    validateMpesaConfig();

    /**
     * ==========================================================
     * PARSE REQUEST BODY
     * ==========================================================
     */
    let body: {
      phoneNumber?: string;
      amount?: number;
    };

    try {
      body = await req.json();
    } catch {
      return failure(
        "Invalid JSON body.",
        400
      );
    }

    const {
      phoneNumber,
      amount,
    } = body;

    /**
     * ==========================================================
     * VALIDATE PHONE NUMBER
     * ==========================================================
     */
    if (!phoneNumber) {
      return failure(
        "phoneNumber is required.",
        400
      );
    }

    /**
     * ==========================================================
     * VALIDATE AMOUNT
     * ==========================================================
     *
     * M-PESA requires a positive whole-number KES amount.
     */
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return failure(
        "amount must be greater than zero.",
        400
      );
    }

    /**
     * ==========================================================
     * NORMALIZE PHONE NUMBER
     * ==========================================================
     *
     * Examples:
     *
     * +254716172432
     * 254716172432
     * 0716172432
     *
     * become:
     *
     * 254716172432
     */
    const customerPhone =
      normalizePhoneNumber(phoneNumber);

    /**
     * ==========================================================
     * NORMALIZE PAYMENT AMOUNT
     * ==========================================================
     *
     * M-PESA expects a whole-number amount.
     *
     * Example:
     *
     * 9.4 -> 9
     * 9.6 -> 10
     */
    const amountToCharge =
      Math.max(
        1,
        Math.round(amount)
      );

    /**
     * ==========================================================
     * SAFE REQUEST DIAGNOSTICS
     * ==========================================================
     *
     * Safe to log:
     *
     * - environment
     * - BusinessShortCode
     * - transaction type
     * - phone number
     * - amount
     * - callback URL
     *
     * NEVER log:
     *
     * - consumer secret
     * - passkey
     * - STK password
     * - OAuth access token
     */
    console.log(
      "================================="
    );

    console.log(
      "M-PESA STK PUSH REQUEST"
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
      MPESA_SHORTCODE
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
      amountToCharge
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
     *
     * Safaricom format:
     *
     * YYYYMMDDHHmmss
     */
    const timestamp =
      generateTimestamp();

    /**
     * ==========================================================
     * GENERATE STK PASSWORD
     * ==========================================================
     *
     * Safaricom formula:
     *
     * Base64(
     *   BusinessShortCode +
     *   Passkey +
     *   Timestamp
     * )
     *
     * generatePassword() reads the same
     * MPESA_SHORTCODE from _shared/env.ts.
     *
     * Therefore the shortcode used here and the shortcode
     * used to generate the password cannot accidentally differ.
     */
    const password =
      generatePassword(timestamp);

    /**
     * ==========================================================
     * GET SAFARICOM ACCESS TOKEN
     * ==========================================================
     */
    const accessToken =
      await getAccessToken();

    /**
     * ==========================================================
     * BUILD STK PUSH PAYLOAD
     * ==========================================================
     *
     * CURRENT PRODUCTION CONFIGURATION
     * ---------------------------------
     *
     * Daraja Production App shortcode:
     *
     *     4320242
     *
     * The actual value is NOT hard-coded here.
     *
     * It comes from:
     *
     *     MPESA_SHORTCODE
     *
     * which is loaded from Supabase Edge Function Secrets
     * through _shared/env.ts.
     *
     * Till Number:
     *
     *     4798391
     *
     * Organization Short Code / Store Number:
     *
     *     4460875
     *
     * IMPORTANT:
     *
     * We do NOT substitute either of those values into
     * BusinessShortCode here.
     *
     * The production Daraja shortcode configured for this
     * application is the value supplied by MPESA_SHORTCODE.
     */
    const stkPayload = {
      /**
       * Daraja production application shortcode.
       *
       * Expected from Supabase secret:
       *
       * MPESA_SHORTCODE=4320242
       */
      BusinessShortCode:
        MPESA_SHORTCODE,

      /**
       * Generated from:
       *
       * MPESA_SHORTCODE
       * +
       * MPESA_PASSKEY
       * +
       * Timestamp
       */
      Password:
        password,

      Timestamp:
        timestamp,

      /**
       * Expected production transaction type:
       *
       * CustomerBuyGoodsOnline
       */
      TransactionType:
        MPESA_TRANSACTION_TYPE,

      /**
       * Amount requested by customer.
       */
      Amount:
        amountToCharge,

      /**
       * Customer's M-PESA phone number.
       */
      PartyA:
        customerPhone,

      /**
       * Merchant shortcode associated with the
       * configured STK Push application.
       *
       * This deliberately uses the same configured
       * shortcode as BusinessShortCode.
       */
      PartyB:
        MPESA_SHORTCODE,

      /**
       * Customer's phone number.
       */
      PhoneNumber:
        customerPhone,

      /**
       * Safaricom callback endpoint.
       */
      CallBackURL:
        CALLBACK_URL,

      /**
       * Internal xnewsapp.com reference.
       */
      AccountReference:
        "xnewsapp",

      /**
       * Customer-facing transaction description.
       */
      TransactionDesc:
        "AI Content Generation",
    };

    /**
     * ==========================================================
     * SEND STK PUSH TO SAFARICOM
     * ==========================================================
     */
    const response =
      await fetch(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
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

          /**
           * IMPORTANT:
           *
           * Never log this payload because it contains
           * the generated STK password.
           */
          body:
            JSON.stringify(stkPayload),
        }
      );

    /**
     * ==========================================================
     * READ SAFARICOM RESPONSE
     * ==========================================================
     */
    const responseText =
      await response.text();

    console.log(
      "Daraja HTTP Status:",
      response.status
    );

    /**
     * ==========================================================
     * EMPTY RESPONSE
     * ==========================================================
     */
    if (!responseText.trim()) {
      console.error(
        "Daraja returned an empty response."
      );

      return failure(
        `Safaricom returned an empty response (HTTP ${response.status}).`,
        502
      );
    }

    /**
     * ==========================================================
     * PARSE SAFARICOM RESPONSE
     * ==========================================================
     */
    let data: Record<string, unknown>;

    try {
      data =
        JSON.parse(responseText);
    } catch {
      console.error(
        "Daraja returned invalid JSON."
      );

      return failure(
        "Invalid response from Safaricom.",
        502
      );
    }

    /**
     * ==========================================================
     * SAFARICOM HTTP ERROR
     * ==========================================================
     *
     * This means Safaricom rejected the HTTP/API request itself.
     */
    if (!response.ok) {
      console.error(
        "================================="
      );

      console.error(
        "DARaja STK PUSH HTTP ERROR"
      );

      console.error(
        "HTTP Status:",
        response.status
      );

      console.error(
        "Safaricom Response:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      console.error(
        "================================="
      );

      const errorMessage =
        typeof data.errorMessage === "string"
          ? data.errorMessage
          : typeof data.ResponseDescription === "string"
            ? data.ResponseDescription
            : "Failed to send STK Push.";

      return failure(
        errorMessage,
        response.status
      );
    }

    /**
     * ==========================================================
     * NORMALIZE RESPONSE CODE
     * ==========================================================
     */
    const responseCode =
      data.ResponseCode === undefined ||
      data.ResponseCode === null
        ? ""
        : String(data.ResponseCode);

    /**
     * ==========================================================
     * SAFARICOM APPLICATION RESPONSE
     * ==========================================================
     *
     * ResponseCode 0 means:
     *
     * Safaricom accepted the STK Push request.
     *
     * It does NOT mean:
     *
     * - customer entered PIN
     * - money was received
     * - payment succeeded
     *
     * The final result must come through the callback.
     */
    console.log(
      "================================="
    );

    console.log(
      "M-PESA STK PUSH RESPONSE"
    );

    console.log(
      "================================="
    );

    console.log(
      "ResponseCode:",
      responseCode
    );

    console.log(
      "ResponseDescription:",
      data.ResponseDescription
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
      "CustomerMessage:",
      data.CustomerMessage
    );

    console.log(
      "================================="
    );

    /**
     * ==========================================================
     * STK PUSH ACCEPTED
     * ==========================================================
     */
    if (responseCode === "0") {
      return success(data);
    }

    /**
     * ==========================================================
     * STK PUSH REJECTED
     * ==========================================================
     */
    const description =
      typeof data.ResponseDescription === "string"
        ? data.ResponseDescription
        : "Safaricom did not accept the STK Push request.";

    return failure(
      description,
      400
    );

  } catch (error) {
    /**
     * ==========================================================
     * UNEXPECTED ERROR
     * ==========================================================
     */
    console.error(
      "================================="
    );

    console.error(
      "M-PESA STK PUSH ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return failure(
      error instanceof Error
        ? error.message
        : "Internal server error.",
      500
    );
  }
});
```
