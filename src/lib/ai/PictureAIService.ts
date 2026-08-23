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
  requestId?: string;
}

export class PictureAIService {
  static async generate(
    request: PictureAIRequest
  ): Promise<PictureAIResult> {
    try {
      const model = getPictureModel(request.tool);

      console.log("=================================");
      console.log("REAL FAL.AI GENERATION STARTING");
      console.log("FAL MODEL:", model);
      console.log("FAL REQUEST:", request);
      console.log(
        "FAL KEY AVAILABLE:",
        Boolean(import.meta.env.VITE_FAL_KEY)
      );
      console.log("=================================");

      const result = await fal.subscribe(model, {
        input: {
          prompt: request.prompt,
        },

        logs: true,

        onQueueUpdate: (update) => {
          console.log("FAL QUEUE UPDATE:", update);

          if (update.status === "IN_QUEUE") {
            console.log("FAL STATUS: Request is in queue.");
          }

          if (update.status === "IN_PROGRESS") {
            console.log("FAL STATUS: Generation is in progress.");

            if ("logs" in update && update.logs) {
              update.logs.forEach((log) => {
                console.log("FAL LOG:", log.message);
              });
            }
          }

          if (update.status === "COMPLETED") {
            console.log("FAL STATUS: Generation completed.");
          }
        },
      });

      console.log("=================================");
      console.log("FAL GENERATION COMPLETED");
      console.log("FAL REQUEST ID:", result.requestId);
      console.log("FAL RESULT:", result);
      console.log("FAL DATA:", result.data);
      console.log("=================================");

      const imageUrl = result.data.images?.[0]?.url;

      console.log("FAL IMAGE URL:", imageUrl);

      if (!imageUrl) {
        return {
          success: false,
          error: "fal.ai completed but returned no image URL.",
          requestId: result.requestId,
        };
      }

      return {
        success: true,
        imageUrl,
        requestId: result.requestId,
      };
    } catch (err) {
      console.error("=================================");
      console.error("FAL GENERATION ERROR");
      console.error(err);
      console.error("=================================");

      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown fal.ai generation error.",
      };
    }
  }
}
