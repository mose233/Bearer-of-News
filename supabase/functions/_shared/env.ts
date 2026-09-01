/**
 * ============================================================
 * xnewsapp.com — M-PESA ENVIRONMENT CONFIGURATION
 * ============================================================
 *
 * This file contains configuration loading and validation only.
 *
 * IMPORTANT:
 *
 * Real M-PESA credentials MUST remain in Supabase Edge
 * Function Secrets.
 *
 * NEVER put the following values in GitHub or frontend code:
 *
 * - Consumer Key
 * - Consumer Secret
 * - Passkey
 * - OAuth access token
 * - STK password
 *
 * ------------------------------------------------------------
 * REQUIRED SUPABASE SECRETS
 * ------------------------------------------------------------
 *
 * MPESA_ENV=production
 *
 * MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
 *
 * MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
 *
 * MPESA_SHORTCODE=4320242
 *
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 *
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * ------------------------------------------------------------
 * MERCHANT IDENTIFIERS DISCOVERED DURING CONFIGURATION
 * ------------------------------------------------------------
 *
 * Daraja Production App Short Code:
 *
 * 4320242
 *
 * M-PESA Till Number:
 *
 * 4798391
 *
 * M-PESA Organization Short Code:
 *
 * 4460875
 *
 * IMPORTANT:
 *
 * These are NOT interchangeable.
 *
 * The Daraja Production App screenshot explicitly showed:
 *
 *     Short Code: 4320242
 *     Product: Lipa na Mpesa Production
 *
 * Therefore, until Safaricom explicitly confirms otherwise,
 * the Daraja application short code is treated as the
 * BusinessShortCode for the production STK Push / STK Query
 * integration.
 *
 * The Till Number 4798391 is retained as merchant information
 * but is NOT automatically substituted into BusinessShortCode.
 *
 * ============================================================
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
  Deno.env
    .get("MPESA_ENV")
    ?.trim()
    .toLowerCase() ?? "";

/**
 * ============================================================
 * SAFARICOM CONSUMER KEY
 * ============================================================
 *
 * Loaded only from Supabase Edge Function Secrets.
 */
export const MPESA_CONSUMER_KEY =
  Deno.env
    .get("MPESA_CONSUMER_KEY")
    ?.trim() ?? "";

/**
 * ============================================================
 * SAFARICOM CONSUMER SECRET
 * ============================================================
 *
 * Loaded only from Supabase Edge Function Secrets.
 */
export const MPESA_CONSUMER_SECRET =
  Deno.env
    .get("MPESA_CONSUMER_SECRET")
    ?.trim() ?? "";

/**
 * ============================================================
 * DARaja BUSINESS SHORT CODE
 * ============================================================
 *
 * This is the value used by:
 *
 * - STK Push BusinessShortCode
 * - STK Push PartyB
 * - STK Password generation
 * - STK Query BusinessShortCode
 *
 * The value is loaded from Supabase Secrets.
 *
 * Current production value based on the Daraja Production App:
 *
 *     4320242
 *
 * Supabase Secret:
 *
 *     MPESA_SHORTCODE=4320242
 *
 * IMPORTANT:
 *
 * Do NOT automatically use the Till Number 4798391 here.
 */
export const MPESA_SHORTCODE =
  Deno.env
    .get("MPESA_SHORTCODE")
    ?.trim() ?? "";

/**
 * ============================================================
 * M-PESA TILL NUMBER
 * ============================================================
 *
 * Merchant Till Number discovered in the M-PESA Organization
 * portal:
 *
 *     4798391
 *
 * This is informational configuration.
 *
 * It is deliberately separate from MPESA_SHORTCODE because
 * the two identifiers have different meanings in the merchant
 * configuration.
 *
 * Do NOT use this value automatically as BusinessShortCode.
 */
export const MPESA_TILL_NUMBER =
  Deno.env
    .get("MPESA_TILL_NUMBER")
    ?.trim() || "4798391";

/**
 * ============================================================
 * M-PESA ORGANIZATION SHORT CODE
 * ============================================================
 *
 * Organization information discovered in the M-PESA portal:
 *
 *     4460875
 *
 * This is deliberately kept separate from:
 *
 *     MPESA_SHORTCODE
 *
 * and:
 *
 *     MPESA_TILL_NUMBER
 *
 * because these identifiers must not be confused.
 */
export const MPESA_ORGANIZATION_SHORTCODE =
  Deno.env
    .get("MPESA_ORGANIZATION_SHORTCODE")
    ?.trim() || "4460875";

/**
 * ============================================================
 * M-PESA STK PUSH PASSKEY
 * ============================================================
 *
 * The real production Passkey MUST be stored in Supabase
 * Edge Function Secrets.
 */
export const MPESA_PASSKEY =
  Deno.env
    .get("MPESA_PASSKEY")
    ?.trim() ?? "";

/**
 * ============================================================
 * M-PESA TRANSACTION TYPE
 * ============================================================
 *
 * Current production configuration:
 *
 *     CustomerBuyGoodsOnline
 *
 * This remains configurable through Supabase Secrets.
 */
export const MPESA_TRANSACTION_TYPE =
  Deno.env
    .get("MPESA_TRANSACTION_TYPE")
    ?.trim() ||
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
 * EXPECTED PRODUCTION DARaja BUSINESS SHORT CODE
 * ============================================================
 *
 * Evidence from the Daraja Production App:
 *
 *     Short Code = 4320242
 *
 * This is the value currently associated with the
 * xnewsapp.com production Daraja application.
 */
const EXPECTED_PRODUCTION_SHORTCODE =
  "4320242";

/**
 * ============================================================
 * EXPECTED PRODUCTION TILL NUMBER
 * ============================================================
 *
 * M-PESA Organization portal:
 *
 *     Till Number = 4798391
 */
const EXPECTED_PRODUCTION_TILL_NUMBER =
  "4798391";

/**
 * ============================================================
 * EXPECTED PRODUCTION ORGANIZATION SHORT CODE
 * ============================================================
 *
 * M-PESA Organization portal:
 *
 *     Organization Short Code = 4460875
 */
const EXPECTED_PRODUCTION_ORGANIZATION_SHORTCODE =
  "4460875";

/**
 * ============================================================
 * EXPECTED PRODUCTION TRANSACTION TYPE
 * ============================================================
 */
const EXPECTED_PRODUCTION_TRANSACTION_TYPE =
  "CustomerBuyGoodsOnline";

/**
 * ============================================================
 * VALIDATE M-PESA CONFIGURATION
 * ============================================================
 *
 * Called before making Safaricom API requests.
 *
 * IMPORTANT:
 *
 * No secret credentials are logged.
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
   * PRODUCTION BUSINESS SHORT CODE
   * ----------------------------------------------------------
   *
   * The Daraja Production App screenshot showed:
   *
   *     Short Code = 4320242
   *
   * Therefore production configuration must use:
   *
   *     MPESA_SHORTCODE=4320242
   *
   * This validation prevents accidentally using:
   *
   *     4798391
   *
   * as the Daraja BusinessShortCode.
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !==
      EXPECTED_PRODUCTION_SHORTCODE
  ) {
    throw new Error(
      `M-PESA production configuration error: Daraja Production App expects Business Short Code ${EXPECTED_PRODUCTION_SHORTCODE}, received ${MPESA_SHORTCODE}.`
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
   * MERCHANT CONFIGURATION VALIDATION
   * ----------------------------------------------------------
   *
   * These are informational merchant identifiers.
   *
   * They are intentionally NOT used as substitutes for
   * MPESA_SHORTCODE.
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_TILL_NUMBER !==
      EXPECTED_PRODUCTION_TILL_NUMBER
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Till Number ${EXPECTED_PRODUCTION_TILL_NUMBER}, received ${MPESA_TILL_NUMBER}.`
    );
  }

  if (
    MPESA_ENV === "production" &&
    MPESA_ORGANIZATION_SHORTCODE !==
      EXPECTED_PRODUCTION_ORGANIZATION_SHORTCODE
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Organization Short Code ${EXPECTED_PRODUCTION_ORGANIZATION_SHORTCODE}, received ${MPESA_ORGANIZATION_SHORTCODE}.`
    );
  }

  /**
   * ==========================================================
   * SAFE DIAGNOSTICS
   * ==========================================================
   *
   * NEVER log:
   *
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
    "Daraja Business Short Code:",
    MPESA_SHORTCODE
  );

  console.log(
    "M-PESA Till Number:",
    MPESA_TILL_NUMBER
  );

  console.log(
    "M-PESA Organization Short Code:",
    MPESA_ORGANIZATION_SHORTCODE
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
