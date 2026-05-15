import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey:
    import.meta.env
      .VITE_ELEVENLABS_API_KEY,
});

export const generateVoice = async (
  text: string
) => {
  const audio =
    await client.generate({
      voice: "Rachel",
      text,
      model_id:
        "eleven_multilingual_v2",
    });

  return audio;
};
