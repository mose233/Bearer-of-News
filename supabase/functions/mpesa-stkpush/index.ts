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
    // Handle CORS
    if (req.method === "OPTIONS") {
      return success({ ok: true });
    }

    // Only allow POST
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

    // Normalize phone number
    const customerPhone = normalizePhoneNumber(phoneNumber);

    // Generate timestamp & password
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

   // Get OAuth token
const accessToken = await getAccessToken();

console.log("Incoming payment amount:", amount);
console.log("Incoming payment type:", typeof amount);

// Ensure minimum payment is 1 KES
const amountToCharge = Math.max(1, Math.round(amount));

console.log("Amount to charge:", amountToCharge);

// Build STK Push payload
const stkPayload = {
  BusinessShortCode: MPESA_SHORTCODE,
  Password: password,
  Timestamp: timestamp,
  TransactionType: "CustomerPayBillOnline",
  Amount: amountToCharge,
  PartyA: customerPhone,
  PartyB: MPESA_SHORTCODE,
  PhoneNumber: customerPhone,
  CallBackURL: CALLBACK_URL,
  AccountReference: "xnewsapp",
  TransactionDesc: "AI Content Generation",
};

console.log("STK Payload:", JSON.stringify(stkPayload, null, 2));

    console.log(
      "STK Payload:",
      JSON.stringify(stkPayload, null, 2)
    );

    // Send STK Push request
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

    const responseText = await response.text();

    console.log("Daraja Status:", response.status);
    console.log("Daraja Response:", responseText);

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      return failure("Invalid response from Daraja.", 500);
    }

    if (!response.ok) {
      console.error("Daraja Error:", data);

      return failure(
        data.errorMessage ??
          data.ResponseDescription ??
          "Failed to send STK Push.",
        response.status
      );
    }

    // Return the REAL Daraja response
    return success(data);

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
