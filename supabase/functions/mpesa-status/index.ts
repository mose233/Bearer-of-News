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

    if (resultCode === "0") {
      return new Response(
        JSON.stringify({
          paid: true,
          pending: false,
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

    if (
      resultCode === "1032" ||
      resultCode === "1037" ||
      result.ResponseCode === "0"
    ) {
      return new Response(
        JSON.stringify({
          paid: false,
          pending: true,
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

    return new Response(
      JSON.stringify({
        paid: false,
        pending: false,
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
