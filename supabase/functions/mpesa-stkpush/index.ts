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
  success,
  failure,
} from "../_shared/response.ts";

const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

serve(async (req: Request): Promise<Response> => {
  try {
    // CORS
    if (req.method === "OPTIONS") {
      return success({ ok: true });
    }

    // Only POST
    if (req.method !== "POST") {
      return failure("Method Not Allowed", 405);
    }

    // Read request body
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

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return failure("amount must be greater than zero.", 400);
    }

    // Normalize phone
    const customerPhone = normalizePhoneNumber(phoneNumber);

    // Generate timestamp/password
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    // Verify OAuth still works
    const accessToken = await getAccessToken();

    // Build STK payload
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

    // TEMPORARY DEBUG RESPONSE
    return success({
      debug: true,
      customerPhone,
      amount,
      roundedAmount: Math.round(amount),
      businessShortCode: MPESA_SHORTCODE,
      baseUrl: MPESA_BASE_URL,
      accessTokenReceived: !!accessToken,
      payload: stkPayload,
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
