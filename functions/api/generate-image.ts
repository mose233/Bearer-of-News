import { ImageProvider } from "./providers/ImageProvider";

type Env = {
  FAL_API_KEY?: string;
  AI_ENABLED?: string;
};

type GenerateImageRequest = {
  prompt?: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024";
  imageData?: string;
  tool?: string;
  style?: string;
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
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
          FAL_API_KEY: context.env.FAL_API_KEY ? "PRESENT" : "MISSING",
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

    // Uploaded-photo editing is asynchronous. We submit to fal.ai and return
    // immediately with a request ID so Cloudflare never waits for the AI job.
    if (body.imageData) {
      console.log("=================================");
      console.log("FAL.AI IMAGE-TO-IMAGE EDITING STARTED");
      console.log("Model: fal-ai/flux-kontext/dev");
      console.log("Tool:", body.tool ?? "Image Editing");
      console.log("Prompt:", prompt);
      console.log("Uploaded image present: YES");
      console.log("=================================");

      const job = await ImageProvider.submitEdit({
        tool: body.tool ?? "Image Editing",
        prompt,
        imageData: body.imageData,
        falApiKey,
      });

      return jsonResponse({
        ok: true,
        pending: true,
        requestId: job.requestId,
      });
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
