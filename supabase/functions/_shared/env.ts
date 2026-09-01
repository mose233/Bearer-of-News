```typescript
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
 *
 * CURRENT SAFARICOM MERCHANT IDENTIFIERS
 * ============================================================
 *
 * We have confirmed three different identifiers:
 *
 * 1. DARaja Production App Short Code
 *
 *      4320242
 *
 *      This is the Short Code displayed on the Daraja
 *      Production App:
 *
 *      Prod-ENOCK NYAMBEGA MOSE-1788004129763
 *
 * 2. M-PESA ORGANIZATION SHORT CODE
 *
 *      4460875
 *
 *      This appears in the M-PESA Organization portal.
 *
 * 3. TILL NUMBER
 *
 *      4798391
 *
 *      This is the active Till Number belonging to the
 *      organization.
 *
 * ============================================================
 *
 * IMPORTANT DIAGNOSTIC HISTORY
 * ============================================================
 *
 * We previously used:
 *
 *      MPESA_SHORTCODE=4798391
 *
 * The STK Push API accepted the request:
 *
 *      ResponseCode: 0
 *      ResponseDescription:
 *      Success. Request accepted for processing
 *
 * However, querying the resulting CheckoutRequestID returned:
 *
 *      ResultCode: 4999
 *      ResultDesc: Merchant does not exist
 *
 * Therefore we must NOT assume that the Till Number is
 * automatically the Daraja application BusinessShortCode.
 *
 * This configuration deliberately keeps the identifiers
 * separate so the STK Push implementation can use the
 * correct merchant identifier once the Safaricom production
 * mapping is confirmed.
 *
 * ============================================================
 *
 * REQUIRED SUPABASE EDGE FUNCTION SECRETS
 * ============================================================
 *
 * MPESA_ENV=production
 *
 * MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
 *
 * MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
 *
 * MPESA_SHORTCODE=4320242
 *
 * MPESA_ORGANIZATION_SHORTCODE=4460875
 *
 * MPESA_TILL_NUMBER=4798391
 *
 * MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
 *
 * MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
 *
 * ============================================================
 */


/**
 * ============================================================
 * M-PESA ENVIRONMENT
 * ============================================================
 *
 * Allowed:
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
 * DARaja APPLICATION SHORT CODE
 * ============================================================
 *
 * This is the Short Code displayed on the Safaricom
 * Production App.
 *
 * Current confirmed value:
 *
 *      4320242
 *
 * IMPORTANT:
 *
 * This is deliberately NOT the Till Number.
 *
 * The previous configuration incorrectly treated:
 *
 *      4798391
 *
 * as the Daraja application shortcode.
 */
export const MPESA_SHORTCODE =
  Deno.env.get("MPESA_SHORTCODE")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA ORGANIZATION SHORT CODE
 * ============================================================
 *
 * Current confirmed organization value:
 *
 *      4460875
 *
 * This is kept separately from the Daraja application
 * shortcode and the Till Number.
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
 * Current active Till:
 *
 *      4798391
 *
 * IMPORTANT:
 *
 * Do not automatically substitute this value for
 * MPESA_SHORTCODE.
 */
export const MPESA_TILL_NUMBER =
  Deno.env.get("MPESA_TILL_NUMBER")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA STK PUSH PASSKEY
 * ============================================================
 *
 * The real production Passkey must exist only in
 * Supabase Edge Function Secrets.
 */
export const MPESA_PASSKEY =
  Deno.env.get("MPESA_PASSKEY")?.trim() ?? "";


/**
 * ============================================================
 * M-PESA TRANSACTION TYPE
 * ============================================================
 *
 * Current intended transaction type:
 *
 *      CustomerBuyGoodsOnline
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
 * EXPECTED PRODUCTION VALUES
 * ============================================================
 *
 * These values are based on the merchant information we have
 * established from the Safaricom portals.
 */


/**
 * Daraja Production App Short Code.
 */
const EXPECTED_PRODUCTION_SHORTCODE =
  "4320242";


/**
 * M-PESA Organization Short Code.
 */
const EXPECTED_PRODUCTION_ORGANIZATION_SHORTCODE =
  "4460875";


/**
 * Active Till Number.
 */
const EXPECTED_PRODUCTION_TILL_NUMBER =
  "4798391";


/**
 * Intended production transaction type.
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
   * PRODUCTION DARaja SHORT CODE VALIDATION
   * ----------------------------------------------------------
   *
   * The Safaricom Production App shows:
   *
   *      Short Code = 4320242
   *
   * We therefore validate the application configuration
   * against that value.
   */
  if (
    MPESA_ENV === "production" &&
    MPESA_SHORTCODE !==
      EXPECTED_PRODUCTION_SHORTCODE
  ) {
    throw new Error(
      `M-PESA production configuration error: expected Daraja application Short Code ${EXPECTED_PRODUCTION_SHORTCODE}, received ${MPESA_SHORTCODE}.`
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
   * PRODUCTION ORGANIZATION SHORT CODE VALIDATION
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
```
