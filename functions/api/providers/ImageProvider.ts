import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export type ImageGenerationRequest = {
  tool: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
};

export type ImageGenerationResult = {
  imageBase64: string;
  mimeType: string;
};

export class ImageProvider {
  static async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: request.prompt,
      },
    });

    const imageUrl = result.data.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("fal.ai returned no image.");
    }

    // We'll convert this URL to base64 in the next step.
    throw new Error("NEXT_STEP");
  }
}
