import {
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
} from "./env.ts";

/**
 * ============================================================
 * M-PESA TIMESTAMP
 * ============================================================
 *
 * Safaricom requires:
 *
 * YYYYMMDDHHmmss
 *
 * Example:
 * 20260830163341
 *
 * IMPORTANT:
 * The timestamp must be generated immediately before
 * generating the STK Push password.
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
 * M-PESA STK PASSWORD
 * ============================================================
 *
 * Safaricom formula:
 *
 * Base64(
 *   BusinessShortCode +
 *   Passkey +
 *   Timestamp
 * )
 *
 * The shortcode and passkey are read ONLY from Supabase
 * environment secrets.
 *
 * NEVER put the real passkey in frontend code or GitHub.
 */
export function generatePassword(timestamp: string): string {
  if (!timestamp?.trim()) {
    throw new Error(
      "M-PESA password generation error: timestamp is required."
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
 * KENYAN PHONE NUMBER NORMALIZATION
 * ============================================================
 *
 * Accepted formats:
 *
 * 0712345678
 * 712345678
 * +254712345678
 * 254712345678
 *
 * Returned format:
 *
 * 254712345678
 *
 * Safaricom STK Push expects the MSISDN in international
 * Kenyan format without the "+" sign.
 */
export function normalizePhoneNumber(
  phone: string
): string {
  if (!phone) {
    throw new Error(
      "M-PESA phone number is required."
    );
  }

  let cleaned = phone.trim();

  /**
   * Remove spaces.
   *
   * Example:
   * +254 716 172 432
   *
   * becomes:
   * +254716172432
   */
  cleaned = cleaned.replace(/\s+/g, "");

  /**
   * Remove common separators users may enter.
   */
  cleaned = cleaned.replace(/[-()]/g, "");

  /**
   * Convert:
   *
   * +254712345678
   *
   * to:
   *
   * 254712345678
   */
  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  }

  /**
   * Convert local Kenyan format:
   *
   * 0712345678
   *
   * to:
   *
   * 254712345678
   */
  if (cleaned.startsWith("07")) {
    cleaned = "254" + cleaned.substring(1);
  }

  /**
   * Convert:
   *
   * 712345678
   *
   * to:
   *
   * 254712345678
   */
  if (cleaned.startsWith("7")) {
    cleaned = "254" + cleaned;
  }

  /**
   * Validate final Kenyan mobile format.
   *
   * Expected:
   *
   * 254
   * +
   * 7
   * +
   * 8 digits
   *
   * Example:
   *
   * 254716172432
   */
  if (!/^2547\d{8}$/.test(cleaned)) {
    throw new Error(
      "Invalid Kenyan phone number. Use 0712345678, +254712345678, or 254712345678."
    );
  }

  return cleaned;
}
