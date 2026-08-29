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
 * This function does NOT decide whether the payment is successful.
 * It only asks Safaricom for the status.
 *
 * mpesa-status.ts is responsible for interpreting ResultCode.
 */
export async function querySTKStatus(
  checkoutRequestID: string
): Promise<MpesaSTKQueryResponse> {
  validateMpesaConfig();

  if (!checkoutRequestID?.trim()) {
    throw new Error(
      "CheckoutRequestID is required."
    );
  }

  const accessToken = await getAccessToken();

  const timestamp = generateTimestamp();

  /**
   * The password must be generated using:
   *
   * Base64(
   *   BusinessShortCode + Passkey + Timestamp
   * )
   *
   * We use the existing shared helper.
   */
  const password = generatePassword(timestamp);

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestID.trim(),
  };

  const url =
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

  console.log(
    "M-PESA STK Query:",
    JSON.stringify({
      environment: "production",
      shortcode: MPESA_SHORTCODE,
      checkoutRequestID,
    })
  );

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(
      "M-PESA STK Query network error:",
      error
    );

    throw new Error(
      "Unable to connect to Safaricom STK Query service."
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      `Safaricom STK Query returned an empty response (HTTP ${response.status}).`
    );
  }

  let data: MpesaSTKQueryResponse;

  try {
    data = JSON.parse(text);
  } catch {
    console.error(
      "M-PESA STK Query invalid JSON:",
      text
    );

    throw new Error(
      "Safaricom STK Query returned invalid JSON."
    );
  }

  if (!response.ok) {
    console.error(
      "M-PESA STK Query HTTP error:",
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        response: data,
      })
    );

    throw new Error(
      `Safaricom STK Query failed with HTTP ${response.status}.`
    );
  }

  console.log(
    "M-PESA STK Query response:",
    JSON.stringify({
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription,
      ResultCode: data.ResultCode,
      ResultDesc: data.ResultDesc,
      CheckoutRequestID: data.CheckoutRequestID,
    })
  );

  return data;
}
