import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
} from "../_shared/env.ts";

import { getAccessToken } from "../_shared/mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
  normalizePhoneNumber,
} from "../_shared/mpesa-utils.ts";

import {
  corsHeaders,
  success,
  failure,
} from "../_shared/response.ts";

const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

serve(async (req: Request): Promise<Response> => {
  try {
    /**
     * CORS Preflight
     */
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: corsHeaders,
      });
    }

    /**
     * Only POST is allowed
     */
    if (req.method !== "POST") {
      return failure("Method Not Allowed", 405);
    }

    /**
     * Parse request body
     */
    let body: {
      phoneNumber?: string;
      amount?: number;
    };

    try {
      body = await req.json();
    } catch {
      return failure("Invalid JSON body.", 400);
    }

    const { phoneNumber, amount } = body;

    if (!phoneNumber) {
      return failure("phoneNumber is required.", 400);
    }

    if (amount === undefined || amount === null) {
      return failure("amount is required.", 400);
    }

    if (typeof amount !== "number") {
      return failure("amount must be a number.", 400);
    }

    if (amount <= 0) {
      return failure("amount must be greater than zero.", 400);
    }

    /**
     * Normalize Kenyan phone number
     */
    const customerPhone = normalizePhoneNumber(phoneNumber);

    /**
     * Timestamp
     */
    const timestamp = generateTimestamp();

    /**
     * Password
     */
    const password = generatePassword(timestamp);

    /**
     * OAuth Token
     */
    const accessToken = await getAccessToken();
        /**
     * Build STK Push payload
     */
    const stkPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: customerPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: customerPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: "xnewsapp",
      TransactionDesc: "AI Content Generation",
    };

    /**
     * Send STK Push request
     */
    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    /**
     * Parse Safaricom response
     */
    const result = await response.json();

    /**
     * Handle HTTP errors
     */
    if (!response.ok) {
      return failure(
        result.errorMessage ??
          result.errorCode ??
          "Failed to initiate STK Push.",
        response.status
      );
    }

    /**
     * Handle missing CheckoutRequestID
     */
    if (!result.CheckoutRequestID) {
      return failure(
        "Safaricom did not return a CheckoutRequestID.",
        500
      );
    }
        /**
     * STK Push accepted by Safaricom
     *
     * The actual payment result will be delivered later
     * to mpesa-callback.
     */
    return success({
      merchantRequestID: result.MerchantRequestID,
      checkoutRequestID: result.CheckoutRequestID,
      responseCode: result.ResponseCode,
      responseDescription: result.ResponseDescription,
      customerMessage: result.CustomerMessage,
      phoneNumber: customerPhone,
      amount,
    });

  } catch (error) {
    console.error("M-Pesa STK Push Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error.";

    return failure(message, 500);
  }
});
    /**
     * Read Safaricom response safely
     */
    let result: Record<string, unknown>;

    try {
      result = await response.json();
    } catch {
      return failure(
        "Invalid response received from Safaricom.",
        502
      );
    }

    /**
     * Handle HTTP errors returned by Safaricom
     */
    if (!response.ok) {
      console.error("Safaricom Error:", result);

      return failure(
        String(
          result.errorMessage ??
          result.errorCode ??
          "Failed to initiate STK Push."
        ),
        response.status
      );
    }

    /**
     * Validate required response fields
     */
    const checkoutRequestID = result.CheckoutRequestID;
    const merchantRequestID = result.MerchantRequestID;

    if (
      typeof checkoutRequestID !== "string" ||
      typeof merchantRequestID !== "string"
    ) {
      console.error("Unexpected Safaricom Response:", result);

      return failure(
        "Safaricom returned an unexpected response.",
        502
      );
    }

    /**
     * Success
     *
     * Customer now receives the STK Push prompt.
     * Payment confirmation will arrive later
     * through mpesa-callback.
     */
    return success({
      merchantRequestID,
      checkoutRequestID,
      responseCode: result.ResponseCode,
      responseDescription: result.ResponseDescription,
      customerMessage: result.CustomerMessage,
      phoneNumber: customerPhone,
      amount,
    });

  } catch (error) {
    console.error("M-Pesa STK Push Error:", error);

    return failure(
      error instanceof Error
        ? error.message
        : "Internal server error.",
      500
    );
  }
});
