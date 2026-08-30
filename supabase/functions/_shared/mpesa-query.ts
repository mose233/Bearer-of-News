import {
  MPESA_BASE_URL,
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
  MPESA_ENV,
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
 *
 * ResponseCode "0" means Safaricom accepted
 * the STK Query request.
 *
 * ResultCode describes the actual transaction result.
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
 * It does NOT decide whether the payment is:
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
   * NORMALIZE CHECKOUT REQUEST ID
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
   * GET ACCESS TOKEN
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
   * Password is:
   *
   * Base64(
   *   BusinessShortCode +
   *   Passkey +
   *   Timestamp
   * )
   *
   * IMPORTANT:
   *
   * We use the SAME configured shortcode and passkey
   * used by the STK Push.
   */

  const password =
    generatePassword(timestamp);

  /**
   * ============================================================
   * BUILD STK QUERY PAYLOAD
   * ============================================================
   *
   * Safaricom STK Push Query expects:
   *
   * BusinessShortCode
   * Password
   * Timestamp
   * CheckoutRequestID
   *
   * PartyA and PartyB are NOT part of this request.
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
   * SAFE DIAGNOSTICS
   * ============================================================
   *
   * NEVER log:
   *
   * - Consumer Secret
   * - Passkey
   * - Password
   * - Access Token
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
    MPESA_ENV || "unknown"
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
    "Payload fields:",
    [
      "BusinessShortCode",
      "Password",
      "Timestamp",
      "CheckoutRequestID",
    ]
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * SEND REQUEST TO SAFARICOM
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
   * READ RESPONSE BODY
   * ============================================================
   */

  const text =
    await response.text();

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
   * NORMALIZE RESPONSE VALUES
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
    "ResultCode:",
    resultCode
  );

  console.log(
    "ResultDesc:",
    resultDescription
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * IMPORTANT DIAGNOSTIC
   * ============================================================
   *
   * ResponseCode 0 does NOT mean payment succeeded.
   *
   * It only means Safaricom accepted the QUERY request.
   *
   * ResultCode contains the actual transaction result.
   */

  if (
    responseCode === "0" &&
    resultCode === "4999" &&
    resultDescription
      .toLowerCase()
      .includes("merchant does not exist")
  ) {
    console.error(
      "================================="
    );

    console.error(
      "M-PESA MERCHANT CONFIGURATION ERROR"
    );

    console.error(
      "================================="
    );

    console.error(
      "Safaricom accepted the STK Query request"
    );

    console.error(
      "but reported:"
    );

    console.error(
      "ResultCode:",
      resultCode
    );

    console.error(
      "ResultDesc:",
      resultDescription
    );

    console.error(
      "BusinessShortCode:",
      MPESA_SHORTCODE
    );

    console.error(
      "Environment:",
      MPESA_ENV
    );

    console.error(
      "CheckoutRequestID:",
      normalizedCheckoutRequestID
    );

    console.error(
      "This indicates a Safaricom-side merchant/"
      + "shortcode provisioning issue rather than "
      + "a frontend payment-status issue."
    );

    console.error(
      "================================="
    );
  }

  /**
   * ============================================================
   * RETURN SAFARICOM RESPONSE
   * ============================================================
   *
   * Do NOT convert ResultCode here.
   *
   * mpesa-status.ts is responsible for deciding
   * paid/pending/cancelled/failed.
   */

  return data;
}
