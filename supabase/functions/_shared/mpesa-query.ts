import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
} from "./env.ts";

import { getAccessToken } from "./mpesa.ts";
import {
  generatePassword,
  generateTimestamp,
} from "./mpesa-utils.ts";

/**
 * ============================================================
 * SAFARICOM STK QUERY
 * ============================================================
 *
 * Queries the status of an existing M-PESA STK Push transaction.
 *
 * The caller supplies ONLY the CheckoutRequestID.
 *
 * Merchant configuration is obtained server-side from env.ts.
 *
 * NEVER log or expose:
 * - Consumer Secret
 * - Passkey
 * - OAuth access token
 * - Generated password
 * - Authorization headers
 */

const MPESA_QUERY_TIMEOUT_MS = 15_000;

export async function querySTKStatus(
  checkoutRequestID: string,
): Promise<Record<string, unknown>> {
  /**
   * ==========================================================
   * VALIDATE CHECKOUT REQUEST ID
   * ==========================================================
   */

  const normalizedCheckoutRequestID =
    typeof checkoutRequestID === "string"
      ? checkoutRequestID.trim()
      : "";

  if (!normalizedCheckoutRequestID) {
    throw new Error(
      "CheckoutRequestID is required.",
    );
  }

  /**
   * ==========================================================
   * GET ACCESS TOKEN
   * ==========================================================
   */

  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error(
      "Failed to obtain M-PESA access token.",
    );
  }

  /**
   * ==========================================================
   * GENERATE STK QUERY CREDENTIALS
   * ==========================================================
   */

  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  /**
   * ==========================================================
   * BUILD REQUEST
   * ==========================================================
   */

  const url =
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

  const requestBody = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID:
      normalizedCheckoutRequestID,
  };

  /**
   * ==========================================================
   * REQUEST TIMEOUT
   * ==========================================================
   */

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, MPESA_QUERY_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Daraja STK Query request timed out.",
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    throw new Error(
      `Unable to reach Daraja STK Query API: ${message}`,
    );
  } finally {
    clearTimeout(timeout);
  }

  /**
   * ==========================================================
   * READ RESPONSE
   * ==========================================================
   */

  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      `Daraja returned an empty response (HTTP ${response.status}).`,
    );
  }

  /**
   * ==========================================================
   * PARSE JSON
   * ==========================================================
   */

  let data: Record<string, unknown>;

  try {
    const parsed: unknown = JSON.parse(text);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        "Response was not a JSON object.",
      );
    }

    data = parsed as Record<string, unknown>;
  } catch {
    throw new Error(
      `Daraja returned invalid JSON (HTTP ${response.status}).`,
    );
  }

  /**
   * ==========================================================
   * HANDLE HTTP ERRORS
   * ==========================================================
   *
   * Do not return an unsuccessful HTTP response as though it
   * were a valid M-PESA payment result.
   */

  if (!response.ok) {
    const responseCode =
      typeof data.ResponseCode === "string" ||
      typeof data.ResponseCode === "number"
        ? String(data.ResponseCode)
        : "";

    const responseDescription =
      typeof data.ResponseDescription === "string"
        ? data.ResponseDescription
        : "";

    const errorDetails =
      responseDescription ||
      responseCode ||
      "Unknown Daraja error.";

    throw new Error(
      `Daraja STK Query failed (HTTP ${response.status}): ${errorDetails}`,
    );
  }

  /**
   * ==========================================================
   * RETURN SAFARICOM RESULT
   * ==========================================================
   */

  return data;
}
