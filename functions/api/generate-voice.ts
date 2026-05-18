export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const text = body.text;

    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({
          error: "Missing text",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = env.ELEVENLABS_API_KEY;
    const voiceId =
      env.ELEVENLABS_VOICE_ID || "t3QyKN6o4OpslvrclLKC";

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "env",
          error: "ELEVENLABS_API_KEY missing in Cloudflare",
          envKeys: Object.keys(env || {}),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(errorText, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const audio = await response.arrayBuffer();

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Voice generation failed",
        details: error?.message || String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
