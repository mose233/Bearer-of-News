import { fal } from "@fal-ai/client";

export type ImageGenerationRequest = {
  tool: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
  falApiKey: string;
};

export type ImageGenerationResult = {
  imageBase64: string;
  mimeType: string;
};

export class ImageProvider {
  static async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {

    fal.config({
      credentials: request.falApiKey,
    });

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: request.prompt,
      },
    });

    const imageUrl = result.data.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("fal.ai returned no image.");
    }

    // Download the generated image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error("Failed to download generated image.");
    }

    // Convert to Blob
    const blob = await imageResponse.blob();

    // Convert Blob → Base64
    const arrayBuffer = await blob.arrayBuffer();

    const bytes = new Uint8Array(arrayBuffer);

    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    const imageBase64 = btoa(binary);

    return {
      imageBase64,
      mimeType: blob.type || "image/png",
    };
  }
}
