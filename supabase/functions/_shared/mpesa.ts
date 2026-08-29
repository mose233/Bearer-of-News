import {
  MPESA_BASE_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  validateMpesaConfig,
} from "./env.ts";

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

  console.log("M-PESA OAuth status:", response.status);

  if (!response.ok) {
    console.error(
      "M-PESA OAuth response:",
      responseText
    );

    throw new Error(
      `Safaricom OAuth failed. HTTP ${response.status}: ${responseText}`
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
      `Safaricom OAuth returned invalid JSON: ${responseText}`
    );
  }

  if (!data.access_token) {
    throw new Error(
      `Safaricom OAuth did not return an access token: ${responseText}`
    );
  }

  return data.access_token;
}
