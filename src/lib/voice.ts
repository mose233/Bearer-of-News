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
    throw new Error(await response.text());
  }

  return await response.blob();
};
