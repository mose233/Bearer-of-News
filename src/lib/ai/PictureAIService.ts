import { fal } from "@fal-ai/client";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export interface PictureAIRequest {
  prompt: string;
  tool: string;
  style?: string;
  aspectRatio?: string;
  image?: File;
}

export interface PictureAIResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export class PictureAIService {
  static async generate(
    request: PictureAIRequest
  ): Promise<PictureAIResult> {
    try {
      const result = await fal.subscribe(
        "fal-ai/flux/dev",
        {
          input: {
            prompt: request.prompt,
          },
        }
      );

      const imageUrl =
        result.data.images?.[0]?.url;

      if (!imageUrl) {
        return {
          success: false,
          error: "No image returned.",
        };
      }

      return {
        success: true,
        imageUrl,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      };
    }
  }
}
