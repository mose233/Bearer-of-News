import { fal } from "@fal-ai/client";
import { getPictureModel, PictureTool } from "./models";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export interface PictureAIRequest {
  prompt: string;
  tool: PictureTool;
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
      // Get the correct fal.ai model for the selected tool
      const model = getPictureModel(request.tool);

      console.log("FAL MODEL:", model);
      console.log("FAL REQUEST:", request);

      // Generate the image
      const result = await fal.subscribe(model, {
        input: {
          prompt: request.prompt,
        },
      });

      console.log("FAL RESULT:", result);

      const imageUrl = result.data.images?.[0]?.url;

      console.log("FAL IMAGE URL:", imageUrl);

      if (!imageUrl) {
        return {
          success: false,
          error: "No image returned from fal.ai.",
        };
      }

      return {
        success: true,
        imageUrl,
      };
    } catch (err) {
      console.error("FAL GENERATION ERROR:", err);

      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown error occurred.",
      };
    }
  }
}
