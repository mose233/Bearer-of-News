export async function onRequestPost(context: any) {
  try {
    const { request } = context;

    const body = await request.json();
    const text = body.text;

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        format: "mp3",
      }),
    });

    if (!response.ok) {
      return new Response(await response.text(), {
        status: response.status,
      });
    }

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
