/**
 * M-PESA OAuth / Access Token helper.
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
 */

import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_ENV,
} from "./env.ts";

/**
 * Safaricom OAuth response.
 */
interface MpesaAccessTokenResponse {
  access_token?: string;
  expires_in?: string | number;
  [key: string]: unknown;
}

/**
 * Obtain a Safaricom M-PESA OAuth access token.
 *
 * The credentials are read exclusively from
 * Supabase Edge Function Secrets through env.ts.
 *
 * NEVER log:
 *
 * - Consumer Secret
 * - Consumer Key
 * - Authorization header
 * - Access Token
 */
export async function getAccessToken(): Promise<string> {
  /**
   * ============================================================
   * VALIDATE CREDENTIALS
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
   * OAUTH ENDPOINT
   * ============================================================
   *
   * Production:
   *
   * https://api.safaricom.co.ke/oauth/v1/generate
   *
   * Sandbox:
   *
   * https://sandbox.safaricom.co.ke/oauth/v1/generate
   */

  const url =
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  /**
   * ============================================================
   * CREATE BASIC AUTH HEADER
   * ============================================================
   *
   * Safaricom expects:
   *
   * Base64(
   *   ConsumerKey + ":" + ConsumerSecret
   * )
   */

  const credentials = btoa(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  );

  /**
   * ============================================================
   * SAFE DIAGNOSTICS
   * ============================================================
   *
   * We deliberately do NOT log credentials.
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
    "Endpoint:",
    url
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * REQUEST ACCESS TOKEN
   * ============================================================
   */

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
      }
    );
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA ACCESS TOKEN NETWORK ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Unable to connect to Safaricom OAuth service."
    );
  }

  /**
   * ============================================================
   * READ RESPONSE
   * ============================================================
   */

  const text =
    await response.text();

  if (!text.trim()) {
    console.error(
      "M-PESA OAuth returned an empty response.",
      {
        status: response.status,
        statusText: response.statusText,
      }
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

    /**
     * Do not log the response if it could
     * accidentally contain sensitive information.
     */

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
     * Log only safe response fields.
     *
     * Never log access_token.
     */

    console.error(
      "OAuth Response:",
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
      "M-PESA OAuth response did not contain an access token."
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

  console.log(
    "M-PESA access token obtained successfully."
  );

  if (data.expires_in !== undefined) {
    console.log(
      "M-PESA access token expires in:",
      data.expires_in
    );
  }

  /**
   * Return the token.
   *
   * IMPORTANT:
   * Do not log this value.
   */

  return data.access_token.trim();
}
