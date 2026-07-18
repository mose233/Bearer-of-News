type Env = {
OPENAI_API_KEY?: string;
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

  if (context.env.AI_ENABLED !== "true") {
    return jsonResponse(
      {
        ok: false,
        stage: "disabled",
        error: "Picture AI is temporarily disabled while we integrate M-Pesa and fal.ai.",
      },
      503
    );
  }

  try {
    const apiKey = context.env.OPENAI_API_KEY;

    if (!apiKey) {
      return jsonResponse(
        {
          ok: false,
          stage: "env",
          error: "OpenAI key missing in Cloudflare",
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
          error: "Prompt is required",
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

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size,
        quality: "medium",
        n: 1,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return jsonResponse(
        {
          ok: false,
          stage: "openai",
          status: response.status,
          error: result,
        },
        response.status
      );
    }

    const b64 = result?.data?.[0]?.b64_json;

    if (!b64) {
      return jsonResponse(
        {
          ok: false,
          stage: "parse",
          error: "No image returned from OpenAI",
          raw: result,
        },
        500
      );
    }

    return jsonResponse({
      ok: true,
      imageBase64: b64,
      mimeType: "image/png",
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
