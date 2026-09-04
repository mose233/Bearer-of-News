import { ImageProvider } from "./providers/ImageProvider";

type Env = {
  FAL_API_KEY?: string;
  AI_ENABLED?: string;
};

type GenerateImageRequest = {
  prompt?: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024";
  imageData?: string;
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

    /*
     * ============================================================
     * IMAGE-TO-IMAGE / UPLOADED PHOTO EDITING
     * ============================================================
     *
     * When imageData is supplied, use fal.ai FLUX Kontext [dev].
     *
     * This is intentionally separate from the existing text-to-image
     * path below so the current Picture AI text generation continues
     * working exactly as before.
     */
    if (body.imageData) {
      console.log("=================================");
      console.log("FAL.AI IMAGE-TO-IMAGE EDITING");
      console.log("Model: fal-ai/flux-kontext/dev");
      console.log("Prompt:", prompt);
      console.log("Uploaded image present: YES");
      console.log("=================================");

      const image = await ImageProvider.edit({
        tool: "Image Editing",
        prompt,
        imageData: body.imageData,
        falApiKey,
      });

      return jsonResponse({
        ok: true,
        imageBase64: image.imageBase64,
        mimeType: image.mimeType,
      });
    }

    /*
     * ============================================================
     * EXISTING TEXT-TO-IMAGE PATH
     * ============================================================
     *
     * DO NOT CHANGE this behavior.
     *
     * Prompt-based Picture AI continues to use fal-ai/flux/dev
     * through ImageProvider.generate().
     */
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
    console.error("Picture AI server error:", error);

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
