import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  validateMpesaConfig,
} from "./env.ts";

/**
 * Obtain a Safaricom Daraja OAuth access token.
 *
 * Server-side only.
 *
 * Consumer Key and Consumer Secret must NEVER be exposed
 * to the browser/frontend.
 */
export async function getAccessToken(): Promise<string> {
  validateMpesaConfig();

  const credentials = btoa(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  );

  const url =
    `${MPESA_BASE_URL}/oauth/v1/generate` +
    "?grant_type=client_credentials";

  console.log("M-Pesa OAuth starting");
  console.log("M-Pesa environment:", Deno.env.get("MPESA_ENV"));
  console.log("M-Pesa OAuth URL:", url);
  console.log(
    "Consumer Key configured:",
    Boolean(MPESA_CONSUMER_KEY)
  );
  console.log(
    "Consumer Secret configured:",
    Boolean(MPESA_CONSUMER_SECRET)
  );

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error("M-Pesa OAuth network error:", error);

    throw new Error(
      "Unable to connect to Safaricom OAuth service."
    );
  }

  const responseText = await response.text();

  console.log(
    "M-Pesa OAuth HTTP status:",
    response.status
  );

  console.log(
    "M-Pesa OAuth response:",
    responseText || "[EMPTY RESPONSE]"
  );

  if (!response.ok) {
    throw new Error(
      `M-Pesa OAuth failed. HTTP ${response.status}: ${
        responseText || "Safaricom returned an empty response."
      }`
    );
  }

  let data: {
    access_token?: string;
    expires_in?: string | number;
  };

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error(
      "M-Pesa OAuth returned invalid JSON:",
      responseText
    );

    throw new Error(
      "Safaricom OAuth returned an invalid response."
    );
  }

  if (!data.access_token) {
    console.error(
      "M-Pesa OAuth response did not contain access_token:",
      data
    );

    throw new Error(
      "Safaricom OAuth response did not contain an access token."
    );
  }

  console.log("M-Pesa OAuth successful.");

  return data.access_token;
}
