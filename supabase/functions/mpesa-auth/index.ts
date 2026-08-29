import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_ENV,
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
} from "../_shared/env.ts";

serve(async (_req: Request): Promise<Response> => {
  try {
    const credentials = btoa(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    );

    const url =
      `${MPESA_BASE_URL}/oauth/v1/generate` +
      "?grant_type=client_credentials";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();

    console.log("========== MPESA OAUTH DIAGNOSTIC ==========");
    console.log("Environment:", MPESA_ENV);
    console.log("Base URL:", MPESA_BASE_URL);
    console.log(
      "Consumer Key present:",
      Boolean(MPESA_CONSUMER_KEY)
    );
    console.log(
      "Consumer Key length:",
      MPESA_CONSUMER_KEY.length
    );
    console.log(
      "Consumer Secret present:",
      Boolean(MPESA_CONSUMER_SECRET)
    );
    console.log(
      "Consumer Secret length:",
      MPESA_CONSUMER_SECRET.length
    );
    console.log("OAuth URL:", url);
    console.log("HTTP status:", response.status);
    console.log("Status text:", response.statusText);
    console.log("Response:", responseText);
    console.log("============================================");

    return new Response(
      JSON.stringify({
        success: response.ok,
        environment: MPESA_ENV,
        baseUrl: MPESA_BASE_URL,
        consumerKeyPresent: Boolean(MPESA_CONSUMER_KEY),
        consumerKeyLength: MPESA_CONSUMER_KEY.length,
        consumerSecretPresent: Boolean(MPESA_CONSUMER_SECRET),
        consumerSecretLength: MPESA_CONSUMER_SECRET.length,
        httpStatus: response.status,
        statusText: response.statusText,
        response: responseText,
      }),
      {
        status: response.ok ? 200 : 502,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("OAuth diagnostic error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
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
