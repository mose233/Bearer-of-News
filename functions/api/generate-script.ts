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

    if (!env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Missing GROQ_API_KEY",
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
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a professional breaking news scriptwriter for XNewsApp. Return JSON only. Do not include markdown.",
            },
            {
              role: "user",
              content: `
Create a short professional news package from this topic:

${prompt}

Return valid JSON only in this exact format:
{
  "caption": "A Facebook-ready caption with a strong news hook and 1-3 hashtags.",
  "voiceScript": "A clear 30-45 second news voiceover script."
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
      const errorText = await response.text();

      return new Response(
        JSON.stringify({
          error: "Groq request failed",
          details: errorText,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({
          error: "No script returned from Groq",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON returned from Groq",
          raw: content,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

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
