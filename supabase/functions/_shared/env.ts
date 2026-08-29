/**
 * M-PESA environment configuration.
 *
 * IMPORTANT:
 * Production must be explicitly configured.
 *
 * Required Supabase secrets:
 *
 * MPESA_ENV=production
 * MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
 * MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
 * MPESA_SHORTCODE=4320242
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 *
 * Never put the real credentials in GitHub or frontend code.
 */

export const MPESA_ENV =
  Deno.env.get("MPESA_ENV")?.trim().toLowerCase() ?? "";

export const MPESA_CONSUMER_KEY =
  Deno.env.get("MPESA_CONSUMER_KEY")?.trim() ?? "";

export const MPESA_CONSUMER_SECRET =
  Deno.env.get("MPESA_CONSUMER_SECRET")?.trim() ?? "";

export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";

export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";

/**
 * STK Push transaction type.
 *
 * Safaricom's standard STK Push values include:
 *
 * CustomerPayBillOnline
 * CustomerBuyGoodsOnline
 *
 * Your current implementation uses CustomerPayBillOnline.
 *
 * If Safaricom instructs you that shortcode 4320242 must use
 * CustomerBuyGoodsOnline instead, change this Supabase secret:
 *
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * We keep CustomerPayBillOnline as the current default because
 * that is what the existing xnewsapp.com implementation was using.
 */
export const MPESA_TRANSACTION_TYPE =
  Deno.env.get("MPESA_TRANSACTION_TYPE")?.trim() ||
  "CustomerPayBillOnline";

/**
 * Production Safaricom API base URL.
 */
export const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : MPESA_ENV === "sandbox"
      ? "https://sandbox.safaricom.co.ke"
      : "";

/**
 * Validate the configuration before making a live request.
 *
 * This deliberately does NOT silently fall back to Sandbox.
 */
export function validateMpesaConfig(): void {
  if (!MPESA_ENV) {
    throw new Error(
      "M-PESA configuration error: MPESA_ENV is not configured."
    );
  }

  if (MPESA_ENV !== "production" && MPESA_ENV !== "sandbox") {
    throw new Error(
      `M-PESA configuration error: unsupported MPESA_ENV "${MPESA_ENV}".`
    );
  }

  if (!MPESA_BASE_URL) {
    throw new Error(
      "M-PESA configuration error: API base URL is missing."
    );
  }

  if (!MPESA_CONSUMER_KEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_KEY is missing."
    );
  }

  if (!MPESA_CONSUMER_SECRET) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_SECRET is missing."
    );
  }

  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_SHORTCODE is missing."
    );
  }

  if (!MPESA_PASSKEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_PASSKEY is missing."
    );
  }

  if (MPESA_ENV === "production" && MPESA_SHORTCODE !== "4320242") {
    throw new Error(
      `M-PESA production configuration error: expected HO shortcode 4320242, received ${MPESA_SHORTCODE}.`
    );
  }
}
