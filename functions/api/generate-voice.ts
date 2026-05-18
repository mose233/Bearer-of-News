export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const body = await request.json().catch(() => null);

    if (!body) {
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "request_json",
          error: "Invalid JSON body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const text = body.text;
    const requestedVoice = body.voice || "alloy";

    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "validation",
          error: "Missing text",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "env",
          error: "OPENAI_API_KEY missing in Cloudflare",
          hasOpenAIKey: false,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const allowedVoices = ["alloy", "ash", "sage", "verse"];
    const safeVoice = allowedVoices.includes(requestedVoice)
      ? requestedVoice
      : "alloy";

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: safeVoice,
        input: text,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({
          ok: false,
          stage: "openai_response",
          status: response.status,
          openaiError: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const audio = await response.arrayBuffer();

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "X-XNews-Voice-Debug": "success",
        "X-XNews-Voice": safeVoice,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        stage: "catch",
        error: "Voice generation failed",
        details: error?.message || String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
