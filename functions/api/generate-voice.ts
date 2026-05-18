export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const apiKey =
      env.OPENAI_API_KEY ||
      env.VITE_OPENAI_API_KEY;

    const body = await request.json();
    const text = body.text;
    const requestedVoice = body.voice || "alloy";

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "env",
          error: "OpenAI key missing in Cloudflare",
          envKeys: Object.keys(env || {}),
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
        Authorization: `Bearer ${apiKey}`,
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
      return new Response(await response.text(), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(await response.arrayBuffer(), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
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
