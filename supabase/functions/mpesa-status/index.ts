import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
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
            "Content-Type": "application/json",
          },
        }
      );
    }

    // TODO:
    // Here we will later check whether the payment
    // has been completed.

    return new Response(
      JSON.stringify({
        paid: false,
        message: "Payment verification not implemented yet.",
      }),
      {
        headers: {
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
          "Content-Type": "application/json",
        },
      }
    );
  }
});
