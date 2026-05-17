export async function onRequestPost(context: any) {
  try {
    const { request } = context;

    const body = await request.json();
    const text = body.text;

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/t3QyKN6o4OpslvrclLKC",
      {
        method: "POST",
        headers: {
          "xi-api-key": "PASTE_YOUR_EXACT_NEW_ELEVENLABS_KEY_HERE",
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

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
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
