import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
} from "./env.ts";

import { getAccessToken } from "./mpesa.ts";
import { generatePassword, generateTimestamp } from "./mpesa-utils.ts";

export async function querySTKStatus(checkoutRequestID: string) {
  const accessToken = await getAccessToken();

  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  const response = await fetch(
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      }),
    }
  );

  const text = await response.text();
  
  console.log("STK Query HTTP Status:", response.status);
  console.log("STK Query Response:", text);
  
  if (!text.trim()) {
    throw new Error(
      `Daraja returned an empty response (HTTP ${response.status}).`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Daraja returned invalid JSON: ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Daraja Error (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data;
}
