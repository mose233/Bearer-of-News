export type VoiceGenerationResult = {
  ok: boolean;
  blob: Blob | null;
  error?: string;
};

export const generateVoice = async (
  text: string,
  voice: string = "alloy"
): Promise<Blob> => {
  if (!text.trim()) {
    throw new Error("Missing voice text");
  }

  const response = await fetch("/api/generate-voice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Voice generation failed. API key may be missing."
    );
  }

  return await response.blob();
};

export const tryGenerateVoice = async (
  text: string,
  voice: string = "alloy"
): Promise<VoiceGenerationResult> => {
  try {
    const blob = await generateVoice(text, voice);

    return {
      ok: true,
      blob,
    };
  } catch (error) {
    console.warn("Voice generation fallback:", error);

    return {
      ok: false,
      blob: null,
      error:
        error instanceof Error
          ? error.message
          : "Voice generation failed. Use browser voice preview or add an API key.",
    };
  }
};
