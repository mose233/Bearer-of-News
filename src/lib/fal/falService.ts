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

const isImageToVideo = [
  "Photo to Video",
  "Image to Video",
  "Dance Animation",
  "Dancing",
  "Running",
  "Walking",
  "Exercising",
  "Boxing",
  "Basketball",
  "Tennis",
  "Swimming",
  "Cycling",
  "Jumping",
  "Cooking",
  "Eating",
  "Shopping",
  "Driving",
  "Playing Music",
  "Singing",
  "Working Out",
  "Horse Riding",
  "Skateboarding",
  "Football Match Fan",
  "Football Stadium Celebration",
  "Football Fan Celebration",
  "Football Training",
  "Football Match",
  "Fan at Football Match",
  "Political Rally",
  "Political Rally Crowd",
  "Political Campaign",
  "Campaign Event",
  "Political Speech",
  "Fan at Political Rally",
  "Political Rally in Nairobi",
  "Political Rally in Washington DC",
  "Election Campaign",
  "Election Rally",
  "Public Demonstration",
  "Street Crowd",
  "Public Event",
  "Celebration Crowd",
  "Concert",
  "On Stage",
  "Party",
  "Red Carpet",
  "Fashion Show",
  "Model Photoshoot",
  "Wedding Celebration",
  "Birthday Party",
  "Family Celebration",
  "Graduation Celebration",
  "Beach Party",
  "Yacht Party",
  "Nightlife",
  "Restaurant",
  "Café",
  "Fine Dining",
  "Luxury Hotel",
  "Safari",
  "At the Beach",
  "Tropical Island",
  "Travel Reel",
  "Tourist in Nairobi",
  "Tourist in London",
  "Tourist in Paris",
  "Tourist in New York",
  "Tourist in Dubai",
  "Tourist in Tokyo",
  "Tourist in Singapore",
  "Tourist in Rome",
  "Tourist in Barcelona",
  "Tourist in Sydney",
  "Tourist in Washington DC",
  "Tourist at Eiffel Tower",
  "Tourist at Times Square",
  "Tourist at Great Wall of China",
  "Tourist at Pyramids of Egypt",
  "Tourist at White House",
  "Tourist at Buckingham Palace",
  "Tourist at Statue of Liberty",
  "Tourist at Colosseum",
  "Tourist at Taj Mahal",
  "Tourist at Mount Fuji",
  "Camping",
  "Campfire",
  "Waterfall Adventure",
  "Forest Adventure",
  "Desert Adventure",
  "Snow Adventure",
  "Hiking",
  "Mountain Climbing",
  "At the Airport",
  "Inside an Airplane",
  "Luxury Train",
  "Luxury Car",
  "Yacht",
  "Helicopter Ride",
  "Skydiving",
  "Surfing",
  "Scuba Diving",
  "Kayaking",
  "Skiing",
  "Snowboarding",
  "Wakeboarding",
  "Rock Climbing",
  "Paragliding",
  "Bungee Jumping",
  "Cinematic Video",
  "Cinematic Slow Motion",
  "Camera Zoom",
  "Camera Pan",
  "Camera Orbit",
  "Drone Shot",
  "Close-Up Shot",
  "Action Scene",
  "Movie Scene",
  "Short Film",
  "Trailer Video",
  "Transformation Video",
].includes(request.tool);

const isTalkingAvatar = [
  "Talking Photo",
  "Talking Avatar",
  "AI Talking Avatar",
  "Lip Sync Video",
  "Singing Photo",
].includes(request.tool);

  if (!isTextToVideo && !isImageToVideo && !isTalkingAvatar) {
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

  if (isTalkingAvatar && !request.imageFile && !request.imageUrl) {
    return {
      id: generationId,
      status: "failed",
      error: "Talking Avatar requires an avatar image.",
    };
  }

  if (isTalkingAvatar && !request.audioBlob && !request.audioUrl) {
    return {
      id: generationId,
      status: "failed",
      error: "Talking Avatar requires generated voice audio.",
    };
  }

  const duration = normalizeDuration(request.durationSeconds);
  const aspectRatio = normalizeAspectRatio(request.aspectRatio);

  try {
    /*
     * ============================================================
     * TALKING AVATAR
     * fal.ai FlashTalk
     * ============================================================
     */

    if (isTalkingAvatar) {
      console.log(
        "Starting real fal.ai FlashTalk Talking Avatar generation:",
        {
          tool: request.tool,
          model,
          hasImageFile: Boolean(request.imageFile),
          hasImageUrl: Boolean(request.imageUrl),
          hasAudioBlob: Boolean(request.audioBlob),
          hasAudioUrl: Boolean(request.audioUrl),
          durationSeconds: duration,
          aspectRatio,
        }
      );

      let imageUrl = request.imageUrl;

      /*
       * Upload the avatar image to fal.ai storage when the caller
       * supplied a browser File.
       */
      if (request.imageFile) {
        console.log(
          "Uploading Talking Avatar image to fal.ai storage..."
        );

        imageUrl = await fal.storage.upload(
          request.imageFile
        );

        console.log(
          "Talking Avatar image uploaded:",
          imageUrl
        );
      }

      let audioUrl = request.audioUrl;

      /*
       * The existing xnewsapp.com voice system returns an
       * audio/mpeg Blob from ElevenLabs.
       *
       * Convert that Blob into a File and upload it to fal.ai
       * storage so FlashTalk receives a hosted audio URL.
       */
      if (request.audioBlob) {
        const audioFile = new File(
          [request.audioBlob],
          "talking-avatar-voice.mp3",
          {
            type: request.audioBlob.type || "audio/mpeg",
          }
        );

        console.log(
          "Uploading Talking Avatar voice to fal.ai storage:",
          {
            size: audioFile.size,
            type: audioFile.type,
          }
        );

        audioUrl = await fal.storage.upload(
          audioFile
        );

        console.log(
          "Talking Avatar audio uploaded:",
          audioUrl
        );
      }

      if (!imageUrl) {
        throw new Error(
          "Talking Avatar image upload did not return a URL."
        );
      }

      if (!audioUrl) {
        throw new Error(
          "Talking Avatar audio upload did not return a URL."
        );
      }

      const input = {
        image_url: imageUrl,
        audio_url: audioUrl,
      };

      console.log(
        "fal.ai FlashTalk request input:",
        {
          model,
          input,
        }
      );

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate(update) {
          console.log(
            "fal.ai FlashTalk queue update:",
            update
          );
        },
      });

      console.log(
        "fal.ai FlashTalk completed response:",
        result
      );

      console.log(
        "fal.ai FlashTalk response data:",
        result?.data
      );

      const videoUrl = result?.data?.video?.url;

      if (
        typeof videoUrl !== "string" ||
        videoUrl.trim().length === 0
      ) {
        throw new Error(
          "fal.ai FlashTalk completed but did not return the expected data.video.url."
        );
      }

      return {
        id: generationId,
        status: "completed",
        videoUrl,
      };
    }

    /*
     * ============================================================
     * EXISTING WAN 2.7 VIDEO GENERATION
     * ============================================================
     */

    console.log(
      "Starting real fal.ai Wan 2.7 video generation:",
      {
        tool: request.tool,
        model,
        prompt: request.prompt,
        hasImageFile: Boolean(request.imageFile),
        hasImageUrl: Boolean(request.imageUrl),
        durationSeconds: duration,
        aspectRatio,
      }
    );

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
      input.image_url =
        request.imageFile ?? request.imageUrl;
    }

    console.log(
      "fal.ai Wan 2.7 request input:",
      {
        model,
        input,
      }
    );

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

    console.log(
      "fal.ai Wan 2.7 completed response:",
      result
    );

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
      "fal.ai video generation failed:",
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
