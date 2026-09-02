import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_TILL_NUMBER,
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
 * CALLBACK URL
 * ============================================================
 *
 * Safaricom will send the final STK transaction result here.
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
     * This is important because it prevents an incorrect
     * shortcode/environment combination from reaching
     * Safaricom.
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
     * Example:
     *
     * +254716172432
     *
     * becomes:
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
     * M-PESA requires a whole-number KES amount.
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
     */
    const timestamp =
      generateTimestamp();

    /**
     * ==========================================================
     * GENERATE STK PASSWORD
     * ==========================================================
     *
     * The password is generated from:
     *
     * BusinessShortCode
     * +
     * Passkey
     * +
     * Timestamp
     *
     * IMPORTANT:
     *
     * Never log this password.
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
     * For the current xnewsapp.com production configuration:
     *
     * BusinessShortCode = 4320242
     *
     * TransactionType =
     * CustomerBuyGoodsOnline
     *
     * PartyA =
     * customer's phone
     *
     * PartyB =
     * merchant Till Number (4798391)
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
        MPESA_TILL_NUMBER,

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
     * NEVER log the request payload.
     *
     * It contains the generated STK password.
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
     * PARSE RESPONSE
     * ==========================================================
     */
    let data: Record<string, unknown>;

    try {
      data =
        JSON.parse(responseText);
    } catch {
      console.error(
        "Daraja returned invalid JSON:",
        responseText
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
     */
    if (!response.ok) {
      console.error(
        "Daraja STK Push HTTP error:",
        JSON.stringify(data)
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
     * SAFARICOM APPLICATION RESPONSE
     * ==========================================================
     *
     * ResponseCode 0 means:
     *
     * Safaricom accepted the STK Push request.
     *
     * It does NOT mean the customer has paid yet.
     */
    const responseCode =
      data.ResponseCode === undefined ||
      data.ResponseCode === null
        ? ""
        : String(data.ResponseCode);

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
