import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_ENV,
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
} from "../_shared/env.ts";

serve(async () => {
  try {
    const diagnostics = {
      environment: MPESA_ENV || "MISSING",
      baseUrl: MPESA_BASE_URL || "MISSING",

      consumerKeyConfigured:
        MPESA_CONSUMER_KEY.length > 0,

      consumerSecretConfigured:
        MPESA_CONSUMER_SECRET.length > 0,

      shortcodeConfigured:
        MPESA_SHORTCODE.length > 0,

      shortcode:
        MPESA_SHORTCODE
          ? `***${MPESA_SHORTCODE.slice(-3)}`
          : "MISSING",
    };

    if (
      !MPESA_ENV ||
      !MPESA_BASE_URL ||
      !MPESA_CONSUMER_KEY ||
      !MPESA_CONSUMER_SECRET ||
      !MPESA_SHORTCODE
    ) {
      return Response.json(
        {
          success: false,
          stage: "configuration",
          diagnostics,
        },
        { status: 500 }
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

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          stage: "safaricom_oauth",
          diagnostics,
          oauthUrl,
          safaricomStatus: response.status,
          safaricomStatusText: response.statusText,
          safaricomResponse: responseText || "(empty response)",
        },
        { status: 500 }
      );
    }

    let data: {
      access_token?: string;
      expires_in?: string | number;
    };

    try {
      data = JSON.parse(responseText);
    } catch {
      return Response.json(
        {
          success: false,
          stage: "safaricom_oauth_json",
          diagnostics,
          safaricomStatus: response.status,
          safaricomResponse: responseText,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      stage: "safaricom_oauth",
      diagnostics,
      safaricomStatus: response.status,
      tokenReceived: Boolean(data.access_token),
      expiresIn: data.expires_in ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        stage: "unexpected_error",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
});
