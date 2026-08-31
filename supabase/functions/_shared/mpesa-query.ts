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
 * ============================================================
 * M-PESA STK PUSH QUERY RESPONSE
 * ============================================================
 *
 * ResponseCode:
 *   0 = Safaricom accepted the query request
 *
 * ResultCode:
 *   Actual result of the original STK Push transaction.
 *
 * IMPORTANT:
 *
 * ResponseCode === "0" does NOT mean payment succeeded.
 *
 * Only ResultCode === "0" means the payment itself succeeded.
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
 * ============================================================
 * QUERY STK PUSH STATUS
 * ============================================================
 *
 * This function communicates with Safaricom.
 *
 * It does NOT decide whether the payment is:
 *
 * - paid
 * - pending
 * - cancelled
 * - failed
 *
 * That decision belongs to mpesa-status.ts.
 */
export async function querySTKStatus(
  checkoutRequestID: string
): Promise<MpesaSTKQueryResponse> {
  /**
   * ==========================================================
   * VALIDATE M-PESA CONFIGURATION
   * ==========================================================
   */
  validateMpesaConfig();

  /**
   * ==========================================================
   * VALIDATE CHECKOUT REQUEST ID
   * ==========================================================
   */
  const normalizedCheckoutRequestID =
    checkoutRequestID?.trim();

  if (!normalizedCheckoutRequestID) {
    throw new Error(
      "CheckoutRequestID is required."
    );
  }

  /**
   * ==========================================================
   * GET ACCESS TOKEN
   * ==========================================================
   */
  const accessToken =
    await getAccessToken();

  /**
   * ==========================================================
   * GENERATE TIMESTAMP
   * ==========================================================
   *
   * The timestamp must match the password timestamp.
   */
  const timestamp =
    generateTimestamp();

  /**
   * ==========================================================
   * GENERATE PASSWORD
   * ==========================================================
   *
   * Safaricom formula:
   *
   * Base64(
   *   BusinessShortCode +
   *   Passkey +
   *   Timestamp
   * )
   *
   * The shortcode and passkey come from Supabase secrets.
   */
  const password =
    generatePassword(timestamp);

  /**
   * ==========================================================
   * BUILD QUERY PAYLOAD
   * ==========================================================
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
   * ==========================================================
   * SAFARICOM STK QUERY URL
   * ==========================================================
   */
  const url =
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

  /**
   * ==========================================================
   * SAFE DIAGNOSTICS
   * ==========================================================
   *
   * NEVER log:
   *
   * - Consumer Secret
   * - Passkey
   * - Access Token
   * - Generated Password
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
    "================================="
  );

  /**
   * ==========================================================
   * SEND REQUEST TO SAFARICOM
   * ==========================================================
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
   * ==========================================================
   * READ RESPONSE
   * ==========================================================
   */
  const text =
    await response.text();

  /**
   * ==========================================================
   * EMPTY RESPONSE
   * ==========================================================
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
   * ==========================================================
   * PARSE JSON
   * ==========================================================
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
   * ==========================================================
   * HTTP ERROR
   * ==========================================================
   *
   * An HTTP error means Safaricom rejected the API request
   * itself.
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
   * ==========================================================
   * NORMALIZE RESPONSE CODES
   * ==========================================================
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

  /**
   * ==========================================================
   * RESPONSE DIAGNOSTICS
   * ==========================================================
   *
   * These values are safe to log.
   *
   * We deliberately do NOT log:
   *
   * - password
   * - passkey
   * - access token
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
    "ResultCode:",
    resultCode
  );

  console.log(
    "ResultDesc:",
    data.ResultDesc
  );

  console.log(
    "================================="
  );

  /**
   * ==========================================================
   * RETURN RAW SAFARICOM RESULT
   * ==========================================================
   *
   * mpesa-status.ts will interpret ResultCode.
   */
  return data;
}
