import { fal } from "@fal-ai/client";
import { FalVideoRequest, FalVideoResult } from "./falTypes";
import { falModelByTool } from "./falModels";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

function createGenerationId(): string {
  return (
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now())
  );
}

export async function generateFalVideo(
  request: FalVideoRequest
): Promise<FalVideoResult> {
  if (!import.meta.env.VITE_FAL_KEY) {
    throw new Error("VITE_FAL_KEY is not configured.");
  }

  const model = falModelByTool[request.tool];

  if (!model) {
    throw new Error(
      `${request.tool} is not connected to a fal.ai video model yet.`
    );
  }

  const isTextToVideo = request.tool === "Text to Video";
  const isImageToVideo = request.tool === "Photo to Video";

  if (!isTextToVideo && !isImageToVideo) {
    throw new Error(
      `${request.tool} is not connected to a supported fal.ai video model yet.`
    );
  }

  if (isImageToVideo && !request.imageUrl && !request.imageFile) {
    throw new Error(
      "Photo to Video requires an uploaded image."
    );
  }

  const generationId = createGenerationId();

  console.log("Starting real fal.ai video generation:", {
    tool: request.tool,
    model,
    prompt: request.prompt,
    hasImageFile: Boolean(request.imageFile),
    hasImageUrl: Boolean(request.imageUrl),
    durationSeconds: request.durationSeconds,
    aspectRatio: request.aspectRatio,
  });

  try {
    const input: Record<string, unknown> = {
      prompt: request.prompt,
      resolution: "480p",
      aspect_ratio:
        request.aspectRatio === "1:1"
          ? "1:1"
          : request.aspectRatio,
      num_frames: 81,
      frames_per_second: 16,
      enable_safety_checker: true,
      enable_prompt_expansion: false,
    };

    if (isImageToVideo) {
      input.image_url = request.imageFile ?? request.imageUrl;
    }

    const result = await fal.subscribe(model, {
      input,
      logs: true,
      onQueueUpdate(update) {
        console.log("fal.ai video queue update:", update);
      },
    });

    console.log("fal.ai real video result:", result);

    const videoUrl = result.data?.video?.url;

    if (!videoUrl) {
      throw new Error(
        "fal.ai completed but returned no video URL."
      );
    }

    return {
      id: generationId,
      status: "completed",
      videoUrl,
    };
  } catch (error) {
    console.error("fal.ai video generation failed:", error);

    return {
      id: generationId,
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "fal.ai video generation failed.",
    };
  }
}
