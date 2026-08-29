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
 * Consumer Key and Consumer Secret must NEVER
 * be exposed to the browser/frontend.
 */
export async function getAccessToken(): Promise<string> {
  // Validate that the required M-Pesa configuration exists.
  validateMpesaConfig();

  const credentials = btoa(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  );

  const url =
    `${MPESA_BASE_URL}/oauth/v1/generate` +
    "?grant_type=client_credentials";

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

  // Read the response body ONCE.
  const responseText = await response.text();

  console.log(
    "M-PESA OAuth HTTP status:",
    response.status
  );

  // Handle OAuth failure.
  if (!response.ok) {
    console.error(
      "M-PESA OAuth failed:",
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        response: responseText,
      })
    );

    throw new Error(
      `Safaricom OAuth failed with HTTP ${response.status}: ${responseText}`
    );
  }

  // Parse successful response.
  let data: {
    access_token?: string;
    expires_in?: string | number;
  };

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error(
      "M-PESA OAuth returned invalid JSON:",
      responseText
    );

    throw new Error(
      "Safaricom OAuth returned an invalid response."
    );
  }

  // Make sure Daraja actually returned a token.
  if (!data.access_token) {
    console.error(
      "M-PESA OAuth response did not contain an access_token:",
      data
    );

    throw new Error(
      "M-Pesa access token missing from Safaricom response."
    );
  }

  console.log(
    "M-PESA OAuth access token obtained successfully."
  );

  return data.access_token;
}
