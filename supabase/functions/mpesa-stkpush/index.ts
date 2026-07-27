// TEST CHANGE
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { getAccessToken } from "../_shared/mpesa.ts";
import {
  success,
  failure,
  corsHeaders,
} from "../_shared/response.ts";
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method Not Allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

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

    console.log("===== MPESA STK PUSH DEBUG =====");
    console.log("Phone:", phoneNumber);
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

    if (!response.ok) {
      return new Response(
        JSON.stringify(result),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return success(result);
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
