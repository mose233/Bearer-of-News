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

export interface MpesaSTKQueryResponse {
  ResponseCode?: string;
  ResponseDescription?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResultCode?: string | number;
  ResultDesc?: string;
  [key: string]: unknown;
}

/**
 * Query the status of a specific M-PESA STK Push transaction.
 *
 * IMPORTANT:
 *
 * This function ONLY asks Safaricom for the transaction status.
 *
 * It does NOT decide whether the payment is successful.
 *
 * mpesa-status.ts is responsible for interpreting ResultCode.
 */
export async function querySTKStatus(
  checkoutRequestID: string
): Promise<MpesaSTKQueryResponse> {
  /**
   * ============================================================
   * VALIDATE M-PESA CONFIGURATION
   * ============================================================
   */
  validateMpesaConfig();

  /**
   * ============================================================
   * VALIDATE CHECKOUT REQUEST ID
   * ============================================================
   */
  if (!checkoutRequestID?.trim()) {
    throw new Error(
      "CheckoutRequestID is required."
    );
  }

  /**
   * ============================================================
   * GET ACCESS TOKEN
   * ============================================================
   */
  const accessToken = await getAccessToken();

  /**
   * ============================================================
   * GENERATE QUERY TIMESTAMP
   * ============================================================
   */
  const timestamp = generateTimestamp();

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
   * We use the existing shared helper so the same configuration
   * is used throughout the M-PESA integration.
   */
  const password = generatePassword(timestamp);

  /**
   * ============================================================
   * BUILD STK QUERY PAYLOAD
   * ============================================================
   *
   * STK Query requires:
   *
   * BusinessShortCode
   * Password
   * Timestamp
   * CheckoutRequestID
   *
   * NOTE:
   *
   * PartyA and PartyB are NOT part of STK Query.
   */
  const payload = {
    BusinessShortCode:
      MPESA_SHORTCODE,

    Password:
      password,

    Timestamp:
      timestamp,

    CheckoutRequestID:
      checkoutRequestID.trim(),
  };

  /**
   * ============================================================
   * STK QUERY ENDPOINT
   * ============================================================
   */
  const url =
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

  /**
   * ============================================================
   * REQUEST DIAGNOSTICS
   * ============================================================
   *
   * IMPORTANT:
   *
   * We intentionally do NOT log:
   *
   * - Consumer Secret
   * - Passkey
   * - Access Token
   * - Generated Password
   *
   * We only log safe diagnostic information.
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
    "production"
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
    checkoutRequestID.trim()
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
    "Transaction Type:",
    "N/A - STK Query"
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
    /**
     * ============================================================
     * NETWORK ERROR
     * ============================================================
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
    /**
     * ============================================================
     * INVALID JSON RESPONSE
     * ============================================================
     */
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
   * COMPLETE SAFARICOM RESPONSE DIAGNOSTICS
   * ============================================================
   *
   * This is especially important for the current
   * ResultCode 4999 / "Merchant does not exist" issue.
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
    data.ResponseCode
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
    data.ResultCode
  );

  console.log(
    "ResultDesc:",
    data.ResultDesc
  );

  console.log(
    "Full Safaricom Response:",
    JSON.stringify(
      data,
      null,
      2
    )
  );

  console.log(
    "================================="
  );

  /**
   * ============================================================
   * SPECIAL DIAGNOSTIC FOR 4999
   * ============================================================
   *
   * We do NOT convert this to success or pending here.
   *
   * mpesa-status.ts decides how the result is interpreted.
   */
  if (
    String(data.ResultCode ?? "") ===
    "4999"
  ) {
    console.error(
      "================================="
    );

    console.error(
      "❌ M-PESA RESULT CODE 4999"
    );

    console.error(
      "ResultDesc:",
      data.ResultDesc
    );

    console.error(
      "BusinessShortCode used:",
      MPESA_SHORTCODE
    );

    console.error(
      "CheckoutRequestID:",
      checkoutRequestID.trim()
    );

    console.error(
      "Endpoint:",
      url
    );

    console.error(
      "================================="
    );
  }

  /**
   * ============================================================
   * RETURN RAW SAFARICOM RESULT
   * ============================================================
   *
   * The caller is responsible for deciding whether the payment
   * is:
   *
   * - paid
   * - pending
   * - cancelled
   * - failed
   */
  return data;
}
