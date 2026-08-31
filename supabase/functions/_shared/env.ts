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
 * MPESA_SHORTCODE=4798391
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * IMPORTANT:
 *
 * Safaricom has confirmed that:
 *
 * BusinessShortCode = 4798391
 *
 * This is the Till Number.
 *
 * Store Number:
 *
 * 4460875
 *
 * The previous value 4320242 must NOT be used as the
 * M-PESA Express BusinessShortCode.
 *
 * Never put real credentials in GitHub or frontend code.
 */

/**
 * ============================================================
 * M-PESA ENVIRONMENT
 * ============================================================
 *
 * Expected values:
 *
 * production
 * sandbox
 */
export const MPESA_ENV =
  Deno.env.get("MPESA_ENV")?.trim().toLowerCase() ?? "";

/**
 * ============================================================
 * SAFARICOM CONSUMER KEY
 * ============================================================
 */
export const MPESA_CONSUMER_KEY =
  Deno.env.get("MPESA_CONSUMER_KEY")?.trim() ?? "";

/**
 * ============================================================
 * SAFARICOM CONSUMER SECRET
 * ============================================================
 */
export const MPESA_CONSUMER_SECRET =
  Deno.env.get("MPESA_CONSUMER_SECRET")?.trim() ?? "";

/**
 * ============================================================
 * M-PESA BUSINESS SHORT CODE
 * ============================================================
 *
 * Safaricom has confirmed:
 *
 * BusinessShortCode = Till Number = 4798391
 *
 * The value is still read from Supabase Edge Function
 * Secrets rather than being used directly by the code.
 *
 * Supabase Secret:
 *
 * MPESA_SHORTCODE=4798391
 */
export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";

/**
 * ============================================================
 * M-PESA STK PUSH PASSKEY
 * ============================================================
 *
 * The real Passkey must be stored only in
 * Supabase Edge Function Secrets.
 */
export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";

/**
 * ============================================================
 * M-PESA TRANSACTION TYPE
 * ============================================================
 *
 * Current xnewsapp.com configuration:
 *
 * CustomerBuyGoodsOnline
 *
 * This remains configurable through Supabase Secrets.
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
 * EXPECTED PRODUCTION BUSINESS SHORT CODE
 * ============================================================
 *
 * Safaricom has confirmed that the Till Number:
 *
 * 4798391
 *
 * is the BusinessShortCode for the M-PESA Express
 * production integration.
 *
 * IMPORTANT:
 *
 * 4320242 is NOT used here.
 *
 * Safaricom has confirmed that 4320242 is associated
 * with channeling payments to the bank.
 */
const EXPECTED_PRODUCTION_SHORTCODE = "4798391";

/**
 * ============================================================
 * EXPECTED PRODUCTION TRANSACTION TYPE
 * ============================================================
 *
 * Current xnewsapp.com configuration:
 *
 * CustomerBuyGoodsOnline
 */
const EXPECTED_PRODUCTION_TRANSACTION_TYPE =
  "CustomerBuyGoodsOnline";

/**
 * ============================================================
 * VALIDATE M-PESA CONFIGURATION
 * ============================================================
 *
 * This function must be called before making Safaricom
 * API requests.
 *
 * IMPORTANT:
 *
 * No credentials are logged.
 */
export function validateMpesaConfig(): void {
  /**
   * ----------------------------------------------------------
   * ENVIRONMENT
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
   * BASE URL
   * ----------------------------------------------------------
   */

  if (!MPESA_BASE_URL) {
    throw new Error(
      "M-PESA configuration error: API base URL is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * CONSUMER KEY
   * ----------------------------------------------------------
   */

  if (!MPESA_CONSUMER_KEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_KEY is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * CONSUMER SECRET
   * ----------------------------------------------------------
   */

  if (!MPESA_CONSUMER_SECRET) {
    throw new Error(
      "M-PESA configuration error: MPESA_CONSUMER_SECRET is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * BUSINESS SHORT CODE
   * ----------------------------------------------------------
   */

  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_SHORTCODE is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * PRODUCTION BUSINESS SHORT CODE VALIDATION
   * ----------------------------------------------------------
   *
   * Safaricom has confirmed:
   *
   * BusinessShortCode = 4798391
   *
   * This prevents the old 4320242 value from accidentally
   * being used for M-PESA Express in production.
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !== EXPECTED_PRODUCTION_SHORTCODE
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Business Short Code ${EXPECTED_PRODUCTION_SHORTCODE}, received ${MPESA_SHORTCODE}.`
    );
  }

  /**
   * ----------------------------------------------------------
   * PASSKEY
   * ----------------------------------------------------------
   */

  if (!MPESA_PASSKEY) {
    throw new Error(
      "M-PESA configuration error: MPESA_PASSKEY is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * TRANSACTION TYPE
   * ----------------------------------------------------------
   */

  if (!MPESA_TRANSACTION_TYPE) {
    throw new Error(
      "M-PESA configuration error: MPESA_TRANSACTION_TYPE is missing."
    );
  }

  /**
   * ----------------------------------------------------------
   * PRODUCTION TRANSACTION TYPE VALIDATION
   * ----------------------------------------------------------
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_TRANSACTION_TYPE !==
      EXPECTED_PRODUCTION_TRANSACTION_TYPE
  ) {
    throw new Error(
      `M-PESA production configuration error: expected transaction type ${EXPECTED_PRODUCTION_TRANSACTION_TYPE}, received ${MPESA_TRANSACTION_TYPE}.`
    );
  }

  /**
   * ----------------------------------------------------------
   * SAFE DIAGNOSTICS
   * ----------------------------------------------------------
   *
   * NEVER log:
   *
   * - Consumer Key
   * - Consumer Secret
   * - Passkey
   * - OAuth access token
   * - STK password
   */

  console.log(
    "================================="
  );

  console.log(
    "M-PESA CONFIGURATION VALIDATED"
  );

  console.log(
    "================================="
  );

  console.log(
    "Environment:",
    MPESA_ENV
  );

  console.log(
    "Business Short Code:",
    MPESA_SHORTCODE
  );

  console.log(
    "Transaction Type:",
    MPESA_TRANSACTION_TYPE
  );

  console.log(
    "Base URL:",
    MPESA_BASE_URL
  );

  console.log(
    "================================="
  );
}
