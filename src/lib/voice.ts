const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

const voiceId = "21m00Tcm4TlvDq8ikWAM";

export const generateVoice = async (text: string): Promise<Blob> => {
  if (!apiKey) {
    throw new Error("Missing VITE_ELEVENLABS_API_KEY");
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
    throw new Error(await response.text());
  }

  return await response.blob();
};