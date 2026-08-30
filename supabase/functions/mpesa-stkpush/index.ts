import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_TRANSACTION_TYPE,
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

const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

/**
 * M-PESA STK Push
 *
 * Flow:
 *
 * 1. Receive phone number + amount from xnewsapp.com
 * 2. Validate the request
 * 3. Normalize the phone number
 * 4. Generate timestamp
 * 5. Generate STK password
 * 6. Obtain Safaricom OAuth token
 * 7. Send STK Push request to Safaricom
 * 8. Return the real Safaricom response
 *
 * IMPORTANT:
 *
 * This function only starts the payment.
 * Payment confirmation is handled separately by:
 *
 * - mpesa-status
 * - mpesa-callback
 */
serve(async (req: Request): Promise<Response> => {
  try {
    /**
     * ============================================================
     * CORS
     * ============================================================
     */
    if (req.method === "OPTIONS") {
      return success({ ok: true });
    }

    /**
     * ============================================================
     * METHOD CHECK
     * ============================================================
     */
    if (req.method !== "POST") {
      return failure("Method Not Allowed.", 405);
    }

    /**
     * ============================================================
     * READ REQUEST BODY
     * ============================================================
     */
    let body: {
      phoneNumber?: string;
      amount?: number;
    };

    try {
      body = await req.json();
    } catch {
      console.error(
        "M-PESA STK Push: Invalid JSON body."
      );

      return failure(
        "Invalid JSON body.",
        400
      );
    }

    const phoneNumber = body.phoneNumber;
    const amount = body.amount;

    /**
     * ============================================================
     * VALIDATE PHONE NUMBER
     * ============================================================
     */
    if (
      typeof phoneNumber !== "string" ||
      !phoneNumber.trim()
    ) {
      return failure(
        "phoneNumber is required.",
        400
      );
    }

    /**
     * ============================================================
     * VALIDATE AMOUNT
     * ============================================================
     *
     * M-PESA requires a whole-number KES amount.
     *
     * Examples:
     *
     * 9     -> 9 KES
     * 9.4   -> 9 KES
     * 9.6   -> 10 KES
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
     * ============================================================
     * NORMALIZE PHONE NUMBER
     * ============================================================
     */
    let customerPhone: string;

    try {
      customerPhone =
        normalizePhoneNumber(phoneNumber);
    } catch (error) {
      console.error(
        "M-PESA phone normalization error:",
        error
      );

      return failure(
        error instanceof Error
          ? error.message
          : "Invalid phone number.",
        400
      );
    }

    /**
     * ============================================================
     * CONVERT AMOUNT TO WHOLE KES
     * ============================================================
     */
    const amountToCharge =
      Math.max(1, Math.round(amount));

    /**
     * ============================================================
     * DIAGNOSTICS
     * ============================================================
     */
    console.log("=================================");
    console.log("M-PESA STK PUSH");
    console.log("=================================");

    console.log(
      "Environment:",
      Deno.env.get("MPESA_ENV")
    );

    console.log(
      "Base URL:",
      MPESA_BASE_URL
    );

    console.log(
      "Shortcode / Till:",
      MPESA_SHORTCODE
    );

    console.log(
      "Transaction Type:",
      MPESA_TRANSACTION_TYPE
    );

    console.log(
      "Phone:",
      customerPhone
    );

    console.log(
      "Incoming amount:",
      amount
    );

    console.log(
      "Incoming amount type:",
      typeof amount
    );

    console.log(
      "Amount charged:",
      amountToCharge
    );

    console.log("=================================");

    /**
     * ============================================================
     * GENERATE TIMESTAMP
     * ============================================================
     */
    const timestamp = generateTimestamp();

    /**
     * ============================================================
     * GENERATE STK PASSWORD
     * ============================================================
     *
     * Password:
     *
     * Base64(
     *   BusinessShortCode +
     *   Passkey +
     *   Timestamp
     * )
     */
    const password =
      generatePassword(timestamp);

    /**
     * ============================================================
     * GET SAFARICOM OAUTH ACCESS TOKEN
     * ============================================================
     */
    console.log(
      "Requesting M-PESA OAuth access token..."
    );

    const accessToken =
      await getAccessToken();

    if (!accessToken) {
      console.error(
        "M-PESA OAuth returned an empty access token."
      );

      return failure(
        "Unable to obtain M-PESA access token.",
        500
      );
    }

    console.log(
      "M-PESA OAuth access token obtained successfully."
    );

    /**
     * ============================================================
     * BUILD STK PUSH PAYLOAD
     * ============================================================
     *
     * 4798391 is a Safaricom Till.
     *
     * Therefore:
     *
     * CustomerBuyGoodsOnline
     */
    const stkPayload = {
      BusinessShortCode:
        MPESA_SHORTCODE,

      Password:
        password,

      Timestamp:
        timestamp,

      TransactionType:
        MPESA_TRANSACTION_TYPE,

      Amount:
        amountToCharge,

      PartyA:
        customerPhone,

      PartyB:
        MPESA_SHORTCODE,

      PhoneNumber:
        customerPhone,

      CallBackURL:
        CALLBACK_URL,

      AccountReference:
        "xnewsapp",

      TransactionDesc:
        "AI Content Generation",
    };

    /**
     * IMPORTANT:
     *
     * Do NOT log:
     *
     * - Password
     * - OAuth access token
     */
    console.log(
      "M-PESA STK payload:",
      JSON.stringify(
        {
          BusinessShortCode:
            stkPayload.BusinessShortCode,

          TransactionType:
            stkPayload.TransactionType,

          Amount:
            stkPayload.Amount,

          PartyA:
            stkPayload.PartyA,

          PartyB:
            stkPayload.PartyB,

          PhoneNumber:
            stkPayload.PhoneNumber,

          CallBackURL:
            stkPayload.CallBackURL,

          AccountReference:
            stkPayload.AccountReference,

          TransactionDesc:
            stkPayload.TransactionDesc,

          Timestamp:
            stkPayload.Timestamp,
        },
        null,
        2
      )
    );

    /**
     * ============================================================
     * SEND STK PUSH TO SAFARICOM
     * ============================================================
     */
    const stkUrl =
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

    console.log(
      "Sending STK Push to:",
      stkUrl
    );

    let response: Response;

    try {
      response = await fetch(
        stkUrl,
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
            JSON.stringify(stkPayload),
        }
      );
    } catch (error) {
      console.error(
        "M-PESA STK Push network error:",
        error
      );

      return failure(
        "Unable to connect to Safaricom STK Push service.",
        502
      );
    }

    /**
     * ============================================================
     * READ SAFARICOM RESPONSE
     * ============================================================
     */
    const responseText =
      await response.text();

    console.log(
      "Safaricom STK HTTP status:",
      response.status
    );

    console.log(
      "Safaricom STK response:",
      responseText || "(empty response)"
    );

    /**
     * ============================================================
     * HANDLE EMPTY RESPONSE
     * ============================================================
     */
    if (!responseText.trim()) {
      console.error(
        "Safaricom STK Push returned an empty response."
      );

      return failure(
        `Safaricom returned an empty response (HTTP ${response.status}).`,
        response.ok ? 500 : response.status
      );
    }

    /**
     * ============================================================
     * PARSE JSON
     * ============================================================
     */
    let data: Record<string, unknown>;

    try {
      data = JSON.parse(
        responseText
      );
    } catch {
      console.error(
        "Safaricom STK response was not valid JSON:",
        responseText
      );

      return failure(
        "Invalid response from Daraja.",
        502
      );
    }

    /**
     * ============================================================
     * HANDLE SAFARICOM HTTP ERROR
     * ============================================================
     */
    if (!response.ok) {
      console.error(
        "M-PESA STK Push HTTP error:",
        JSON.stringify(
          {
            status:
              response.status,

            statusText:
              response.statusText,

            response:
              data,
          },
          null,
          2
        )
      );

      const errorMessage =
        typeof data.errorMessage === "string"
          ? data.errorMessage
          : typeof data.ResponseDescription === "string"
            ? data.ResponseDescription
            : typeof data.errorCode === "string"
              ? data.errorCode
              : "Failed to send STK Push.";

      return failure(
        errorMessage,
        response.status
      );
    }

    /**
     * ============================================================
     * CHECK DARAJA RESPONSE CODE
     * ============================================================
     *
     * ResponseCode = "0"
     *
     * means Safaricom accepted the STK request.
     *
     * IMPORTANT:
     *
     * Accepted does NOT mean paid.
     *
     * Final payment confirmation must come from:
     *
     * - mpesa-status
     * - mpesa-callback
     */
    const responseCode =
      data.ResponseCode !== undefined
        ? String(data.ResponseCode)
        : "";

    if (
      responseCode &&
      responseCode !== "0"
    ) {
      console.error(
        "M-PESA STK Push rejected:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      const message =
        typeof data.ResponseDescription === "string"
          ? data.ResponseDescription
          : "M-PESA STK Push was rejected.";

      return failure(
        message,
        400
      );
    }

    /**
     * ============================================================
     * SUCCESS
     * ============================================================
     */
    console.log(
      "================================="
    );

    console.log(
      "✅ M-PESA STK PUSH ACCEPTED"
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
      "ResponseCode:",
      data.ResponseCode
    );

    console.log(
      "ResponseDescription:",
      data.ResponseDescription
    );

    console.log(
      "TransactionType:",
      MPESA_TRANSACTION_TYPE
    );

    console.log(
      "Shortcode / Till:",
      MPESA_SHORTCODE
    );

    console.log(
      "================================="
    );

    /**
     * Return the REAL Safaricom response.
     */
    return success(data);

  } catch (error) {
    /**
     * ============================================================
     * UNEXPECTED ERROR
     * ============================================================
     */
    console.error(
      "M-PESA STK Push Error:",
      error
    );

    return failure(
      error instanceof Error
        ? error.message
        : "Internal server error.",
      500
    );
  }
});
