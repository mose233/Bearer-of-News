export async function onRequestPost(context: any) {
  const { env } = context;

  return new Response(
    JSON.stringify({
      hasKey: !!env.OPENAI_API_KEY,
      keyType: typeof env.OPENAI_API_KEY,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
