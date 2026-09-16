import { ImageProvider } from "./providers/ImageProvider";

type Env = {
  FAL_API_KEY?: string;
  AI_ENABLED?: string;
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const aiEnabled =
    String(context.env.AI_ENABLED ?? "")
      .trim()
      .toLowerCase() === "true";

  if (!aiEnabled) {
    return jsonResponse(
      {
        ok: false,
        stage: "disabled",
        error:
          "Picture AI is disabled by the Cloudflare runtime configuration.",
      },
      503
    );
  }

  const falApiKey = context.env.FAL_API_KEY;

  if (!falApiKey) {
    return jsonResponse(
      {
        ok: false,
        stage: "env",
        error: "FAL API key missing in Cloudflare.",
      },
      500
    );
  }

  const requestId = new URL(context.request.url).searchParams.get("requestId");

  if (!requestId) {
    return jsonResponse(
      {
        ok: false,
        stage: "input",
        error: "requestId is required.",
      },
      400
    );
  }

  try {
    const result = await ImageProvider.getEditStatus(requestId, falApiKey);

    if (result.status === "IN_QUEUE") {
      return jsonResponse({
        ok: true,
        pending: true,
        status: result.status,
        queuePosition: result.queuePosition ?? null,
      });
    }

    if (result.status === "IN_PROGRESS") {
      return jsonResponse({
        ok: true,
        pending: true,
        status: result.status,
        logs: result.logs ?? [],
      });
    }

    if (result.status === "FAILED") {
      return jsonResponse(
        {
          ok: false,
          pending: false,
          status: "FAILED",
          stage: "fal.ai",
          error: result.error,
        },
        502
      );
    }

    return jsonResponse({
      ok: true,
      pending: false,
      status: "COMPLETED",
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error("Picture AI status server error:", error);

    return jsonResponse(
      {
        ok: false,
        stage: "server",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};
