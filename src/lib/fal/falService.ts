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

function normalizeDuration(durationSeconds: number): number {
  if (!Number.isFinite(durationSeconds)) {
    return 5;
  }

  return Math.min(
    15,
    Math.max(2, Math.round(durationSeconds))
  );
}

function normalizeAspectRatio(
  aspectRatio: FalVideoRequest["aspectRatio"]
): string {
  switch (aspectRatio) {
    case "9:16":
      return "9:16";

    case "1:1":
      return "1:1";

    case "16:9":
    default:
      return "16:9";
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

  const duration = normalizeDuration(request.durationSeconds);
  const aspectRatio = normalizeAspectRatio(request.aspectRatio);

  try {
    console.log("Starting real fal.ai Wan 2.7 video generation:", {
      tool: request.tool,
      model,
      prompt: request.prompt,
      hasImageFile: Boolean(request.imageFile),
      hasImageUrl: Boolean(request.imageUrl),
      durationSeconds: duration,
      aspectRatio,
    });

    const input: Record<string, unknown> = {
      prompt: request.prompt.trim(),
      resolution: "720p",
      duration,
      enable_safety_checker: true,
      enable_prompt_expansion: true,
    };

    if (isTextToVideo) {
      input.aspect_ratio = aspectRatio;
    }

    if (isImageToVideo) {
      input.image_url = request.imageFile ?? request.imageUrl;
    }

    console.log("fal.ai Wan 2.7 request input:", {
      model,
      input,
    });

    const result = await fal.subscribe(model, {
      input,
      logs: true,
      onQueueUpdate(update) {
        console.log(
          "fal.ai Wan 2.7 video queue update:",
          update
        );
      },
    });

    console.log("fal.ai Wan 2.7 completed response:", result);
    console.log(
      "fal.ai Wan 2.7 response data:",
      result?.data
    );

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

    console.error(
      "fal.ai Wan 2.7 video generation failed:",
      {
        tool: request.tool,
        model,
        error,
      }
    );

    return {
      id: generationId,
      status: "failed",
      error: errorMessage,
    };
  }
}
