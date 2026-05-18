export async function onRequestPost(context: any) {
  const { env } = context;

  return new Response(
    JSON.stringify({
      hasOpenAIKey: !!env.OPENAI_API_KEY,
      openAIKeyType: typeof env.OPENAI_API_KEY,
      envKeys: Object.keys(env || {}),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
