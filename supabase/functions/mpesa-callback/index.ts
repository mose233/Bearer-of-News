import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();

    console.log("========== MPESA CALLBACK ==========");
    console.log(JSON.stringify(body, null, 2));
    console.log("====================================");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Callback received successfully.",
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
          error instanceof Error ? error.message : "Unknown error",
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
