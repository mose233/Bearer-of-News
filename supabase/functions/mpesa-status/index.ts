import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/response.ts";

serve(async (req) => {
  // Handle CORS preflight requests
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

    // TODO:
    // Here we will later check whether the payment
    // has been completed with Safaricom.

    return new Response(
      JSON.stringify({
        paid: false,
        message: "Payment verification not implemented yet.",
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
