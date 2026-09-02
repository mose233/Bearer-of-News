import {
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
} from "./env.ts";

/**
 * ============================================================
 * M-PESA UTILITY FUNCTIONS
 * ============================================================
 *
 * Utilities used by the M-PESA Edge Functions.
 *
 * IMPORTANT:
 *
 * MPESA_SHORTCODE is the Daraja Application Short Code.
 *
 * Current production values:
 *
 * Daraja Application Short Code:
 *      4320242
 *
 * Organization Short Code:
 *      4460875
 *
 * Till Number:
 *      4798391
 *
 * The Till Number must NOT be substituted for
 * MPESA_SHORTCODE when generating the STK password.
 */


/**
 * ============================================================
 * GENERATE SAFARICOM TIMESTAMP
 * ============================================================
 *
 * Format:
 *
 *      YYYYMMDDHHmmss
 *
 * Example:
 *
 *      20260902164530
 *
 * Safaricom requires the timestamp to be generated for
 * the same STK request used to generate the password.
 */

export function generateTimestamp(): string {
  const now = new Date();

  const yyyy = now.getFullYear();

  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}


/**
 * ============================================================
 * GENERATE STK PUSH PASSWORD
 * ============================================================
 *
 * Safaricom formula:
 *
 *      Base64(
 *        BusinessShortCode +
 *        Passkey +
 *        Timestamp
 *      )
 *
 * IMPORTANT:
 *
 * MPESA_SHORTCODE must be the Daraja Application Short Code.
 *
 * Current production value:
 *
 *      4320242
 *
 * Do NOT use:
 *
 *      4798391
 *
 * because that is the Till Number.
 */

export function generatePassword(timestamp: string): string {
  if (!timestamp || !/^\d{14}$/.test(timestamp)) {
    throw new Error(
      "M-PESA password generation error: invalid timestamp."
    );
  }

  if (!MPESA_SHORTCODE) {
    throw new Error(
      "M-PESA password generation error: MPESA_SHORTCODE is missing."
    );
  }

  if (!MPESA_PASSKEY) {
    throw new Error(
      "M-PESA password generation error: MPESA_PASSKEY is missing."
    );
  }

  return btoa(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  );
}


/**
 * ============================================================
 * NORMALIZE KENYAN PHONE NUMBER
 * ============================================================
 *
 * Accepted formats:
 *
 *      0712345678
 *      712345678
 *      +254712345678
 *      254712345678
 *
 * Returns:
 *
 *      254712345678
 */

export function normalizePhoneNumber(phone: string): string {
  if (!phone) {
    throw new Error(
      "M-PESA phone number is required."
    );
  }

  let cleaned = phone.trim();

  /**
   * Remove spaces.
   */
  cleaned = cleaned.replace(/\s+/g, "");

  /**
   * Convert:
   *
   *      +254712345678
   *
   * to:
   *
   *      254712345678
   */
  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  }

  /**
   * Convert:
   *
   *      0712345678
   *
   * to:
   *
   *      254712345678
   */
  if (cleaned.startsWith("07")) {
    cleaned = "254" + cleaned.substring(1);
  }

  /**
   * Convert:
   *
   *      712345678
   *
   * to:
   *
   *      254712345678
   */
  if (cleaned.startsWith("7")) {
    cleaned = "254" + cleaned;
  }

  /**
   * Final validation.
   *
   * Kenyan mobile number:
   *
   *      2547XXXXXXXX
   */
  if (!/^2547\d{8}$/.test(cleaned)) {
    throw new Error(
      "Invalid Kenyan phone number. Use a valid 07XXXXXXXX, 7XXXXXXXX, +2547XXXXXXXX, or 2547XXXXXXXX number."
    );
  }

  return cleaned;
}
