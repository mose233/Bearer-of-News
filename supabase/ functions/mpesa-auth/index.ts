import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async () => {
  try {
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const environment = Deno.env.get("MPESA_ENV") ?? "sandbox";

    if (!consumerKey || !consumerSecret) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing M-Pesa credentials."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const credentials = btoa(`${consumerKey}:${consumerSecret}`);

    const baseUrl =
      environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    const response = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${credentials}`
        }
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        token: data.access_token,
        expires_in: data.expires_in
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
});
