import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  // Safaricom callbacks use POST
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

    let receiptNumber = null;
    let amount = null;
    let phoneNumber = null;
    let transactionDate = null;

    const metadata = callback.CallbackMetadata?.Item ?? [];

    for (const item of metadata) {
      switch (item.Name) {
        case "MpesaReceiptNumber":
          receiptNumber = item.Value;
          break;

        case "Amount":
          amount = item.Value;
          break;

        case "PhoneNumber":
          phoneNumber = item.Value;
          break;

        case "TransactionDate":
          transactionDate = item.Value;
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

      // Next step:
      // Save payment to Supabase
      // Trigger AI generation
    } else {
      console.log("❌ PAYMENT FAILED");
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
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
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
