export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response(
        JSON.stringify({
          error: "Missing prompt",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional breaking news scriptwriter. Return JSON only.",
            },
            {
              role: "user",
              content: `
Generate:
1. Facebook caption
2. AI voice narration

Topic:
${prompt}

Return JSON:
{
  "caption": "...",
  "voiceScript": "..."
}
`,
            },
          ],
          temperature: 0.8,
        }),
      }
    );

    const data = await response.json();

    const content =
      data.choices?.[0]?.message?.content;

    return new Response(content, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Script generation failed",
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