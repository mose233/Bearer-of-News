export const generateVoice = async (
  text: string
): Promise<Blob> => {
  if (!text.trim()) {
    throw new Error("Missing voice text");
  }

  const response = await fetch("/api/generate-voice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.blob();
};
