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

    // Read body
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

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return failure("amount must be greater than zero.", 400);
    }

    // Normalize phone
    const customerPhone = normalizePhoneNumber(phoneNumber);

    // Generate timestamp/password
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    // OAuth token
    const accessToken = await getAccessToken();

    // Build payload
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

     // Send request
console.error("=== DEBUG ===");
console.error("Normalized Phone:", customerPhone);
console.error("Amount:", amount);
console.error("Rounded Amount:", Math.round(amount));
console.error("BusinessShortCode:", MPESA_SHORTCODE);
console.error("Payload:", JSON.stringify(stkPayload, null, 2));
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

    // Parse response
    let result: Record<string, unknown>;

    try {
      result = await response.json();
    } catch {
      return failure(
        "Invalid response received from Safaricom.",
        502
      );
    }

    // HTTP error
    if (!response.ok) {
      console.error("Safaricom Error:", result);

      return failure(
        String(
          result["errorMessage"] ??
          result["errorCode"] ??
          "Failed to initiate STK Push."
        ),
        response.status
      );
    }

    // Validate response
    const checkoutRequestID = result["CheckoutRequestID"];
    const merchantRequestID = result["MerchantRequestID"];

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

    // Success
    return success({
      merchantRequestID,
      checkoutRequestID,
      responseCode: result["ResponseCode"],
      responseDescription: result["ResponseDescription"],
      customerMessage: result["CustomerMessage"],
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
