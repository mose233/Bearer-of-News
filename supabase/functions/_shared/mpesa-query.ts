import {
  MPESA_BASE_URL,
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
  validateMpesaConfig,
} from "./env.ts";

import { getAccessToken } from "./mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
} from "./mpesa-utils.ts";

/**
 * Safaricom STK Push Query response.
 *
 * IMPORTANT:
 * ResultCode describes the actual transaction result.
 *
 * ResponseCode "0" only means Safaricom accepted
 * the STK Query request.
 */
export interface MpesaSTKQueryResponse {
  ResponseCode?: string | number;
  ResponseDescription?: string;

  MerchantRequestID?: string;
  CheckoutRequestID?: string;

  ResultCode?: string | number;
  ResultDesc?: string;

  [key: string]: unknown;
}

/**
 * Query Safaricom for the status of an STK Push transaction.
 *
 * This function ONLY communicates with Safaricom.
 *
 * It does NOT decide whether a payment is:
 *
 * - paid
 * - pending
 * - cancelled
 * - failed
 *
 * That decision is made by mpesa-status.
 */
export async function querySTKStatus(
  checkoutRequestID: string
): Promise<MpesaSTKQueryResponse> {
  /**
   * ============================================================
   * VALIDATE CONFIGURATION
   * ============================================================
   */

  validateMpesaConfig();

  /**
   * ============================================================
   * VALIDATE CHECKOUT REQUEST ID
   * ============================================================
   */

  const normalizedCheckoutRequestID =
    checkoutRequestID?.trim();

  if (!normalizedCheckoutRequestID) {
    throw new Error(
      "CheckoutRequestID is required."
    );
  }

  /**
   * ============================================================
   * GET SAFARICOM ACCESS TOKEN
   * ============================================================
   */

  const accessToken =
    await getAccessToken();

  /**
   * ============================================================
   * GENERATE TIMESTAMP
   * ============================================================
   */

  const timestamp =
    generateTimestamp();

  /**
   * ============================================================
   * GENERATE PASSWORD
   * ============================================================
   *
   * Password:
   *
   * Base64(
   *   BusinessShortCode +
   *   Passkey +
   *   Timestamp
   * )
   *
   * The shared helper uses the configured
   * MPESA_SHORTCODE and MPESA_PASSKEY.
   */

  const password =
    generatePassword(timestamp);

  /**
   * ============================================================
   * BUILD STK QUERY PAYLOAD
   * ============================================================
   *
   * STK Push Query requires:
   *
   * BusinessShortCode
   * Password
   * Timestamp
   * CheckoutRequestID
   *
   * PartyA / PartyB are NOT sent here.
   */

  const payload = {
    BusinessShortCode:
      MPESA_SHORTCODE,

    Password:
      password,

    Timestamp:
      timestamp,

    CheckoutRequestID:
      normalizedCheckoutRequestID,
  };

  /**
   * ============================================================
   * SAFARICOM ENDPOINT
   * ============================================================
   */

  const url =
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

  /**
   * ============================================================
   * SAFE REQUEST DIAGNOSTICS
   * ============================================================
   *
   * NEVER log:
   *
   * - Consumer Secret
   * - Passkey
   * - Access Token
   * - Password
   */

  console.log(
    "================================="
  );

  console.log(
    "M-PESA STK QUERY REQUEST"
  );

  console.log(
    "================================="
  );

  console.log(
    "Environment:",
    Deno.env.get("MPESA_ENV") ?? "unknown"
  );

  console.log(
    "Base URL:",
    MPESA_BASE_URL
  );

  console.log(
    "BusinessShortCode:",
    MPESA_SHORTCODE
  );

  console.log(
    "CheckoutRequestID:",
    normalizedCheckoutRequestID
  );

  console.log(
    "Endpoint:",
    url
  );

  console.log(
    "HTTP Method:",
    "POST"
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * SEND QUERY TO SAFARICOM
   * ============================================================
   */

  let response: Response;

  try {
    response = await fetch(
      url,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(payload),
      }
    );
  } catch (error) {
    /**
     * Network-level failure.
     */

    console.error(
      "================================="
    );

    console.error(
      "M-PESA STK QUERY NETWORK ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Unable to connect to Safaricom STK Query service."
    );
  }

  /**
   * ============================================================
   * READ SAFARICOM RESPONSE
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
      "M-PESA STK Query returned an empty response.",
      {
        httpStatus:
          response.status,

        statusText:
          response.statusText,
      }
    );

    throw new Error(
      `Safaricom STK Query returned an empty response (HTTP ${response.status}).`
    );
  }

  /**
   * ============================================================
   * PARSE JSON
   * ============================================================
   */

  let data: MpesaSTKQueryResponse;

  try {
    data =
      JSON.parse(text);
  } catch {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA STK QUERY INVALID JSON"
    );

    console.error(
      "HTTP Status:",
      response.status
    );

    console.error(
      "Raw Response:",
      text
    );

    console.error(
      "================================="
    );

    throw new Error(
      "Safaricom STK Query returned invalid JSON."
    );
  }

  /**
   * ============================================================
   * HTTP ERROR
   * ============================================================
   *
   * An HTTP failure means the request itself failed.
   */

  if (!response.ok) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA STK QUERY HTTP ERROR"
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
      "Safaricom Response:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    console.error(
      "================================="
    );

    throw new Error(
      `Safaricom STK Query failed with HTTP ${response.status}.`
    );
  }

  /**
   * ============================================================
   * SAFARICOM RESPONSE
   * ============================================================
   */

  const responseCode =
    data.ResponseCode === undefined ||
    data.ResponseCode === null
      ? ""
      : String(data.ResponseCode);

  const resultCode =
    data.ResultCode === undefined ||
    data.ResultCode === null
      ? ""
      : String(data.ResultCode);

  const resultDescription =
    typeof data.ResultDesc === "string"
      ? data.ResultDesc
      : "";

  /**
   * ============================================================
   * RESPONSE DIAGNOSTICS
   * ============================================================
   */

  console.log(
    "================================="
  );

  console.log(
    "M-PESA STK QUERY RESPONSE"
  );

  console.log(
    "================================="
  );

  console.log(
    "HTTP Status:",
    response.status
  );

  console.log(
    "ResponseCode:",
    responseCode
  );

  console.log(
    "ResponseDescription:",
    data.ResponseDescription
  );

  console.log(
    "MerchantRequestID:",
    data.MerchantRequestID
  );

  console.log(
    "CheckoutRequestID:",
    data.CheckoutRequestID
  );

  console.log(
    "Result
