/**
 * M-PESA OAuth / Access Token helper.
 *
 * xnewsapp.com
 *
 * This file is responsible ONLY for obtaining
 * a Safaricom OAuth access token.
 *
 * It does NOT:
 *
 * - initiate STK Push
 * - query STK status
 * - process payments
 * - interpret ResultCode
 *
 * Those responsibilities belong to their
 * respective modules.
 *
 * IMPORTANT:
 *
 * All M-PESA credentials come from Supabase
 * Edge Function Secrets through env.ts.
 *
 * NEVER put credentials directly in this file.
 */

import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_ENV,
  validateMpesaConfig,
} from "./env.ts";

/**
 * Safaricom OAuth response.
 */
interface MpesaAccessTokenResponse {
  access_token?: string;
  expires_in?: string | number;
  error?: string;
  error_description?: string;
  errorCode?: string | number;
  [key: string]: unknown;
}

/**
 * Obtain a Safaricom M-PESA OAuth access token.
 *
 * Production:
 * https://api.safaricom.co.ke/oauth/v1/generate
 *
 * Sandbox:
 * https://sandbox.safaricom.co.ke/oauth/v1/generate
 *
 * The base URL is selected by env.ts.
 *
 * NEVER log:
 *
 * - Consumer Key
 * - Consumer Secret
 * - Authorization header
 * - Access Token
 */
export async function getAccessToken(): Promise<string> {
  /**
   * ============================================================
   * VALIDATE M-PESA CONFIGURATION
   * ============================================================
   */

  validateMpesaConfig();

  /**
   * ============================================================
   * EXTRA OAUTH VALIDATION
   * ============================================================
   */

  if (!MPESA_CONSUMER_KEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_KEY is missing."
    );
  }

  if (!MPESA_CONSUMER_SECRET) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_SECRET is missing."
    );
  }

  if (!MPESA_BASE_URL) {
    throw new Error(
      "M-PESA configuration error: MPESA_BASE_URL is missing."
    );
  }

  if (!MPESA_ENV) {
    throw new Error(
      "M-PESA configuration error: MPESA_ENV is missing."
    );
  }

  /**
   * ============================================================
   * BUILD OAUTH ENDPOINT
   * ============================================================
   */

  const url =
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  /**
   * ============================================================
   * CREATE BASIC AUTH CREDENTIALS
   * ============================================================
   *
   * Safaricom OAuth expects:
   *
   * Authorization:
   * Basic Base64(ConsumerKey:ConsumerSecret)
   *
   * The encoded credentials are sensitive.
   * They are never logged.
   */

  const credentials = btoa(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  );

  /**
   * ============================================================
   * SAFE DIAGNOSTICS
   * ============================================================
   */

  console.log(
    "================================="
  );

  console.log(
    "M-PESA ACCESS TOKEN REQUEST"
  );

  console.log(
    "================================="
  );

  console.log(
    "Environment:",
    MPESA_ENV
  );

  console.log(
    "Base URL:",
    MPESA_BASE_URL
  );

  console.log(
    "OAuth grant type:",
    "client_credentials"
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * REQUEST ACCESS TOKEN
   * ============================================================
   *
   * Use a timeout so a stalled Safaricom connection
   * cannot leave the Edge Function hanging indefinitely.
   */

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15_000);

  let response: Response;

  try {
    response = await fetch(
      url,
      {
        method: "GET",

        headers: {
          Authorization:
            `Basic ${credentials}`,

          Accept:
            "application/json",
        },

        signal:
          controller.signal,
      }
    );
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.error(
        "M-PESA ACCESS TOKEN TIMEOUT"
      );

      throw new Error(
        "Safaricom OAuth request timed out."
      );
    }

    console.error(
      "================================="
    );

    console.error(
      "M-PESA ACCESS TOKEN NETWORK ERROR"
    );

    console.error(
      "Unable to connect to Safaricom OAuth service."
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Unable to connect to Safaricom OAuth service."
    );
  } finally {
    clearTimeout(timeout);
  }

  /**
   * ============================================================
   * READ RESPONSE
   * ============================================================
   */

  const text =
    await response.text();

  /**
   * ============================================================
   * EMPTY RESPONSE
   * ============================================================
   */

  if (!text.trim()) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA OAUTH EMPTY RESPONSE"
    );

    console.error(
      "HTTP Status:",
      response.status
    );

    console.error(
      "HTTP Status Text:",
      response.statusText
    );

    console.error(
      "================================="
    );

    throw new Error(
      `Safaricom OAuth returned an empty response (HTTP ${response.status}).`
    );
  }

  /**
   * ============================================================
   * PARSE JSON
   * ============================================================
   */

  let data: MpesaAccessTokenResponse;

  try {
    data =
      JSON.parse(text);
  } catch {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA OAUTH INVALID JSON"
    );

    console.error(
      "HTTP Status:",
      response.status
    );

    console.error(
      "Response was not valid JSON."
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Safaricom OAuth returned invalid JSON."
    );
  }

  /**
   * ============================================================
   * HTTP ERROR
   * ============================================================
   */

  if (!response.ok) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA OAUTH HTTP ERROR"
    );

    console.error(
      "HTTP Status:",
      response.status
    );

    console.error(
      "HTTP Status Text:",
      response.statusText
    );

    /**
     * Only safe OAuth error fields are logged.
     *
     * NEVER log:
     *
     * - access_token
     * - Consumer Secret
     * - Authorization header
     */

    console.error(
      "OAuth Error:",
      JSON.stringify({
        error:
          data.error,

        error_description:
          data.error_description,

        errorCode:
          data.errorCode,
      })
    );

    console.error(
      "================================="
    );

    throw new Error(
      `Safaricom OAuth failed with HTTP ${response.status}.`
    );
  }

  /**
   * ============================================================
   * VALIDATE ACCESS TOKEN
   * ============================================================
   */

  if (
    typeof data.access_token !== "string" ||
    !data.access_token.trim()
  ) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA OAUTH TOKEN MISSING"
    );

    console.error(
      "Safaricom returned HTTP 200 but no access token."
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Access token missing from M-Pesa response."
    );
  }

  /**
   * ============================================================
   * TOKEN SUCCESS
   * ============================================================
   */

  const accessToken =
    data.access_token.trim();

  console.log(
    "================================="
  );

  console.log(
    "M-PESA ACCESS TOKEN SUCCESS"
  );

  console.log(
    "M-PESA access token obtained successfully."
  );

  if (
    data.expires_in !== undefined
  ) {
    console.log(
      "M-PESA access token expires in:",
      data.expires_in
    );
  }

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * RETURN TOKEN
   * ============================================================
   *
   * IMPORTANT:
   *
   * Never log this value.
   */

  return accessToken;
}
