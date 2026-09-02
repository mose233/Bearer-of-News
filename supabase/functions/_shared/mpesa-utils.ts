import {
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
} from "./env.ts";

/**
 * Generate Safaricom timestamp
 * Format: YYYYMMDDHHmmss
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
 * Generate STK Push password
 * Base64(shortcode + passkey + timestamp)
 */
export function generatePassword(
  timestamp: string,
  businessShortCode: string = MPESA_SHORTCODE
): string {
  return btoa(
    `${businessShortCode}${MPESA_PASSKEY}${timestamp}`
  );
}

/**
 * Normalize Kenyan phone numbers
 *
 * Accepts:
 * 0712345678
 * 712345678
 * +254712345678
 * 254712345678
 *
 * Returns:
 * 254712345678
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.trim();

  cleaned = cleaned.replace(/\s+/g, "");

  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith("07")) {
    cleaned = "254" + cleaned.substring(1);
  }

  if (cleaned.startsWith("7")) {
    cleaned = "254" + cleaned;
  }

  if (!/^2547\d{8}$/.test(cleaned)) {
    throw new Error("Invalid Kenyan phone number.");
  }

  return cleaned;
}
