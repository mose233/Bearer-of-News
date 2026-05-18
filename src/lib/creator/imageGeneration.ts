export type GenerateImageSize = "1024x1024" | "1024x1536" | "1536x1024";

export type GeneratedImageResult = {
  imageBase64: string;
  mimeType: string;
};

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([new Uint8Array(byteNumbers)], {
    type: mimeType,
  });
}

export async function generateSceneImage(
  prompt: string,
  size: GenerateImageSize = "1024x1024"
) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      size,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error("Image generation failed:", result);
    throw new Error(result?.error || "Failed to generate image.");
  }

  const image = result as GeneratedImageResult & { ok: true };
  const blob = base64ToBlob(image.imageBase64, image.mimeType || "image/png");
  const previewUrl = URL.createObjectURL(blob);

  const file = new File([blob], `ai-scene-${Date.now()}.png`, {
    type: image.mimeType || "image/png",
  });

  return {
    file,
    previewUrl,
    blob,
  };
}
