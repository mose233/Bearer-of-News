import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
} from "../_shared/env.ts";

serve(async (_req: Request): Promise<Response> => {
  try {
    // Never return credentials.
    const config = {
      baseUrl: MPESA_BASE_URL,
      hasConsumerKey: Boolean(MPESA_CONSUMER_KEY),
      consumerKeyLength: MPESA_CONSUMER_KEY.length,
      hasConsumerSecret: Boolean(MPESA_CONSUMER_SECRET),
      consumerSecretLength: MPESA_CONSUMER_SECRET.length,
    };

    if (!MPESA_BASE_URL) {
      return new Response(
        JSON.stringify({
          success: false,
          stage: "configuration",
          error: "MPESA_BASE_URL is empty.",
          config,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      return new Response(
        JSON.stringify({
          success: false,
          stage: "configuration",
          error: "Consumer Key or Consumer Secret is missing.",
          config,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const credentials = btoa(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    );

    const oauthUrl =
      `${MPESA_BASE_URL}/oauth/v1/generate` +
      "?grant_type=client_credentials";

    const response = await fetch(oauthUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();

    let parsedResponse: unknown = responseText;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // Keep raw response text.
    }

    return new Response(
      JSON.stringify({
        success: response.ok,
        stage: "safaricom_oauth",
        httpStatus: response.status,
        statusText: response.statusText,
        response: parsedResponse,
        config,
      }),
      {
        status: response.ok ? 200 : 502,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        stage: "oauth_request",
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
