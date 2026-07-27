import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://xnewsapp.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  console.log("METHOD:", req.method);

  if (req.method === "OPTIONS") {
    console.log("OPTIONS HIT");
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  console.log("POST HIT");

  return new Response(
    JSON.stringify({
      success: true,
      message: "Test function reached.",
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
