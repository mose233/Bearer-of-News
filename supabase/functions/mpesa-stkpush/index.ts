import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { getAccessToken } from "../_shared/mpesa.ts";
import { success, failure } from "../_shared/response.ts";
import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
} from "../_shared/env.ts";

function generateTimestamp(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

serve(async (req) => {
  try {
    const body = await req.json();

    const {
      phoneNumber,
      amount,
      accountReference = "xnewsapp",
      transactionDesc = "AI Generation",
    } = body;

    if (!phoneNumber) {
      return failure("phoneNumber is required.", 400);
    }

    if (!amount || Number(amount) <= 0) {
      return failure("amount must be greater than zero.", 400);
    }

    const accessToken = await getAccessToken();

    const timestamp = generateTimestamp();

    const password = btoa(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    );

    // Debug information (does not expose secrets)
    console.log("===== MPESA STK PUSH DEBUG =====");
    console.log("Base URL:", MPESA_BASE_URL);
    console.log("BusinessShortCode:", MPESA_SHORTCODE);
    console.log("Timestamp:", timestamp);
    console.log("Passkey Present:", MPESA_PASSKEY.length > 0);
    console.log("PhoneNumber:", phoneNumber);
    console.log("Amount:", amount);

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL:
        "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback",
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("===== SAFARICOM RESPONSE =====");
    console.log(JSON.stringify(result, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify(
          {
            success: false,
            status: response.status,
            safaricom: result,
          },
          null,
          2
        ),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return success(result);
  } catch (error) {
    console.error("===== ERROR =====");
    console.error(error);

    return failure(
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
});
