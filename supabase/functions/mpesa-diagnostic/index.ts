import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_TRANSACTION_TYPE,
  validateMpesaConfig,
} from "../_shared/env.ts";

import { getAccessToken } from "../_shared/mpesa.ts";

import {
  generatePassword,
  generateTimestamp,
  normalizePhoneNumber,
} from "../_shared/mpesa-utils.ts";

const CALLBACK_URL =
  "https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/mpesa-callback";

/**
 * ============================================================
 * TEMPORARY M-PESA DIAGNOSTIC
 * ============================================================
 *
 * PURPOSE:
 *
 * Test the production STK Push configuration currently
 * configured for xnewsapp.com.
 *
 * BusinessShortCode = 4798391
 * PartyB            = 4798391
 *
 * Store Number = 4460875
 *
 * This function is temporary.
 *
 * It does NOT replace mpesa-stkpush.
 * It does NOT replace mpesa-status.
 * It does NOT perform STK Query.
 *
 * It ONLY tests whether Safaricom accepts the STK Push
 * request using the configured merchant shortcode.
 *
 * Never log:
 *
 * - Consumer Secret
 * - Consumer Key
 * - Passkey
 * - OAuth access token
 * - STK password
 */

interface DiagnosticRequest {
  phoneNumber?: string;
  amount?: number;
}

/**
 * ============================================================
 * JSON RESPONSE HELPER
 * ============================================================
 */
function jsonResponse(
  body: unknown,
  status = 200
): Response {
  return new Response(
    JSON.stringify(
      body,
      null,
      2
    ),
    {
      status,
      headers: {
        "Content-Type":
          "application/json",

        "Access-Control-Allow-Origin":
          "*",

        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",

        "Access-Control-Allow-Methods":
          "POST, OPTIONS",
      },
    }
  );
}

/**
 * ============================================================
 * M-PESA DIAGNOSTIC
 * ============================================================
 */
serve(
  async (
    req: Request
  ): Promise<Response> => {
    try {
      /**
       * ========================================================
       * CORS
       * ========================================================
       */

      if (
        req.method === "OPTIONS"
      ) {
        return jsonResponse(
          {
            success: true,
          }
        );
      }

      /**
       * ========================================================
       * ONLY POST
       * ========================================================
       */

      if (
        req.method !== "POST"
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              "Method Not Allowed.",
          },
          405
        );
      }

      /**
       * ========================================================
       * VALIDATE CONFIGURATION
       * ========================================================
       */

      validateMpesaConfig();

      /**
       * ========================================================
       * READ REQUEST
       * ========================================================
       */

      let body: DiagnosticRequest;

      try {
        body =
          await req.json();
      } catch {
        return jsonResponse(
          {
            success: false,
            error:
              "Invalid JSON body.",
          },
          400
        );
      }

      const phoneNumber =
        body.phoneNumber?.trim();

      const requestedAmount =
        body.amount;

      /**
       * ========================================================
       * VALIDATE PHONE
       * ========================================================
       */

      if (!phoneNumber) {
        return jsonResponse(
          {
            success: false,
            error:
              "phoneNumber is required.",
          },
          400
        );
      }

      /**
       * ========================================================
       * VALIDATE AMOUNT
       * ========================================================
       *
       * For safety, require an explicit amount.
       */

      if (
        typeof requestedAmount !==
          "number" ||
        !Number.isFinite(
          requestedAmount
        ) ||
        requestedAmount <= 0
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              "amount must be a positive number.",
          },
          400
        );
      }

      /**
       * ========================================================
       * NORMALIZE M-PESA AMOUNT
       * ========================================================
       *
       * M-PESA requires a whole KES amount.
       */

      const amount =
        Math.max(
          1,
          Math.round(
            requestedAmount
          )
        );

      /**
       * ========================================================
       * NORMALIZE CUSTOMER PHONE
       * ========================================================
       */

      const customerPhone =
        normalizePhoneNumber(
          phoneNumber
        );

      /**
       * ========================================================
       * MERCHANT CONFIGURATION
       * ========================================================
       *
       * There is one source of truth:
       *
       * MPESA_SHORTCODE
       *
       * In production this must be:
       *
       * 4798391
       *
       * Therefore:
       *
       * BusinessShortCode = 4798391
       * PartyB            = 4798391
       */

      const testBusinessShortCode =
        MPESA_SHORTCODE;

      const testTillNumber =
        MPESA_SHORTCODE;

      const testStoreNumber =
        "4460875";

      /**
       * ========================================================
       * SAFE DIAGNOSTIC LOGGING
       * ========================================================
       */

      console.log(
        "================================="
      );

      console.log(
        "M-PESA DIAGNOSTIC TEST"
      );

      console.log(
        "================================="
      );

      console.log(
        "Environment:",
        Deno.env.get(
          "MPESA_ENV"
        ) ?? "unknown"
      );

      console.log(
        "BusinessShortCode:",
        testBusinessShortCode
      );

      console.log(
        "PartyB / Till:",
        testTillNumber
      );

      console.log(
        "Store Number:",
        testStoreNumber
      );

      console.log(
        "TransactionType:",
        MPESA_TRANSACTION_TYPE
      );

      console.log(
        "Phone:",
        customerPhone
      );

      console.log(
        "Amount:",
        amount
      );

      console.log(
        "Callback URL:",
        CALLBACK_URL
      );

      console.log(
        "================================="
      );

      /**
       * ========================================================
       * GENERATE TIMESTAMP
       * ========================================================
       */

      const timestamp =
        generateTimestamp();

      /**
       * ========================================================
       * GENERATE PASSWORD
       * ========================================================
       *
       * We deliberately do not log this.
       */

      const password =
        generatePassword(
          timestamp
        );

      /**
       * ========================================================
       * GET ACCESS TOKEN
       * ========================================================
       */

      const accessToken =
        await getAccessToken();

      /**
       * ========================================================
       * BUILD TEST PAYLOAD
       * ========================================================
       *
       * Fresh production test:
       *
       * BusinessShortCode = 4798391
       * PartyB            = 4798391
       */

      const payload = {
        BusinessShortCode:
          testBusinessShortCode,

        Password:
          password,

        Timestamp:
          timestamp,

        TransactionType:
          MPESA_TRANSACTION_TYPE,

        Amount:
          amount,

        PartyA:
          customerPhone,

        PartyB:
          testTillNumber,

        PhoneNumber:
          customerPhone,

        CallBackURL:
          CALLBACK_URL,

        AccountReference:
          "xnewsapp-test",

        TransactionDesc:
          "xnewsapp diagnostic test",
      };

      /**
       * ========================================================
       * SAFARICOM STK PUSH ENDPOINT
       * ========================================================
       */

      const url =
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

      console.log(
        "Sending diagnostic STK Push..."
      );

      console.log(
        "Endpoint:",
        url
      );

      /**
       * ========================================================
       * SEND REQUEST TO SAFARICOM
       * ========================================================
       */

      let response: Response;

      try {
        response =
          await fetch(
            url,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${accessToken}`,

                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              /**
               * NEVER log this payload.
               *
               * It contains the generated
               * STK password.
               */
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      } catch (error) {
        console.error(
          "M-PESA DIAGNOSTIC NETWORK ERROR:",
          error
        );

        return jsonResponse(
          {
            success: false,

            test: {
              businessShortCode:
                testBusinessShortCode,

              partyB:
                testTillNumber,

              storeNumber:
                testStoreNumber,

              transactionType:
                MPESA_TRANSACTION_TYPE,
            },

            error:
              "Unable to connect to Safaricom.",
          },
          502
        );
      }

      /**
       * ========================================================
       * READ SAFARICOM RESPONSE
       * ========================================================
       */

      const responseText =
        await response.text();

      console.log(
        "Safaricom HTTP Status:",
        response.status
      );

      /**
       * ========================================================
       * EMPTY RESPONSE
       * ========================================================
       */

      if (
        !responseText.trim()
      ) {
        console.error(
          "Safaricom returned an empty response."
        );

        return jsonResponse(
          {
            success: false,

            test: {
              businessShortCode:
                testBusinessShortCode,

              partyB:
                testTillNumber,

              storeNumber:
                testStoreNumber,

              transactionType:
                MPESA_TRANSACTION_TYPE,
            },

            httpStatus:
              response.status,

            error:
              "Safaricom returned an empty response.",
          },
          502
        );
      }

      /**
       * ========================================================
       * PARSE RESPONSE
       * ========================================================
       */

      let data: Record<
        string,
        unknown
      >;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        console.error(
          "Safaricom returned invalid JSON."
        );

        return jsonResponse(
          {
            success: false,

            test: {
              businessShortCode:
                testBusinessShortCode,

              partyB:
                testTillNumber,

              storeNumber:
                testStoreNumber,

              transactionType:
                MPESA_TRANSACTION_TYPE,
            },

            httpStatus:
              response.status,

            error:
              "Safaricom returned invalid JSON.",
          },
          502
        );
      }

      /**
       * ========================================================
       * SAFE RESPONSE EXTRACTION
       * ========================================================
       */

      const responseCode =
        data.ResponseCode ===
          undefined ||
        data.ResponseCode ===
          null
          ? ""
          : String(
              data.ResponseCode
            );

      const responseDescription =
        typeof data.ResponseDescription ===
        "string"
          ? data.ResponseDescription
          : "";

      const merchantRequestID =
        typeof data.MerchantRequestID ===
        "string"
          ? data.MerchantRequestID
          : null;

      const checkoutRequestID =
        typeof data.CheckoutRequestID ===
        "string"
          ? data.CheckoutRequestID
          : null;

      const customerMessage =
        typeof data.CustomerMessage ===
        "string"
          ? data.CustomerMessage
          : "";

      /**
       * ========================================================
       * SAFE RESPONSE LOGGING
       * ========================================================
       *
       * We never log the original request payload.
       */

      console.log(
        "================================="
      );

      console.log(
        "M-PESA DIAGNOSTIC RESPONSE"
      );

      console.log(
        "================================="
      );

      console.log(
        "HTTP Status:",
        response.status
      );

      console.log(
        "ResponseCode:",
        responseCode
      );

      console.log(
        "ResponseDescription:",
        responseDescription
      );

      console.log(
        "MerchantRequestID:",
        merchantRequestID
      );

      console.log(
        "CheckoutRequestID:",
        checkoutRequestID
      );

      console.log(
        "CustomerMessage:",
        customerMessage
      );

      console.log(
        "================================="
      );

      /**
       * ========================================================
       * RETURN DIAGNOSTIC RESULT
       * ========================================================
       */

      return jsonResponse(
        {
          success:
            response.ok &&
            responseCode === "0",

          test: {
            businessShortCode:
              testBusinessShortCode,

            partyB:
              testTillNumber,

            storeNumber:
              testStoreNumber,

            transactionType:
              MPESA_TRANSACTION_TYPE,
          },

          safaricom: {
            httpStatus:
              response.status,

            responseCode,

            responseDescription,

            merchantRequestID,

            checkoutRequestID,

            customerMessage,
          },
        },
        response.ok
          ? 200
          : response.status
      );

    } catch (error) {
      /**
       * ========================================================
       * UNEXPECTED ERROR
       * ========================================================
       */

      console.error(
        "================================="
      );

      console.error(
        "M-PESA DIAGNOSTIC ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      return jsonResponse(
        {
          success: false,

          error:
            error instanceof Error
              ? error.message
              : "Internal server error.",
        },
        500
      );
    }
  }
);
