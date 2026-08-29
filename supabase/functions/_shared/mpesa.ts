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
 */
export async function getAccessToken(): Promise<string> {
  validateMpesaConfig();

  console.log("=================================");
  console.log("M-PESA OAUTH DIAGNOSTIC");
  console.log("Environment:", Deno.env.get("MPESA_ENV"));
  console.log("Base URL:", MPESA_BASE_URL);
  console.log(
    "Consumer Key present:",
    Boolean(MPESA_CONSUMER_KEY)
  );
  console.log(
    "Consumer Secret present:",
    Boolean(MPESA_CONSUMER_SECRET)
  );
  console.log("=================================");

  const credentials = btoa(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  );

  const url =
    `${MPESA_BASE_URL}/oauth/v1/generate` +
    "?grant_type=client_credentials";

  console.log("OAuth URL:", url);

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
    console.error("M-PESA OAuth network error:", error);

    throw new Error(
      "Unable to connect to Safaricom OAuth service."
    );
  }

  const responseText = await response.text();

  console.log("M-PESA OAuth HTTP status:", response.status);
  console.log(
    "M-PESA OAuth response length:",
    responseText.length
  );
  console.log(
    "M-PESA OAuth response:",
    responseText || "(empty response)"
  );

  if (!response.ok) {
    throw new Error(
      `M-Pesa OAuth failed. HTTP ${response.status}: ${
        responseText || "(empty response)"
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
    throw new Error(
      "Safaricom OAuth returned invalid JSON."
    );
  }

  if (!data.access_token) {
    throw new Error(
      "Safaricom OAuth response did not contain an access token."
    );
  }

  console.log("M-PESA OAuth succeeded.");

  return data.access_token;
}
