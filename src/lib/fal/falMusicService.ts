import { fal } from "@fal-ai/client";

const FAL_KEY = import.meta.env.VITE_FAL_KEY;

if (FAL_KEY) {
  fal.config({
    credentials: FAL_KEY,
  });
}

export type FalMusicRequest = {
  prompt: string;
  lyrics: string;
  durationSeconds: number;
};

export type FalMusicResult = {
  id: string;
  status: "completed" | "failed";
  audioUrl?: string;
  durationSeconds?: number;
  error?: string;
};

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
    return "Unknown fal.ai music generation error.";
  }
}

function normalizeDuration(durationSeconds: number): number {
  if (!Number.isFinite(durationSeconds)) {
    return 60;
  }

  return Math.min(300, Math.max(10, Math.round(durationSeconds)));
}

export async function generateFalMusic(
  request: FalMusicRequest
): Promise<FalMusicResult> {
  const generationId = createGenerationId();

  if (!FAL_KEY) {
    return {
      id: generationId,
      status: "failed",
      error: "VITE_FAL_KEY is not configured.",
    };
  }

  if (!request.prompt?.trim()) {
    return {
      id: generationId,
      status: "failed",
      error: "A music generation prompt is required.",
    };
  }

  if (!request.lyrics?.trim()) {
    return {
      id: generationId,
      status: "failed",
      error: "Lyrics or song instructions are required.",
    };
  }

  const duration = normalizeDuration(request.durationSeconds);

  try {
    console.log("Starting real fal.ai MiniMax Music 3 generation:", {
      model: "minimax/music-3",
      prompt: request.prompt,
      lyricsLength: request.lyrics.length,
      durationSeconds: duration,
    });

    const result = await fal.subscribe("minimax/music-3", {
      input: {
        prompt: request.prompt.trim(),
        lyrics: request.lyrics.trim(),
        duration,
      },
      logs: true,
      onQueueUpdate(update) {
        console.log("fal.ai MiniMax Music 3 queue update:", update);
      },
    });

    // DEBUG: inspect exactly what fal.ai returned.
    console.log(
      "fal.ai MiniMax Music 3 raw result:",
      result
    );

    const audioUrl = result?.data?.audio?.url;
    const actualDuration = result?.data?.duration;

    if (typeof audioUrl !== "string" || audioUrl.trim().length === 0) {
      throw new Error(
        "fal.ai completed but did not return the expected data.audio.url."
      );
    }

    return {
      id: generationId,
      status: "completed",
      audioUrl,
      durationSeconds:
        typeof actualDuration === "number" ? actualDuration : duration,
    };
  } catch (error) {
    const errorMessage = getFalErrorMessage(error);

    console.error(
      "fal.ai MiniMax Music 3 generation failed:",
      error
    );

    return {
      id: generationId,
      status: "failed",
      error: errorMessage,
    };
  }
}
