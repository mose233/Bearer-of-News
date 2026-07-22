export const MPESA_ENV = Deno.env.get("MPESA_ENV") ?? "sandbox";

export const MPESA_CONSUMER_KEY =
  Deno.env.get("MPESA_CONSUMER_KEY") ?? "";

export const MPESA_CONSUMER_SECRET =
  Deno.env.get("MPESA_CONSUMER_SECRET") ?? "";

export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE") ?? "";

export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY") ?? "";

export const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
