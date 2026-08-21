import { fal } from "@fal-ai/client";
import { FalVideoRequest, FalVideoResult } from "./falTypes";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export async function generateFalVideo(
  request: FalVideoRequest
): Promise<FalVideoResult> {
  if (!import.meta.env.VITE_FAL_KEY) {
    throw new Error("VITE_FAL_KEY is not configured.");
  }

  if (!request.imageUrl) {
    throw new Error("An image is required for Photo to Video.");
  }

  console.log("Starting fal.ai video generation:", {
    tool: request.tool,
    model: "fal-ai/wan-i2v",
    prompt: request.prompt,
    imageUrl: request.imageUrl,
    durationSeconds: request.durationSeconds,
    aspectRatio: request.aspectRatio,
  });

  try {
    const result = await fal.subscribe("fal-ai/wan-i2v", {
      input: {
        image_url: request.imageUrl,
        prompt: request.prompt,
      },
      logs: true,
      onQueueUpdate(update) {
        console.log("fal.ai queue update:", update);
      },
    });

    console.log("fal.ai video result:", result);

    const videoUrl = result.data?.video?.url;

    if (!videoUrl) {
      throw new Error("fal.ai completed but returned no video URL.");
    }

    return {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      status: "completed",
      videoUrl,
    };
  } catch (error) {
    console.error("fal.ai video generation failed:", error);

    return {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "fal.ai video generation failed.",
    };
  }
}
