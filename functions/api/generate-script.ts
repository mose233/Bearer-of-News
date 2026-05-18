export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt || !prompt.trim()) {
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

    const apiKey = env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY missing in Cloudflare",
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
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional breaking news scriptwriter for XNewsApp. Return JSON only.",
            },
            {
              role: "user",
              content: `
Create a short professional news package from this topic:

${prompt}

Return JSON in this format:
{
  "caption": "Facebook-ready caption with hashtags",
  "voiceScript": "30-45 second professional voice script"
}
`,
            },
          ],
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!response.ok) {
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned");
    }

    const parsed = JSON.parse(content);

    return new Response(
      JSON.stringify({
        caption: parsed.caption || "",
        voiceScript: parsed.voiceScript || "",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Script generation failed",
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
