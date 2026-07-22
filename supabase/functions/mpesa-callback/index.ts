import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method Not Allowed",
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const body = await req.json();

    console.log("========== MPESA CALLBACK ==========");
    console.log(JSON.stringify(body, null, 2));
    console.log("====================================");

    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid callback payload.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    } = callback;

    let receiptNumber: string | null = null;
    let amount: number | null = null;
    let phoneNumber: string | null = null;
    let transactionDate: string | null = null;

    const metadata = callback.CallbackMetadata?.Item ?? [];

    for (const item of metadata) {
      switch (item.Name) {
        case "MpesaReceiptNumber":
          receiptNumber = item.Value;
          break;

        case "Amount":
          amount = Number(item.Value);
          break;

        case "PhoneNumber":
          phoneNumber = String(item.Value);
          break;

        case "TransactionDate":
          transactionDate = String(item.Value);
          break;
      }
    }

    console.log("===== PAYMENT SUMMARY =====");
    console.log({
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      receiptNumber,
      amount,
      phoneNumber,
      transactionDate,
    });

    if (ResultCode === 0) {
      console.log("✅ PAYMENT SUCCESSFUL");

      const { error } = await supabase
        .from("payments")
        .upsert(
          {
            merchant_request_id: MerchantRequestID,
            checkout_request_id: CheckoutRequestID,
            mpesa_receipt_number: receiptNumber,
            phone_number: phoneNumber,
            amount,
            transaction_date: transactionDate,
            result_code: ResultCode,
            result_desc: ResultDesc,
            status: "paid",
          },
          {
            onConflict: "checkout_request_id",
          }
        );

      if (error) {
        console.error("Database Error:", error);
      } else {
        console.log("✅ Payment saved to database");
      }
    } else {
      console.log("❌ PAYMENT FAILED");

      const { error } = await supabase
        .from("payments")
        .upsert(
          {
            merchant_request_id: MerchantRequestID,
            checkout_request_id: CheckoutRequestID,
            result_code: ResultCode,
            result_desc: ResultDesc,
            status: "failed",
          },
          {
            onConflict: "checkout_request_id",
          }
        );

      if (error) {
        console.error("Database Error:", error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Callback Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
