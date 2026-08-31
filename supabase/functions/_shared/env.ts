/**
 * M-PESA environment configuration.
 *
 * Production configuration for xnewsapp.com.
 *
 * IMPORTANT:
 * Safaricom has issued the following production
 * STK Push Business Short Code for xnewsapp.com:
 *
 * Business Short Code: 4320242
 *
 * The production Passkey MUST be stored in
 * Supabase Secrets and MUST NOT be committed to GitHub.
 *
 * Required Supabase secrets:
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
 * ============================================================
 * ENVIRONMENT
 * ============================================================
 */

export const MPESA_ENV =
  Deno.env.get("MPESA_ENV")?.trim().toLowerCase() ?? "";

/**
 * ============================================================
 * SAFARICOM CREDENTIALS
 * ============================================================
 */

export const MPESA_CONSUMER_KEY =
  Deno.env.get("MPESA_CONSUMER_KEY")?.trim() ?? "";

export const MPESA_CONSUMER_SECRET =
  Deno.env.get("MPESA_CONSUMER_SECRET")?.trim() ?? "";

/**
 * Safaricom production STK Push Business Short Code.
 *
 * IMPORTANT:
 *
 * This is now 4320242.
 *
 * Do NOT use the previous 4798391 value.
 */
export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";

export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";

/**
 * ============================================================
 * TRANSACTION TYPE
 * ============================================================
 *
 * Safaricom has provided an STK Push Business Short Code.
 *
 * For a Buy Goods / Till STK Push integration,
 * CustomerBuyGoodsOnline is used.
 *
 * The value can still be overridden through
 * MPESA_TRANSACTION_TYPE in Supabase Secrets.
 */

export const MPESA_TRANSACTION_TYPE =
  Deno.env.get("MPESA_TRANSACTION_TYPE")?.trim() ||
  "CustomerBuyGoodsOnline";

/**
 * ============================================================
 * SAFARICOM API BASE URL
 * ============================================================
 */

export const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : MPESA_ENV === "sandbox"
      ? "https://sandbox.safaricom.co.ke"
      : "";

/**
 * ============================================================
 * VALIDATE M-PESA CONFIGURATION
 * ============================================================
 *
 * This function validates the configuration before any
 * request is sent to Safaricom.
 *
 * IMPORTANT:
 *
 * We deliberately do NOT silently fall back to Sandbox.
 */

export function validateMpesaConfig(): void {
  /**
   * ----------------------------------------------------------
   * Environment
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * Base URL
   * ----------------------------------------------------------
   */

  if (!MPESA_BASE_URL) {
    throw new Error(
      "M-PESA configuration error: API base URL is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * Consumer Key
   * ----------------------------------------------------------
   */

  if (!MPESA_CONSUMER_KEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_KEY is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * Consumer Secret
   * ----------------------------------------------------------
   */

  if (!MPESA_CONSUMER_SECRET) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_SECRET is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * Business Short Code
   * ----------------------------------------------------------
   */

  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_SHORTCODE is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * Passkey
   * ----------------------------------------------------------
   */

  if (!MPESA_PASSKEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_PASSKEY is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * Transaction Type
   * ----------------------------------------------------------
   */

  if (!MPESA_TRANSACTION_TYPE) {
    throw new Error(
      "M-PESA configuration error: MPESA_TRANSACTION_TYPE is missing."
    );
  }

  /**
   * ==========================================================
   * PRODUCTION VALIDATION
   * ==========================================================
   *
   * Safaricom has issued:
   *
   * Business Short Code: 4320242
   *
   * Therefore xnewsapp.com production requests must use
   * 4320242.
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !== "4320242"
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Business Short Code 4320242, received ${MPESA_SHORTCODE}.`
    );
  }

  /**
   * ==========================================================
   * PRODUCTION TRANSACTION TYPE
   * ==========================================================
   *
   * The STK Push integration uses:
   *
   * CustomerBuyGoodsOnline
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_TRANSACTION_TYPE !== "CustomerBuyGoodsOnline"
  ) {
    throw new Error(
      `M-PESA production configuration error: Business Short Code 4320242 requires CustomerBuyGoodsOnline, received ${MPESA_TRANSACTION_TYPE}.`
    );
  }
}
