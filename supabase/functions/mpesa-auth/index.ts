import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { getAccessToken } from "../_shared/mpesa.ts";
import { success, failure } from "../_shared/response.ts";

serve(async () => {
  try {
    const token = await getAccessToken();

    return success({
      accessToken: token,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
});
