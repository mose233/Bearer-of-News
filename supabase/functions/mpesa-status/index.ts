import { serve } from "https://deno.land/std/http/server.ts";

import { corsHeaders } from "../_shared/response.ts";
import { querySTKStatus } from "../_shared/mpesa-query.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { checkoutRequestID } = await req.json();

    if (!checkoutRequestID) {
      return new Response(
        JSON.stringify({
          paid: false,
          error: "Missing CheckoutRequestID",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await querySTKStatus(checkoutRequestID);

    const resultCode = String(result.ResultCode ?? "");

    // ✅ Payment successful
    if (resultCode === "0") {
      return new Response(
        JSON.stringify({
          paid: true,
          pending: false,
          cancelled: false,
          failed: false,
          result,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ Still processing
    if (resultCode === "4999") {
      return new Response(
        JSON.stringify({
          paid: false,
          pending: true,
          cancelled: false,
          failed: false,
          result,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ User cancelled
    if (resultCode === "1032") {
      return new Response(
        JSON.stringify({
          paid: false,
          pending: false,
          cancelled: true,
          failed: false,
          message: "Payment cancelled by user.",
          result,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ Request timed out
    if (resultCode === "1037") {
      return new Response(
        JSON.stringify({
          paid: false,
          pending: false,
          cancelled: false,
          failed: true,
          message: "Payment request timed out.",
          result,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ Any other failure
    return new Response(
      JSON.stringify({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
        message: result.ResultDesc ?? "Payment failed.",
        result,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        paid: false,
        pending: false,
        cancelled: false,
        failed: true,
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
