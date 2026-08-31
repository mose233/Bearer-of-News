/**
 * M-PESA environment configuration.
 *
 * Production configuration for xnewsapp.com.
 *
 * IMPORTANT:
 *
 * All real M-PESA credentials must remain in
 * Supabase Edge Function Secrets.
 *
 * Required secrets:
 *
 * MPESA_ENV=production
 * MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
 * MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
 * MPESA_SHORTCODE=4320242
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * Never put real credentials in GitHub or frontend code.
 */

/**
 * M-PESA environment.
 *
 * Expected values:
 *
 * production
 * sandbox
 */
export const MPESA_ENV =
  Deno.env.get("MPESA_ENV")?.trim().toLowerCase() ?? "";

/**
 * Safaricom Consumer Key.
 */
export const MPESA_CONSUMER_KEY =
  Deno.env.get("MPESA_CONSUMER_KEY")?.trim() ?? "";

/**
 * Safaricom Consumer Secret.
 */
export const MPESA_CONSUMER_SECRET =
  Deno.env.get("MPESA_CONSUMER_SECRET")?.trim() ?? "";

/**
 * Safaricom Business Short Code.
 *
 * For the current xnewsapp.com production
 * STK Push credentials this is:
 *
 * 4320242
 *
 * The value is intentionally read from Supabase Secrets
 * instead of being hard-coded here.
 */
export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";

/**
 * Safaricom STK Push Passkey.
 *
 * This MUST come from Supabase Secrets.
 */
export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";

/**
 * M-PESA transaction type.
 *
 * This remains configurable because Safaricom's
 * approved merchant configuration determines the
 * correct transaction type.
 *
 * Current xnewsapp.com configuration:
 *
 * CustomerBuyGoodsOnline
 */
export const MPESA_TRANSACTION_TYPE =
  Deno.env.get("MPESA_TRANSACTION_TYPE")?.trim() ||
  "CustomerBuyGoodsOnline";

/**
 * Safaricom API base URL.
 */
export const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : MPESA_ENV === "sandbox"
      ? "https://sandbox.safaricom.co.ke"
      : "";

/**
 * Validate M-PESA configuration.
 *
 * IMPORTANT:
 *
 * There is intentionally NO hard-coded validation such as:
 *
 * MPESA_SHORTCODE === "4798391"
 *
 * The shortcode is supplied by Safaricom through
 * Supabase Secrets.
 */
export function validateMpesaConfig(): void {
  /**
   * Environment
   */
  if (!MPESA_ENV) {
    throw new Error(
      "M-PESA configuration error: MPESA_ENV is not configured."
    );
  }

  if (
    MPESA_ENV !== "production" &&
    MPESA_ENV !== "sandbox"
  ) {
    throw new Error(
      `M-PESA configuration error: unsupported MPESA_ENV "${MPESA_ENV}".`
    );
  }

  /**
   * Base URL
   */
  if (!MPESA_BASE_URL) {
    throw new Error(
      "M-PESA configuration error: API base URL is missing."
    );
  }

  /**
   * Consumer Key
   */
  if (!MPESA_CONSUMER_KEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_KEY is missing."
    );
  }

  /**
   * Consumer Secret
   */
  if (!MPESA_CONSUMER_SECRET) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_SECRET is missing."
    );
  }

  /**
   * Business Short Code
   */
  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_SHORTCODE is missing."
    );
  }

  /**
   * Passkey
   */
  if (!MPESA_PASSKEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_PASSKEY is missing."
    );
  }

  /**
   * Transaction Type
   */
  if (!MPESA_TRANSACTION_TYPE) {
    throw new Error(
      "M-PESA configuration error: MPESA_TRANSACTION_TYPE is missing."
    );
  }

  /**
   * Safe configuration diagnostics.
   *
   * NEVER print credentials.
   */
  console.log(
    "M-PESA configuration validated:",
    JSON.stringify({
      environment: MPESA_ENV,
      shortcode: MPESA_SHORTCODE,
      transactionType: MPESA_TRANSACTION_TYPE,
      baseUrl: MPESA_BASE_URL,
    })
  );
}
