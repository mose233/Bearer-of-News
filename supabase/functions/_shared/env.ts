/**
 * ============================================================
 * M-PESA ENVIRONMENT CONFIGURATION
 * ============================================================
 *
 * Production configuration for xnewsapp.com.
 *
 * IMPORTANT:
 *
 * Real M-PESA credentials MUST remain in Supabase Edge
 * Function Secrets.
 *
 * NEVER place:
 *
 * - Consumer Key
 * - Consumer Secret
 * - Passkey
 * - OAuth Access Token
 * - STK Password
 *
 * in GitHub, frontend code, or client-side configuration.
 *
 * ============================================================
 * CONFIRMED MERCHANT IDENTIFIERS
 * ============================================================
 *
 * DARaja Production Application Short Code:
 *      4320242
 *
 * M-PESA Organization Short Code:
 *      4460875
 *
 * Active Till Number:
 *      4798391
 *
 * These are intentionally kept as separate values.
 *
 * ============================================================
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
 * DARaja APPLICATION SHORT CODE
 * ============================================================
 *
 * This is the Short Code configured for the Daraja
 * production application.
 *
 * Confirmed value:
 *
 *      4320242
 *
 * IMPORTANT:
 *
 * This is NOT the Till Number.
 */

export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA ORGANIZATION SHORT CODE
 * ============================================================
 *
 * Confirmed value:
 *
 *      4460875
 */

export const MPESA_ORGANIZATION_SHORTCODE =
  Deno.env
    .get("MPESA_ORGANIZATION_SHORTCODE")
    ?.trim() ?? "";


/**
 * ============================================================
 * M-PESA TILL NUMBER
 * ============================================================
 *
 * Confirmed active Till:
 *
 *      4798391
 *
 * IMPORTANT:
 *
 * Do NOT use this value as MPESA_SHORTCODE.
 */

export const MPESA_TILL_NUMBER =
  Deno.env.get("MPESA_TILL_NUMBER")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA STK PUSH PASSKEY
 * ============================================================
 *
 * The real production Passkey must exist only inside
 * Supabase Edge Function Secrets.
 */

export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA TRANSACTION TYPE
 * ============================================================
 *
 * Current production transaction type:
 *
 *      CustomerBuyGoodsOnline
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
 * CONFIRMED PRODUCTION VALUES
 * ============================================================
 */

const EXPECTED_PRODUCTION_SHORTCODE =
  "4320242";

const EXPECTED_PRODUCTION_ORGANIZATION_SHORTCODE =
  "4460875";

const EXPECTED_PRODUCTION_TILL_NUMBER =
  "4798391";

const EXPECTED_PRODUCTION_TRANSACTION_TYPE =
  "CustomerBuyGoodsOnline";


/**
 * ============================================================
 * VALIDATE M-PESA CONFIGURATION
 * ============================================================
 *
 * This validates configuration before making Safaricom
 * API requests.
 *
 * No sensitive credentials are logged.
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
   * DARaja APPLICATION SHORT CODE
   * ----------------------------------------------------------
   */

  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_SHORTCODE is missing."
    );
  }


  /**
   * ----------------------------------------------------------
   * PRODUCTION DARaja SHORT CODE
   * ----------------------------------------------------------
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !== EXPECTED_PRODUCTION_SHORTCODE
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Daraja Application Short Code ${EXPECTED_PRODUCTION_SHORTCODE}, received ${MPESA_SHORTCODE}.`
    );
  }


  /**
   * ----------------------------------------------------------
   * ORGANIZATION SHORT CODE
   * ----------------------------------------------------------
   */

  if (!MPESA_ORGANIZATION_SHORTCODE) {
    throw new Error(
      "M-PESA configuration error: MPESA_ORGANIZATION_SHORTCODE is missing."
    );
  }


  /**
   * ----------------------------------------------------------
   * PRODUCTION ORGANIZATION SHORT CODE
   * ----------------------------------------------------------
   */

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
   * ----------------------------------------------------------
   * TILL NUMBER
   * ----------------------------------------------------------
   */

  if (!MPESA_TILL_NUMBER) {
    throw new Error(
      "M-PESA configuration error: MPESA_TILL_NUMBER is missing."
    );
  }


  /**
   * ----------------------------------------------------------
   * PRODUCTION TILL VALIDATION
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * The correct Till is 4798391.
   *
   * The previous file incorrectly expected 4320242 here.
   */

  if (
    MPESA_ENV === "production" &&
    MPESA_TILL_NUMBER !== EXPECTED_PRODUCTION_TILL_NUMBER
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Till Number ${EXPECTED_PRODUCTION_TILL_NUMBER}, received ${MPESA_TILL_NUMBER}.`
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
   * ==========================================================
   * SAFE DIAGNOSTICS
   * ==========================================================
   *
   * NEVER log:
   *
   * - Consumer Key
   * - Consumer Secret
   * - Passkey
   * - OAuth Access Token
   * - STK Password
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
    "Daraja Application Short Code:",
    MPESA_SHORTCODE
  );

  console.log(
    "Organization Short Code:",
    MPESA_ORGANIZATION_SHORTCODE
  );

  console.log(
    "Till Number:",
    MPESA_TILL_NUMBER
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
