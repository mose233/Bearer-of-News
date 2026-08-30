/**
 * M-PESA environment configuration.
 *
 * Production configuration for xnewsapp.com.
 *
 * Required Supabase secrets:
 *
 * MPESA_ENV=production
 * MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
 * MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
 * MPESA_SHORTCODE=4798391
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * Never put real credentials in GitHub or frontend code.
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
 * M-PESA transaction type.
 *
 * For xnewsapp.com production:
 *
 * CustomerBuyGoodsOnline
 *
 * because Safaricom has confirmed shortcode 4798391
 * is a Till number.
 */
export const MPESA_TRANSACTION_TYPE =
  Deno.env.get("MPESA_TRANSACTION_TYPE")?.trim() ||
  "CustomerBuyGoodsOnline";

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
 * Validate the M-PESA configuration before making
 * a live request.
 *
 * IMPORTANT:
 * We deliberately do NOT silently fall back to Sandbox.
 */
export function validateMpesaConfig(): void {
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

  if (!MPESA_TRANSACTION_TYPE) {
    throw new Error(
      "M-PESA configuration error: MPESA_TRANSACTION_TYPE is missing."
    );
  }

  /**
   * Production xnewsapp.com Till.
   *
   * Safaricom confirmed this number as a Till.
   */
  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !== "4798391"
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Till 4798391, received ${MPESA_SHORTCODE}.`
    );
  }

  /**
   * Because 4798391 is a Buy Goods Till, the transaction
   * type must be CustomerBuyGoodsOnline.
   */
  if (
    MPESA_ENV === "production" &&
    MPESA_TRANSACTION_TYPE !== "CustomerBuyGoodsOnline"
  ) {
    throw new Error(
      `M-PESA production configuration error: Till 4798391 requires CustomerBuyGoodsOnline, received ${MPESA_TRANSACTION_TYPE}.`
    );
  }
}
