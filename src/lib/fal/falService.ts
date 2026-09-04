import { fal } from "@fal-ai/client";
import { FalVideoRequest, FalVideoResult } from "./falTypes";
import { falModelByTool } from "./falModels";

const FAL_KEY = import.meta.env.VITE_FAL_KEY;

if (FAL_KEY) {
  fal.config({
    credentials: FAL_KEY,
  });
}

function createGenerationId(): string {
  return (
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now())
  );
}

function getFalErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown fal.ai generation error.";
  }
}

export async function generateFalVideo(
  request: FalVideoRequest
): Promise<FalVideoResult> {
  const generationId = createGenerationId();

  if (!FAL_KEY) {
    return {
      id: generationId,
      status: "failed",
      error: "VITE_FAL_KEY is not configured.",
    };
  }

  const model = falModelByTool[request.tool];

  if (!model) {
    return {
      id: generationId,
      status: "failed",
      error: `${request.tool} is not connected to a fal.ai video model yet.`,
    };
  }

  const isTextToVideo = request.tool === "Text to Video";
  const isImageToVideo = request.tool === "Photo to Video";

  if (!isTextToVideo && !isImageToVideo) {
    return {
      id: generationId,
      status: "failed",
      error: `${request.tool} is not connected to a supported fal.ai video model yet.`,
    };
  }

  if (!request.prompt?.trim()) {
    return {
      id: generationId,
      status: "failed",
      error: "A video generation prompt is required.",
    };
  }

  if (isImageToVideo && !request.imageFile && !request.imageUrl) {
    return {
      id: generationId,
      status: "failed",
      error: "Photo to Video requires an uploaded image.",
    };
  }

  try {
    console.log("Starting real fal.ai video generation:", {
      tool: request.tool,
      model,
      prompt: request.prompt,
      hasImageFile: Boolean(request.imageFile),
      hasImageUrl: Boolean(request.imageUrl),
      durationSeconds: request.durationSeconds,
      aspectRatio: request.aspectRatio,
    });

    const input: Record<string, unknown> = {
      prompt: request.prompt.trim(),
      resolution: "480p",
      num_frames: 81,
      frames_per_second: 16,
      enable_safety_checker: true,
      enable_prompt_expansion: false,
    };

    if (isTextToVideo) {
      input.aspect_ratio =
        request.aspectRatio === "9:16"
          ? "9:16"
          : "16:9";
    }

    if (isImageToVideo) {
      input.aspect_ratio =
        request.aspectRatio === "1:1"
          ? "1:1"
          : request.aspectRatio === "9:16"
            ? "9:16"
            : "16:9";

      if (request.imageFile) {
        input.image_url = request.imageFile;
      } else if (request.imageUrl) {
        input.image_url = request.imageUrl;
      }
    }

    console.log("fal.ai request input:", {
      model,
      input,
    });

    const result = await fal.subscribe(model, {
      input,
      logs: true,
      onQueueUpdate(update) {
        console.log("fal.ai video queue update:", update);
      },
    });

    console.log("fal.ai completed response:", result);
    console.log("fal.ai response data:", result?.data);

    const videoUrl = result?.data?.video?.url;

    if (
      typeof videoUrl !== "string" ||
      videoUrl.trim().length === 0
    ) {
      throw new Error(
        "fal.ai completed but did not return the expected data.video.url."
      );
    }

    return {
      id: generationId,
      status: "completed",
      videoUrl,
    };
  } catch (error) {
    const errorMessage = getFalErrorMessage(error);

    console.error("fal.ai video generation failed:", {
      tool: request.tool,
      model,
      error,
    });

    return {
      id: generationId,
      status: "failed",
      error: errorMessage,
    };
  }
}
