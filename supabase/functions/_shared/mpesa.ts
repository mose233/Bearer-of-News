import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  validateMpesaConfig,
} from "./env.ts";

/**
 * Obtain a Safaricom Daraja OAuth access token.
 *
 * This function is server-side only.
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
      `Safaricom OAuth failed with HTTP ${response.status}.`
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
      "M-PESA OAuth returned invalid JSON:",
      responseText
    );

    throw new Error(
      "Safaricom OAuth returned an invalid response."
    );
  }

  if (!response.ok) {
  const errorText = await response.text();

  console.error("M-Pesa OAuth HTTP status:", response.status);
  console.error("M-Pesa OAuth response:", errorText);

  throw new Error(
    `Failed to obtain M-Pesa access token. HTTP ${response.status}: ${errorText}`
  );
}

  return data.access_token;
}
