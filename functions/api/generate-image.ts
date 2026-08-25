import { ImageProvider } from "./providers/ImageProvider";

type Env = {
  FAL_API_KEY?: string;
  AI_ENABLED?: string;
};

type GenerateImageRequest = {
  prompt?: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024";
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  /*
   * Diagnostic check:
   * We never expose the actual FAL API key.
   * We only report whether it exists.
   */

  const aiEnabledRaw = context.env.AI_ENABLED;

  const aiEnabled =
    String(aiEnabledRaw ?? "")
      .trim()
      .toLowerCase() === "true";

  if (!aiEnabled) {
    return jsonResponse(
      {
        ok: false,
        stage: "disabled",
        error:
          "Picture AI is disabled by the Cloudflare runtime configuration.",
        diagnostic: {
          AI_ENABLED: aiEnabledRaw ?? "MISSING",
          AI_ENABLED_NORMALIZED: aiEnabled,
          FAL_API_KEY: context.env.FAL_API_KEY
            ? "PRESENT"
            : "MISSING",
        },
      },
      503
    );
  }

  try {
    const falApiKey = context.env.FAL_API_KEY;

    if (!falApiKey) {
      return jsonResponse(
        {
          ok: false,
          stage: "env",
          error: "FAL API key missing in Cloudflare.",
          diagnostic: {
            AI_ENABLED: aiEnabledRaw ?? "MISSING",
            AI_ENABLED_NORMALIZED: aiEnabled,
            FAL_API_KEY: "MISSING",
          },
        },
        500
      );
    }

    const body = (await context.request.json()) as GenerateImageRequest;

    const prompt = body.prompt?.trim();

    if (!prompt) {
      return jsonResponse(
        {
          ok: false,
          stage: "input",
          error: "Prompt is required.",
        },
        400
      );
    }

    const size = body.size || "1024x1024";

    const imagePrompt = `Create a clean, high-quality social media video scene image.

Style:
- cinematic
- clear subject
- suitable for Facebook, TikTok, Instagram, and YouTube Shorts
- no watermark
- no logos
- no random text unless requested
- visually strong and easy to understand

Scene:
${prompt}`;

    const image = await ImageProvider.generate({
      tool: "Text to Image",
      prompt: imagePrompt,
      size,
      falApiKey,
    });

    return jsonResponse({
      ok: true,
      imageBase64: image.imageBase64,
      mimeType: image.mimeType,
    });
  } catch (error) {
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
